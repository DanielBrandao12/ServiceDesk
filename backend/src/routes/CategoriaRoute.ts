import { Router } from 'express';

import { createCategoria, updateCategoria, deleteCategoria, getAllCategoria, getIdCategoria } from '../controllers/categoriaController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';

const router = Router();

router.post('/createCategory',notLoggedMiddleware, createCategoria)
router.put('/editCategory',notLoggedMiddleware, updateCategoria)
router.delete('/deleteCategory',notLoggedMiddleware, deleteCategoria)
router.get('/',notLoggedMiddleware, getAllCategoria)
router.get('/:id',notLoggedMiddleware, getIdCategoria)

export default router;