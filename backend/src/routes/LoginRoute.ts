import { Router } from 'express';

import { handleLogin, logout } from '../controllers/loginController';

const router = Router();

router.post('/login', handleLogin)
router.get('/logout', logout)

export default router;