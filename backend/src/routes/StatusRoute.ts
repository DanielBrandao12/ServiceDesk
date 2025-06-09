import { Router } from 'express';

import { createStatus, updateStatus, getStatus, getStatusId, deleteStatus } from '../controllers/statusController';

const router = Router();

router.post('/createStatus', createStatus)
router.put('/updateStatus', updateStatus)
router.get('/', getStatus)
router.get('/:id', getStatusId)
router.delete('/deleteStatus', deleteStatus)

export default router;