import { Router } from 'express';
import { login, register, requestPasswordReset, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/password/reset-request', requestPasswordReset);
router.post('/password/reset', resetPassword);

export default router;

