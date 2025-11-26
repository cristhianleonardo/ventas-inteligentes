import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

// VI-89: Ver mi carrito para revisar lo que voy a comprar
export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Crear carrito si no existe
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: req.userId!,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.json({
      success: true,
      cart: {
        id: cart.id,
        items: cart.items,
        total: parseFloat(total.toFixed(2)),
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// VI-88: Agregar productos al carrito
export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity = 1 } = z
      .object({
        productId: z.string(),
        quantity: z.number().int().positive().default(1),
      })
      .parse(req.body);

    // Verificar que el producto existe y tiene stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Stock insuficiente', 400);
    }

    // Obtener o crear carrito
    let cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.userId! },
      });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    let cartItem;
    if (existingItem) {
      // Actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new AppError('Stock insuficiente para la cantidad solicitada', 400);
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    } else {
      // Crear nuevo item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: { product: true },
      });
    }

    res.json({
      success: true,
      message: 'Producto agregado al carrito',
      item: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

// VI-90: Actualizar cantidades o eliminar productos del carrito
export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { itemId } = req.params;
    const { quantity } = z.object({ quantity: z.number().int().positive() }).parse(req.body);

    // Verificar que el item pertenece al usuario
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      throw new AppError('Item no encontrado', 404);
    }

    if (cartItem.cart.userId !== req.userId) {
      throw new AppError('No autorizado', 403);
    }

    // Verificar stock
    if (cartItem.product.stock < quantity) {
      throw new AppError('Stock insuficiente', 400);
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });

    res.json({
      success: true,
      message: 'Item del carrito actualizado',
      item: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { itemId } = req.params;

    // Verificar que el item pertenece al usuario
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new AppError('Item no encontrado', 404);
    }

    if (cartItem.cart.userId !== req.userId) {
      throw new AppError('No autorizado', 403);
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    res.json({
      success: true,
      message: 'Item eliminado del carrito',
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.json({
      success: true,
      message: 'Carrito vaciado',
    });
  } catch (error) {
    next(error);
  }
};

