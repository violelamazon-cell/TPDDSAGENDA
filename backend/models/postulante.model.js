import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Postulante = sequelize.define('Postulante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  puesto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'nuevo',
    validate: {
      isIn: [['nuevo', 'en_proceso', 'rechazado', 'contratado']],
    },
  },
}, {
  tableName: 'postulantes',
  timestamps: false,
});

export default Postulante;
