import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
});

// VI-60: Visualización del inventario
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (category) {
      where.category = category as string;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// VI-57: Creación de productos
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = productSchema.parse(req.body);

    const product = await prisma.product.create({
      data,
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// VI-58: Edición de productos
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// VI-59: Eliminación de productos
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// VI-61: Control de stock automático
export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = z
      .object({
        quantity: z.number().int().positive(),
        operation: z.enum(['add', 'subtract', 'set']),
      })
      .parse(req.body);

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    let newStock: number;
    switch (operation) {
      case 'add':
        newStock = product.stock + quantity;
        break;
      case 'subtract':
        newStock = Math.max(0, product.stock - quantity);
        break;
      case 'set':
        newStock = quantity;
        break;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });

    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

