import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implementar con Prisma
    res.status(201).json({
      success: true,
      message: 'Orden creada (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implementar con Prisma
    res.json({
      success: true,
      orders: [],
      message: 'Órdenes obtenidas (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // TODO: Implementar con Prisma
    res.json({
      success: true,
      order: { id },
      message: 'Orden obtenida (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

