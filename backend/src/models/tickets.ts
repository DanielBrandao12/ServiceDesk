import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { TicketsAttributes } from '../types/tickets';


interface TicketsCreationAttributes extends Optional<TicketsAttributes, 
  | 'id_ticket' 
  | 'codigo_ticket' 
  | 'assunto' 
  | 'email' 
  | 'nome_requisitante' 
  | 'descricao' 
  | 'nivel_prioridade' 
  | 'data_criacao' 
  | 'data_conclusao' 
  | 'atribuido_a' 
  | 'id_categoria' 
  | 'id_usuario' 
  | 'id_status'> {}

export class Tickets extends Model<TicketsAttributes, TicketsCreationAttributes> implements TicketsAttributes {
  public id_ticket!: number;
  public codigo_ticket?: string | any;
  public assunto?: string | null;
  public email?: string | null;
  public nome_requisitante?: string | null;
  public descricao?: string | null;
  public nivel_prioridade?: string | null;
  public data_criacao?: Date | null;
  public data_conclusao?: Date | null;
  public atribuido_a?: string | null;
  public id_categoria?: number | null;
  public id_usuario?: number | null;
  public id_status?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initTicketsModel(sequelize: Sequelize): typeof Tickets {
  Tickets.init(
    {
      id_ticket: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      codigo_ticket: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: "unique_codigo_ticket",
      },
      assunto: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      nome_requisitante: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      nivel_prioridade: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      data_criacao: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      data_conclusao: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      atribuido_a: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'categorias',
          key: 'id_categoria',
        },
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario',
        },
      },
      id_status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'status',
          key: 'id_status',
        },
      },
    },
    {
      sequelize,
      tableName: 'tickets',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id_ticket" }],
        },
        {
          name: "unique_codigo_ticket",
          unique: true,
          using: "BTREE",
          fields: [{ name: "codigo_ticket" }],
        },
        {
          name: "id_categoria",
          using: "BTREE",
          fields: [{ name: "id_categoria" }],
        },
        {
          name: "id_usuario",
          using: "BTREE",
          fields: [{ name: "id_usuario" }],
        },
        {
          name: "id_status",
          using: "BTREE",
          fields: [{ name: "id_status" }],
        },
      ],
    }
  );

  return Tickets;
}
