import { Router } from 'express';

import { getRelatorio } from '../controllers/relatorioController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';


const router = Router();



router.post('/',notLoggedMiddleware, getRelatorio);

export default router;