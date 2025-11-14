import { Router } from 'express';

import { getRelatorio } from '../controllers/relatorioController';


const router = Router();



router.post('/', getRelatorio);

export default router;