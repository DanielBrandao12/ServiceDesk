// src/app.ts
import express from 'express';
import session from 'express-session';
import cors from 'cors';

import anexoRoutes from './routes/AnexoRoute';
import usuairoRoutes from './routes/UsuarioRoute';
import categoriaRoutes from './routes/CategoriaRoute';
import historicoRoutes from './routes/HistoricoRoute';
import authRoutes from './routes/LoginRoute';
//import relatorio from './routes/RelatorioRoute';
import respostaRoutes from './routes/RespostaRoute';
import statusRoutes from './routes/StatusRoute';
import ticketRoutes from './routes/TicketRoute';
import { checkEmails } from './controllers/emailController';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do CORS
const corsOptions = {

  origin: process.env.DOMINIO_HOST, // Substitua pelo domínio do seu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  credentials: true, // Permite que cookies e outras credenciais sejam enviadas
};

app.use(cors(corsOptions));


// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'chave_padrao_insegura',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hora
  },
}));

app.use('/anexo', anexoRoutes);
app.use('/usuarios', usuairoRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/hitoricoStatus', historicoRoutes);
app.use('/auth', authRoutes);
app.use('/respostas', respostaRoutes);
app.use('/status', statusRoutes);
app.use('/tickets', ticketRoutes);

// Verificar e-mails periodicamente (a cada 5 minutos)
setInterval(async () => {
  console.log('Verificando novos e-mails...');
  await checkEmails();
}, 1 * 30 * 1000); // 5 minutos em milissegundos

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



export default app;
function createError(arg0: number): any {
  throw new Error('Function not implemented.');
}

