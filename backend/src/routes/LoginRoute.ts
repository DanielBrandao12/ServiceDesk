import { Router } from 'express';

import { handleLogin, logout } from '../controllers/loginController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';

const router = Router();

router.post('/login', handleLogin)
router.get('/logout', logout)

router.get("/validate", notLoggedMiddleware, (req : any, res: any) => {
  return res.status(200).json({ autenticado: true });
});

export default router;