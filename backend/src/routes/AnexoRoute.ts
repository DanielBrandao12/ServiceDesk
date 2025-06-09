import { Router } from 'express';
import { getAnexoId, getAnexos } from '../controllers/anexoController';

const router = Router();

// Rota para buscar anexos por ID de ticket ou resposta
router.get('/:id', getAnexoId);

// Rota para fazer o download de um anexo específico
router.get('/anexo/:id', getAnexos);

export default router;
