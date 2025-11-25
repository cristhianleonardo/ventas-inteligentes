import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implementar con Prisma
    // const user = await prisma.user.findUnique({
    //   where: { id: req.userId },
    //   select: { id: true, email: true, name: true, role: true, createdAt: true },
    // });

    res.json({
      success: true,
      // user,
      message: 'Perfil obtenido (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implementar con Prisma
    res.json({
      success: true,
      message: 'Perfil actualizado (pendiente implementación con BD)',
    });
  } catch (error) {
    next(error);
  }
};

