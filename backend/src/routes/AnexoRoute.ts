import { Router } from 'express';
import {  getAnexoId, getAnexos, inserirAnexo } from '../controllers/anexoController';
import { upload } from '../middlewares/upload';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';
const router = Router();

// Rota para buscar anexos por ID de ticket ou resposta
router.get('/:id',notLoggedMiddleware, getAnexoId);

// Rota para fazer o download de um anexo específico
router.get('/getAnexo/:id',notLoggedMiddleware, getAnexos);

router.post('/createAnexo',notLoggedMiddleware, upload.array("anexos"), inserirAnexo);

export default router;
