import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { AnexosAttributes } from '../types/anexos';

// Interface para criação - torna os campos opcionais na criação
interface AnexosCreationAttributes extends Optional<
  AnexosAttributes,
  'id' | 'ticket_id' | 'resposta_id' | 'criado_em'
> {}

// Define a classe
export class Anexos extends Model<AnexosAttributes, AnexosCreationAttributes>
  implements AnexosAttributes {
  public id!: number;
  public nome!: string;
  public tipo!: string;
  public arquivo!: Buffer;
  public ticket_id?: string | null;
  public resposta_id?: number | null;
  public criado_em?: Date;

  // Esses campos só existem se usar timestamps: true
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Função de inicialização
export default function initAnexosModel(sequelize: Sequelize): typeof Anexos {
  Anexos.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Sem Nome',
      },
      tipo: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      arquivo: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
      },
      ticket_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      resposta_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'respostas',
          key: 'id_resposta',
        },
      },
      criado_em: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      modelName: 'Anexos',
      tableName: 'anexos',
      timestamps: false, // se não quiser usar createdAt/updatedAt
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: ['id'],
        },
        {
          name: 'ticket_id',
          using: 'BTREE',
          fields: ['ticket_id'],
        },
        {
          name: 'resposta_id',
          using: 'BTREE',
          fields: ['resposta_id'],
        },
      ],
    }
  );

  return Anexos;
}
