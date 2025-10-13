import { Router } from "express";

import { createAnotacao } from "../controllers/anotacaoController";

const router = Router();


router.post('/createAnotacao', createAnotacao);


export default router