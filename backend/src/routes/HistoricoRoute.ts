import { Router } from 'express';

import { getHistorico } from '../controllers/historicoStatusController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';

const router = Router();

router.get('/:id',notLoggedMiddleware, getHistorico)

export default router;