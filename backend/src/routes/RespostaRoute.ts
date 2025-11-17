import { Router } from 'express';

import { createResposta, getResposta, marcarComoLida, getRespostasNaoLidas } from '../controllers/respostasController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/createResposta',notLoggedMiddleware, upload.array("arquivos"), createResposta)
router.get('/getRespostas',notLoggedMiddleware, getResposta)
router.put('/updateResposta',notLoggedMiddleware, marcarComoLida )
router.get('/getNaoLidas',notLoggedMiddleware, getRespostasNaoLidas)


export default router;