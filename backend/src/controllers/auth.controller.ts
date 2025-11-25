import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

// TODO: Reemplazar con Prisma cuando esté configurado
// import { prisma } from '../utils/prisma';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    // TODO: Implementar con Prisma
    // const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    // if (existingUser) {
    //   throw new AppError('El usuario ya existe', 400);
    // }

    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // const user = await prisma.user.create({
    //   data: {
    //     email: data.email,
    //     password: hashedPassword,
    //     name: data.name,
    //     role: 'user',
    //   },
    // });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      // user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    // TODO: Implementar con Prisma
    // const user = await prisma.user.findUnique({ where: { email: data.email } });
    // if (!user) {
    //   throw new AppError('Credenciales inválidas', 401);
    // }

    // const isValidPassword = await bcrypt.compare(data.password, user.password);
    // if (!isValidPassword) {
    //   throw new AppError('Credenciales inválidas', 401);
    // }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no configurado');
    }

    // const token = jwt.sign(
    //   { userId: user.id, role: user.role },
    //   jwtSecret,
    //   { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    // );

    res.json({
      success: true,
      message: 'Login exitoso',
      // token,
      // user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

