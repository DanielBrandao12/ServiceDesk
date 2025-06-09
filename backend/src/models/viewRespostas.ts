import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { ViewRespostasAttributes } from '../types/respostas';


interface ViewRespostasCreationAttributes extends Optional<ViewRespostasAttributes, 'id_resposta'> {}

export class ViewRespostas extends Model<ViewRespostasAttributes, ViewRespostasCreationAttributes> implements ViewRespostasAttributes {
  public id_resposta!: number;
  public data_hora?: Date | null;
  public conteudo?: string | null;
  public id_usuario?: number | null;
  public id_ticket?: number | null;
  public nome_usuario?: string | null;
  public email?: string | null;
  public nome_requisitante?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initViewRespostasModel(sequelize: Sequelize): typeof ViewRespostas {
  ViewRespostas.init(
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_ticket: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nome_usuario: {
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
    },
    {
      sequelize,
      tableName: 'view_respostas',
      timestamps: false,
    }
  );

  return ViewRespostas;
}
