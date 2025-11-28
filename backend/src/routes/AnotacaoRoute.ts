import { Router } from "express";

import { createAnotacao, getAnotacaoId } from "../controllers/anotacaoController";
import notLoggedMiddleware from "../middlewares/notLoggedMiddlewares";

const router = Router();


router.post('/createAnotacao',notLoggedMiddleware, createAnotacao);

router.get('/:id',notLoggedMiddleware, getAnotacaoId)


export default router