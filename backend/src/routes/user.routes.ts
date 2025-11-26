import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

// Rutas de perfil (cualquier usuario autenticado)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Rutas de administración (solo admin)
router.get('/', authenticate, requireRole('admin'), getAllUsers);
router.get('/:id', authenticate, requireRole('admin'), getUserById);
router.put('/:id/role', authenticate, requireRole('admin'), updateUserRole);
router.delete('/:id', authenticate, requireRole('admin'), deleteUser);

export default router;

