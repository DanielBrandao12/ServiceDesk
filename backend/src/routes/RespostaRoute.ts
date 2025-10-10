import { Router } from 'express';

import { createResposta, getResposta, marcarComoLida, getRespostasNaoLidas } from '../controllers/respostasController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/createResposta',upload.array("arquivos"), createResposta)
router.get('/getRespostas',notLoggedMiddleware, getResposta)
router.put('/updateResposta', marcarComoLida )
router.get('/getNaoLidas', getRespostasNaoLidas)


export default router;