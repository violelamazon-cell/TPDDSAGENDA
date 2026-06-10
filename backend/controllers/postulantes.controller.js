import { Postulante } from '../models/index.js';
import { listarPostulantes } from '../services/postulantes.service.js';

export const listar = async (req, res) => {
  const filtros = {
    estado: req.query.estado,
    puesto: req.query.puesto,
  };
  const postulantes = await listarPostulantes(filtros);
  res.json(postulantes);
};

export const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ['nuevo', 'en_proceso', 'rechazado', 'contratado'];
    
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const postulante = await Postulante.findByPk(id);
    if (!postulante) {
      return res.status(404).json({ error: 'Postulante no encontrado' });
    }

    postulante.estado = estado;
    await postulante.save();

    res.json(postulante);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
};
