import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/auth.middleware';
import {
  getRecommendations,
  getSimilarProducts,
  trainModel,
  getModelAccuracy,
} from '../controllers/recommendation.controller';

const router = Router();

// Rutas públicas
router.get('/product/:productId', getSimilarProducts);

// Rutas autenticadas
router.get('/user/:userId', authenticate, getRecommendations);

// Rutas de administración (solo admin)
router.post('/train', authenticate, requireRole('admin'), trainModel);
router.get('/accuracy', authenticate, requireRole('admin'), getModelAccuracy);

export default router;

