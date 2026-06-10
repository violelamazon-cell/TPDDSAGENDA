import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Entrevista = sequelize.define('Entrevista', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postulanteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  entrevistadorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horaInicio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horaFin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modalidad: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['presencial', 'virtual']],
    },
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'programada',
    validate: {
      isIn: [['programada', 'realizada', 'cancelada', 'reprogramada']],
    },
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'entrevistas',
  timestamps: false,
});

export default Entrevista;
