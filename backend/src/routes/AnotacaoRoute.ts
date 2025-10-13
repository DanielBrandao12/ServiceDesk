import { Router } from "express";

import { createAnotacao, getAnotacaoId } from "../controllers/anotacaoController";

const router = Router();


router.post('/createAnotacao', createAnotacao);

router.get('/:id', getAnotacaoId)


export default router