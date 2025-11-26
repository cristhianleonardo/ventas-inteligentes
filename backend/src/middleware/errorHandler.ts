import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Manejo de errores de Zod
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    logger.error({
      error: message,
      path: req.path,
      method: req.method,
      zodErrors: err.errors,
    });

    return res.status(400).json({
      success: false,
      error: {
        message: 'Error de validación: ' + message,
        details: err.errors,
      },
    });
  }

  // Manejo de AppError
  if (err instanceof AppError || err.statusCode) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    logger.error({
      error: message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    });
  }

  // Manejo de errores genéricos
  const statusCode = 500;
  const message = err.message || 'Error interno del servidor';

  logger.error({
    error: message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

