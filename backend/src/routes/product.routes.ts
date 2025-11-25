import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protegidas (solo admin)
router.post('/', authenticate, requireRole('admin'), createProduct);
router.put('/:id', authenticate, requireRole('admin'), updateProduct);
router.delete('/:id', authenticate, requireRole('admin'), deleteProduct);

export default router;

