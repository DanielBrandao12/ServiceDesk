import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { UsuariosAttributes } from '../types/usuarios';


interface UsuariosCreationAttributes extends Optional<UsuariosAttributes, 'id_usuario'> {}

export class Usuarios extends Model<UsuariosAttributes, UsuariosCreationAttributes> implements UsuariosAttributes {
  public id_usuario!: number;
  public nome_completo?: string | null;
  public email?: string | null;
  public senha_hash?: string | null;
  public nome_usuario?: string | null;
  public perfil!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initUsuariosModel(sequelize: Sequelize): typeof Usuarios {
  Usuarios.init(
    {
      id_usuario: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nome_completo: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      senha_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      nome_usuario: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      perfil: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "Admin",
      },
    },
    {
      sequelize,
      tableName: 'usuarios',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id_usuario" }],
        },
      ],
    }
  );

  return Usuarios;
}
