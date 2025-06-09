import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { StatusAttributes } from '../types/status';



interface StatusCreationAttributes extends Optional<StatusAttributes, 'id_status'> {}

export class Status extends Model<StatusAttributes, StatusCreationAttributes> implements StatusAttributes {
  public id_status!: number;
  public nome?: string | null;
  public ativo?: boolean | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initStatusModel(sequelize: Sequelize): typeof Status {
  Status.init(
    {
      id_status: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'status',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id_status" }],
        },
      ],
    }
  );

  return Status;
}
