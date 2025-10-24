import { Router } from 'express';

import { createTickets, updateTicket, getTickets, getTicketsId, deleteTicket, getTicketsClose, getDashboardData } from '../controllers/ticketsController';
import { checkEmails } from '../controllers/emailController';

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

router.post('/createTicket', createTickets);
router.put('/updateTicket/:id', updateTicket);
router.get('/', getTickets);
router.get('/dashboard', getDashboardData);
router.get('/closes', getTicketsClose);
router.get('/:id', getTicketsId);
router.delete('/delete/:id', deleteTicket);

export default router;