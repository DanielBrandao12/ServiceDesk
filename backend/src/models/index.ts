// src/database/models/index.ts
import sequelize from "../config/database";

// 🔹 Importadores de inicialização dos models
import initAnexosModel from "./anexos";
import initCategoriasModel from "./categorias";
import initHistoricoStatusModel from "./historico_status";
import initRespostasModel from "./respostas";
import initStatusModel from "./status";
import initTicketsModel from "./tickets";
import initUsuariosModel from "./usuarios";
import initViewRespostasModel from "./viewRespostas";
import initViewTicketModel from "./viewTickets";
import initAnotacaoModel from "./anotacao";
// 🔹 Inicialização dos models
const Anexos = initAnexosModel(sequelize);
const Categorias = initCategoriasModel(sequelize);
const HistoricoStatus = initHistoricoStatusModel(sequelize);
const Respostas = initRespostasModel(sequelize);
const Status = initStatusModel(sequelize);
const Tickets = initTicketsModel(sequelize);
const Usuarios = initUsuariosModel(sequelize);
const ViewRespostas = initViewRespostasModel(sequelize);
const ViewTickets = initViewTicketModel(sequelize);
const Anotacao = initAnotacaoModel(sequelize);
// 🔹 Definição das associações
HistoricoStatus.belongsTo(Status, {
  foreignKey: "id_status",
  as: "status",
});

Status.hasMany(HistoricoStatus, {
  foreignKey: "id_status",
  as: "historicos",
});

// Exemplo (se precisar futuramente):
// Tickets.belongsTo(Categorias, { foreignKey: "id_categoria", as: "categoria" });
// Categorias.hasMany(Tickets, { foreignKey: "id_categoria", as: "tickets" });

// 🔹 Teste de conexão
sequelize
  .authenticate()
  .then(() => console.log("Conectado ao banco de dados com sucesso!"))
  .catch((error) => console.error("Erro ao conectar ao banco:", error));

// 🔹 Exportando models e sequelize
export {
  sequelize,
  Anexos,
  Categorias,
  HistoricoStatus,
  Respostas,
  Status,
  Tickets,
  Usuarios,
  ViewRespostas,
  ViewTickets,
  Anotacao
};
