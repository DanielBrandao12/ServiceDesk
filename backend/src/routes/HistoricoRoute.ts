import { Router } from 'express';

import { getHistorico } from '../controllers/historicoStatusController';

const router = Router();

router.get('/:id', getHistorico)

export default router;