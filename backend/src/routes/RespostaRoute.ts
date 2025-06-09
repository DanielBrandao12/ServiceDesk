import { Router } from 'express';

import { createResposta, getResposta, marcarComoLida, getRespostasNaoLidas } from '../controllers/respostasController';

const router = Router();

router.post('/createResposta', createResposta)
router.get('/getRespostas', getResposta)
router.put('/updateResposta', marcarComoLida )
router.get('/getNaoLidas', getRespostasNaoLidas)


export default router;