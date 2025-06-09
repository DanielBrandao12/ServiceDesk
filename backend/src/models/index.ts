// src/database/models/index.ts
import sequelize from '../config/database';
import initAnexosModel from './anexos';
import initCategoriasModel from './categorias';
import initHistoricoStatusModel from './historico_status';
import initRespostasModel from './respostas';
import initStatusModel from './status';
import initTicketsModel from './tickets';
import initUsuariosModel from './usuarios';
import initViewRespostasModel from './viewRespostas';
import initViewTicketModel from './viewTickets';



const Anexos = initAnexosModel(sequelize);
const Categorias = initCategoriasModel(sequelize);
const HistoticoStatus = initHistoricoStatusModel(sequelize);
const Respostas = initRespostasModel(sequelize);
const Status = initStatusModel(sequelize);
const Tickets = initTicketsModel(sequelize);
const Usuarios = initUsuariosModel(sequelize);
const viewRespostas = initViewRespostasModel(sequelize);
const viewTickets = initViewTicketModel(sequelize);



sequelize.authenticate()
  .then(() => console.log(' Conectado ao banco de dados com sucesso!'))
  .catch((error) => console.error(' Erro ao conectar ao banco:', error));

export {
  sequelize,
  Anexos,
  Categorias,
  HistoticoStatus,
  Respostas,
  Status,
  Tickets,
  Usuarios,
  viewRespostas,
  viewTickets
};