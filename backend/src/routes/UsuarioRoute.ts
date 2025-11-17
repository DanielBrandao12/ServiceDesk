import { Router } from 'express';

import { createUser, updateUser, getUserId, getUserAll } from '../controllers/usuarioController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';

const router = Router();


router.post('/createUser',notLoggedMiddleware, createUser)
router.put('/updateUser/:id',notLoggedMiddleware, updateUser)
router.get('/:id',notLoggedMiddleware, getUserId)
router.get('/',notLoggedMiddleware, getUserAll)

export default router;