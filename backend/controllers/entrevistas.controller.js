import * as entrevistasService from '../services/entrevistas.service.js';

export const listar = async (req, res) => {
  const filtros = {
    fecha: req.query.fecha,
    estado: req.query.estado,
    entrevistadorId: req.query.entrevistadorId,
    postulanteId: req.query.postulanteId,
  };
  const paginacion = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    order: req.query.order,
  };

  const resultado = await entrevistasService.listarEntrevistas({
    user: req.user,
    filtros,
    paginacion,
  });

  res.json(resultado);
};

export const obtenerResumen = async (req, res) => {
  const resumen = await entrevistasService.obtenerResumen();
  res.json(resumen);
};

export const obtenerPorId = async (req, res) => {
  const entrevista = await entrevistasService.obtenerPorId(req.params.id, req.user);
  res.json(entrevista);
};

export const obtenerHistorial = async (req, res) => {
  const historial = await entrevistasService.obtenerHistorial(req.params.id);
  res.json(historial);
};

export const crear = async (req, res) => {
  const { postulanteId, entrevistadorId, fecha, horaInicio, horaFin, modalidad, ubicacion, link, observaciones } = req.body;
  const entrevista = await entrevistasService.crearEntrevista(
    { postulanteId, entrevistadorId, fecha, horaInicio, horaFin, modalidad, ubicacion, link, observaciones },
    req.user.id
  );
  res.status(201).json(entrevista);
};

export const editar = async (req, res) => {
  const entrevista = await entrevistasService.editarEntrevista(req.params.id, req.body, req.user);
  res.json(entrevista);
};

export const cancelar = async (req, res) => {
  const entrevista = await entrevistasService.cancelarEntrevista(req.params.id, req.user, req.body?.motivo);
  res.json(entrevista);
};

export const realizar = async (req, res) => {
  const entrevista = await entrevistasService.realizarEntrevista(req.params.id, req.user, req.body?.observaciones);
  res.json(entrevista);
};

export const reprogramar = async (req, res) => {
  const entrevista = await entrevistasService.reprogramarEntrevista(req.params.id, req.body, req.user);
  res.json(entrevista);
};
