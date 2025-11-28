import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { AnotacaoAttributes } from '../types/anotacao';

interface AnotacaoCreationAttributes
  extends Optional<AnotacaoAttributes, 'id'> {}

// Classe do Model
export class Anotacao extends Model<AnotacaoAttributes, AnotacaoCreationAttributes>
  implements AnotacaoAttributes {
  public id!: number;
  public descricao!: string;
  public id_ticket!: number;
  public id_usuario!: number;
  public data_hora!: Date | null;
}

// Função de inicialização
export default function initAnotacaoModel(sequelize: Sequelize): typeof Anotacao {
  Anotacao.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT, //  LONGTEXT no MySQL -> TEXT no Sequelize
        allowNull: false,
      },
      data_hora: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios', // Corrigido
          key: 'id_usuario',
        },
      },
      id_ticket: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tickets', // Corrigido
          key: 'id_ticket',
        },
      },
    },
    {
      sequelize,
      tableName: 'anotacao',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{name:'id'}],
        },
        {
          name: 'id_ticket',
          using: 'BTREE',
          fields: [{name:'id_ticket'}],
        },
        {
          name: 'id_usuario',
          using: 'BTREE',
          fields: [{name:'id_usuario'}],
        },
      ],
    }
  );

  return Anotacao;
}
