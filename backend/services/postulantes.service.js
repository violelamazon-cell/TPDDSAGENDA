import { Postulante, Entrevista } from '../models/index.js';

export const listarPostulantes = async (filtros = {}) => {
  const where = {};
  if (filtros.estado) where.estado = filtros.estado;
  if (filtros.puesto) where.puesto = filtros.puesto;

  const postulantes = await Postulante.findAll({
    where,
    include: [{ model: Entrevista, as: 'entrevistas', attributes: ['id'] }],
    order: [['apellido', 'ASC']],
  });

  return postulantes.map(p => ({
    ...p.toJSON(),
    cantidadEntrevistas: p.entrevistas?.length || 0,
  }));
};
