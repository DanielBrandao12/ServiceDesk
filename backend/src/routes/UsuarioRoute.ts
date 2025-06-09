import { Router } from 'express';

import { createUser, updateUser, getUserId, getUserAll } from '../controllers/usuarioController';

const router = Router();


router.post('/createUser', createUser)
router.put('/updateUser/:id', updateUser)
router.get('/:id', getUserId)
router.get('/', getUserAll)

export default router;