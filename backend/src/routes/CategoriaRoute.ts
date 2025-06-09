import { Router } from 'express';

import { createCategoria, updateCategoria, deleteCategoria, getAllCategoria, getIdCategoria } from '../controllers/categoriaController';

const router = Router();

router.post('/createCategory', createCategoria)
router.put('/editCategory', updateCategoria)
router.delete('/deleteCategory', deleteCategoria)
router.get('/', getAllCategoria)
router.get('/:id', getIdCategoria)

export default router;