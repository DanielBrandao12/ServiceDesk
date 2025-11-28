import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { CategoriaAttributes } from '../types/categorias';



type CategoriaCreationAttributes = Optional<CategoriaAttributes, 'id_categoria'>;

export class Categoria extends Model<CategoriaAttributes, CategoriaCreationAttributes> implements CategoriaAttributes {
  public id_categoria!: number;
  public nome?: string;
  public criado_por?: string;
  public ativo?: boolean;
  public data_criacao?: Date;
}

export default function initCategoriasModel(sequelize: Sequelize): typeof Categoria {
  Categoria.init(
    {
      id_categoria: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      criado_por: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      data_criacao: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'categorias',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id_categoria' }],
        },
      ],
    }
  );

  return Categoria;
}
