import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
});

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implementar con Prisma
    res.json({
      success: true,
      products: [],
      message: 'Lista de productos (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // TODO: Implementar con Prisma
    res.json({
      success: true,
      product: { id },
      message: 'Producto obtenido (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = productSchema.parse(req.body);
    // TODO: Implementar con Prisma
    res.status(201).json({
      success: true,
      product: data,
      message: 'Producto creado (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);
    // TODO: Implementar con Prisma
    res.json({
      success: true,
      product: { id, ...data },
      message: 'Producto actualizado (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // TODO: Implementar con Prisma
    res.json({
      success: true,
      message: 'Producto eliminado (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

