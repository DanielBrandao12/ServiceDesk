import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { ViewTicketAttributes } from '../types/tickets';


interface ViewTicketCreationAttributes extends Optional<ViewTicketAttributes, 'id_ticket'> {}

export class ViewTicket extends Model<ViewTicketAttributes, ViewTicketCreationAttributes> implements ViewTicketAttributes {
  public id_ticket!: number;
  public codigo_ticket?: string | null;
  public assunto?: string | null;
  public email?: string | null;
  public nome_requisitante?: string | null;
  public nivel_prioridade?: string | null;
  public data_criacao?: Date | null;
  public atribuido_a?: string | null;
  public status?: string | null;
  public categorias?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initViewTicketModel(sequelize: Sequelize): typeof ViewTicket {
  ViewTicket.init(
    {
      id_ticket: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      codigo_ticket: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assunto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nome_requisitante: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nivel_prioridade: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data_criacao: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      atribuido_a: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      categorias: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'view_tickets_status',
      timestamps: false,
    }
  );

  return ViewTicket;
}
