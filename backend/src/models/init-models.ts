import { Sequelize, DataTypes } from 'sequelize';
import { ModelStatic } from 'sequelize/types';
import _anexos from './anexos'
import _categorias from './categorias';
import _historico_status from './historico_status';
import _respostas from './respostas';
import _status from './status';
import _tickets from './tickets';
import _usuarios from './usuarios';
import _anotacao from './anotacao';

export function initModels(sequelize: Sequelize) {
  const anexos = _anexos(sequelize);
  const categorias = _categorias(sequelize);
  const historico_status = _historico_status(sequelize);
  const respostas = _respostas(sequelize);
  const status = _status(sequelize);
  const tickets = _tickets(sequelize);
  const usuarios = _usuarios(sequelize);
  const anotacao = _anotacao(sequelize);

  // Relacionamentos
  tickets.belongsTo(categorias, { as: "id_categoria_categoria", foreignKey: "id_categoria" });
  categorias.hasMany(tickets, { as: "tickets", foreignKey: "id_categoria" });

  anexos.belongsTo(respostas, { as: "respostum", foreignKey: "resposta_id" });
  respostas.hasMany(anexos, { as: "anexos", foreignKey: "resposta_id" });

  historico_status.belongsTo(status, { as: "id_status_status", foreignKey: "id_status" });
  status.hasMany(historico_status, { as: "historico_statuses", foreignKey: "id_status" });

  tickets.belongsTo(status, { as: "id_status_status", foreignKey: "id_status" });
  status.hasMany(tickets, { as: "tickets", foreignKey: "id_status" });

  historico_status.belongsTo(tickets, { as: "id_ticket_ticket", foreignKey: "id_ticket" });
  tickets.hasMany(historico_status, { as: "historico_statuses", foreignKey: "id_ticket" });

  respostas.belongsTo(tickets, { as: "id_ticket_ticket", foreignKey: "id_ticket" });
  tickets.hasMany(respostas, { as: "resposta", foreignKey: "id_ticket" });

  historico_status.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario" });
  usuarios.hasMany(historico_status, { as: "historico_statuses", foreignKey: "id_usuario" });

  respostas.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario" });
  usuarios.hasMany(respostas, { as: "resposta", foreignKey: "id_usuario" });

  tickets.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario" });
  usuarios.hasMany(tickets, { as: "tickets", foreignKey: "id_usuario" });

  anotacao.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario" });
usuarios.hasMany(anotacao, { as: "anotacao", foreignKey: "id_usuario" });

anotacao.belongsTo(tickets, { as: "id_ticket_ticket", foreignKey: "id_ticket" });
tickets.hasMany(anotacao, { as: "anotacao", foreignKey: "id_ticket" });

  return {
    anexos,
    categorias,
    historico_status,
    respostas,
    status,
    tickets,
    usuarios,
    anotacao
  };
}
