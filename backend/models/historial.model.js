import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const HistorialEntrevista = sequelize.define('HistorialEntrevista', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  entrevistaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaHora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  valorAnterior: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  valorNuevo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'historial_entrevistas',
  timestamps: false,
});

export default HistorialEntrevista;
