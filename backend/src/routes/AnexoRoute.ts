import { Router } from 'express';
import {  getAnexoId, getAnexos, inserirAnexo } from '../controllers/anexoController';
import { upload } from '../middlewares/upload';
const router = Router();

// Rota para buscar anexos por ID de ticket ou resposta
router.get('/:id', getAnexoId);

// Rota para fazer o download de um anexo específico
router.get('/getAnexo/:id', getAnexos);

router.post('/createAnexo', upload.array("anexos"), inserirAnexo);

export default router;
