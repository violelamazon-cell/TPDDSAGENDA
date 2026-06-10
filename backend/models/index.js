import sequelize from '../config/database.js';
import Usuario from './usuario.model.js';
import Postulante from './postulante.model.js';
import Entrevista from './entrevista.model.js';
import HistorialEntrevista from './historial.model.js';

// --- Asociaciones ---

// Postulante <-> Entrevista
Postulante.hasMany(Entrevista, { foreignKey: 'postulanteId', as: 'entrevistas' });
Entrevista.belongsTo(Postulante, { foreignKey: 'postulanteId', as: 'postulante' });

// Usuario (entrevistador) <-> Entrevista
Usuario.hasMany(Entrevista, { foreignKey: 'entrevistadorId', as: 'entrevistasAsignadas' });
Entrevista.belongsTo(Usuario, { foreignKey: 'entrevistadorId', as: 'entrevistador' });

// Entrevista <-> HistorialEntrevista
Entrevista.hasMany(HistorialEntrevista, { foreignKey: 'entrevistaId', as: 'historial' });
HistorialEntrevista.belongsTo(Entrevista, { foreignKey: 'entrevistaId', as: 'entrevista' });

// Usuario <-> HistorialEntrevista
Usuario.hasMany(HistorialEntrevista, { foreignKey: 'usuarioId', as: 'acciones' });
HistorialEntrevista.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

export { sequelize, Usuario, Postulante, Entrevista, HistorialEntrevista };
