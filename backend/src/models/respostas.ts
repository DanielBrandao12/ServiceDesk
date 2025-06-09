import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { RespostasAttributes } from '../types/respostas';



interface RespostasCreationAttributes extends Optional<RespostasAttributes, 'id_resposta' | 'data_hora' | 'conteudo' | 'id_usuario' | 'id_ticket' | 'lida'> {}

export class Respostas extends Model<RespostasAttributes, RespostasCreationAttributes> implements RespostasAttributes {
  public id_resposta!: number;
  public data_hora?: Date | null;
  public conteudo?: string | null;
  public id_usuario?: number | null;
  public id_ticket?: number | null;
  public lida?: boolean | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initRespostasModel(sequelize: Sequelize): typeof Respostas {
  Respostas.init(
    {
      id_resposta: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      data_hora: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      conteudo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario',
        },
      },
      id_ticket: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'tickets',
          key: 'id_ticket',
        },
      },
      lida: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'respostas',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id_resposta" }],
        },
        {
          name: "id_usuario",
          using: "BTREE",
          fields: [{ name: "id_usuario" }],
        },
        {
          name: "id_ticket",
          using: "BTREE",
          fields: [{ name: "id_ticket" }],
        },
      ],
    }
  );

  return Respostas;
}
