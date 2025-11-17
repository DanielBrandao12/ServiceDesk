import { Router } from 'express';

import { createTickets, updateTicket, getTickets, getTicketsId, deleteTicket, getTicketsClose, getDashboardData } from '../controllers/ticketsController';
import { checkEmails } from '../controllers/emailController';
import notLoggedMiddleware from '../middlewares/notLoggedMiddlewares';

const router = Router();

// Rota para verificar e-mails
router.get('/verificar-emails', async (req, res) => {
  try {
    await checkEmails();
    res.status(200).send('E-mails verificados com sucesso.');
  } catch (error) {
    console.error('Erro ao verificar e-mails:', error);
    res.status(500).send('Erro ao verificar e-mails.');
  }
});

router.post('/createTicket',notLoggedMiddleware, createTickets);
router.put('/updateTicket/:id',notLoggedMiddleware, updateTicket);
router.get('/',notLoggedMiddleware, getTickets);
router.get('/dashboard/:periodo',notLoggedMiddleware, getDashboardData);
router.get('/closes',notLoggedMiddleware, getTicketsClose);
router.get('/:id',notLoggedMiddleware, getTicketsId);
router.delete('/delete/:id',notLoggedMiddleware, deleteTicket);

export default router;