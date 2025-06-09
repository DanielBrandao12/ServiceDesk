import { Router } from 'express';

import { createResposta, getResposta, marcarComoLida, getRespostasNaoLidas } from '../controllers/respostasController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';

const router = Router();

router.post('/createResposta', createResposta)
router.get('/getRespostas',notLoggedMiddleware, getResposta)
router.put('/updateResposta',notLoggedMiddleware, marcarComoLida )
router.get('/getNaoLidas', getRespostasNaoLidas)


export default router;