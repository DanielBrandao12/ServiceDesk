import { Router } from 'express';

import { createStatus, updateStatus, getStatus, getStatusId, deleteStatus } from '../controllers/statusController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';

const router = Router();

router.post('/createStatus',notLoggedMiddleware, createStatus)
router.put('/updateStatus',notLoggedMiddleware, updateStatus)
router.get('/',notLoggedMiddleware, getStatus)
router.get('/:id',notLoggedMiddleware, getStatusId)
router.delete('/deleteStatus',notLoggedMiddleware, deleteStatus)

export default router;