import { Op } from 'sequelize';
import { Entrevista, Postulante, Usuario, HistorialEntrevista } from '../models/index.js';

// --- Validaciones de negocio ---

const verificarSuperposicion = async (entrevistadorId, fecha, horaInicio, horaFin, excluirId = null) => {
  const where = {
    entrevistadorId,
    fecha,
    estado: { [Op.in]: ['programada', 'reprogramada'] },
  };
  if (excluirId) where.id = { [Op.ne]: excluirId };

  const entrevistasExistentes = await Entrevista.findAll({ where });

  const haySuperposicion = entrevistasExistentes.some(e =>
    horaInicio < e.horaFin && horaFin > e.horaInicio
  );

  if (haySuperposicion) {
    throw Object.assign(
      new Error('El entrevistador ya tiene una entrevista en ese horario'),
      { status: 400 }
    );
  }
};

const validarHorario = (horaInicio, horaFin) => {
  if (horaFin <= horaInicio) {
    throw Object.assign(
      new Error('La hora de fin debe ser mayor que la hora de inicio'),
      { status: 400 }
    );
  }
};

const validarModalidad = (modalidad, ubicacion, link) => {
  if (modalidad === 'virtual' && !link) {
    throw Object.assign(
      new Error('Las entrevistas virtuales requieren un link'),
      { status: 400 }
    );
  }
  if (modalidad === 'presencial' && !ubicacion) {
    throw Object.assign(
      new Error('Las entrevistas presenciales requieren una ubicación'),
      { status: 400 }
    );
  }
};

const validarPostulanteElegible = async (postulanteId) => {
  const postulante = await Postulante.findByPk(postulanteId);
  if (!postulante) {
    throw Object.assign(new Error('El postulante no existe'), { status: 404 });
  }
  if (['rechazado', 'contratado'].includes(postulante.estado)) {
    throw Object.assign(
      new Error('El postulante no está disponible para entrevistas'),
      { status: 400 }
    );
  }
  return postulante;
};

const validarTransicionEstado = (estadoActual, nuevaAccion) => {
  const transicionesPermitidas = {
    programada: ['realizada', 'cancelada', 'reprogramada'],
    reprogramada: ['realizada', 'cancelada'],
    realizada: [],
    cancelada: [],
  };

  const estadosDestino = transicionesPermitidas[estadoActual];
  if (!estadosDestino || !estadosDestino.includes(nuevaAccion)) {
    throw Object.assign(
      new Error(`No se puede cambiar de "${estadoActual}" a "${nuevaAccion}"`),
      { status: 400 }
    );
  }
};

// --- Servicio ---

export const listarEntrevistas = async ({ user, filtros, paginacion }) => {
  const where = {};

  // Filtro obligatorio por rol: entrevistador solo ve las suyas
  if (user.rol === 'entrevistador') {
    where.entrevistadorId = user.id;
  }

  // Filtros opcionales
  if (filtros.fecha) where.fecha = filtros.fecha;
  if (filtros.estado) where.estado = filtros.estado;
  if (filtros.entrevistadorId && user.rol !== 'entrevistador') {
    where.entrevistadorId = filtros.entrevistadorId;
  }
  if (filtros.postulanteId) where.postulanteId = filtros.postulanteId;

  const page = parseInt(paginacion.page) || 1;
  const limit = parseInt(paginacion.limit) || 10;
  const offset = (page - 1) * limit;
  const sortBy = paginacion.sortBy || 'fecha';
  const order = paginacion.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const { count, rows } = await Entrevista.findAndCountAll({
    where,
    include: [
      { model: Postulante, as: 'postulante', attributes: ['id', 'nombre', 'apellido', 'puesto', 'estado'] },
      { model: Usuario, as: 'entrevistador', attributes: ['id', 'nombre', 'email'] },
    ],
    order: [[sortBy, order]],
    limit,
    offset,
  });

  return {
    entrevistas: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
};

export const obtenerPorId = async (id, user) => {
  const entrevista = await Entrevista.findByPk(id, {
    include: [
      { model: Postulante, as: 'postulante' },
      { model: Usuario, as: 'entrevistador', attributes: ['id', 'nombre', 'email', 'rol'] },
    ],
  });

  if (!entrevista) {
    throw Object.assign(new Error('Entrevista no encontrada'), { status: 404 });
  }

  // Entrevistador solo puede ver sus propias entrevistas
  if (user.rol === 'entrevistador' && entrevista.entrevistadorId !== user.id) {
    throw Object.assign(new Error('No tenés permiso para ver esta entrevista'), { status: 403 });
  }

  return entrevista;
};

export const obtenerHistorial = async (entrevistaId) => {
  const historial = await HistorialEntrevista.findAll({
    where: { entrevistaId },
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] }],
    order: [['fechaHora', 'DESC']],
  });
  return historial;
};

export const crearEntrevista = async (datos, usuarioId) => {
  const { postulanteId, entrevistadorId, fecha, horaInicio, horaFin, modalidad, ubicacion, link, observaciones } = datos;

  // Validaciones de negocio
  validarHorario(horaInicio, horaFin);
  const postulante = await validarPostulanteElegible(postulanteId);
  validarModalidad(modalidad, ubicacion, link);
  await verificarSuperposicion(entrevistadorId, fecha, horaInicio, horaFin);

  // Verificar que el entrevistador existe
  const entrevistador = await Usuario.findByPk(entrevistadorId);
  if (!entrevistador) {
    throw Object.assign(new Error('El entrevistador no existe'), { status: 404 });
  }

  const entrevista = await Entrevista.create({
    postulanteId, entrevistadorId, fecha, horaInicio, horaFin,
    modalidad, ubicacion, link, observaciones,
    estado: 'programada',
  });

  // Registrar historial
  await HistorialEntrevista.create({
    entrevistaId: entrevista.id,
    usuarioId,
    accion: 'creacion',
    fechaHora: new Date().toISOString(),
    valorAnterior: null,
    valorNuevo: JSON.stringify({ postulanteId, entrevistadorId, fecha, horaInicio, horaFin, modalidad }),
  });

  // Actualizar estado del postulante si es nuevo
  if (postulante.estado === 'nuevo') {
    await postulante.update({ estado: 'en_proceso' });
  }

  return entrevista;
};

export const editarEntrevista = async (id, datos, user) => {
  const entrevista = await Entrevista.findByPk(id);
  if (!entrevista) {
    throw Object.assign(new Error('Entrevista no encontrada'), { status: 404 });
  }

  // Entrevista realizada: solo se puede editar observaciones
  if (entrevista.estado === 'realizada') {
    if (Object.keys(datos).some(k => k !== 'observaciones')) {
      throw Object.assign(
        new Error('Solo se pueden editar las observaciones de una entrevista realizada'),
        { status: 400 }
      );
    }
    const valorAnterior = JSON.stringify({ observaciones: entrevista.observaciones });
    entrevista.observaciones = datos.observaciones;
    await entrevista.save();

    await HistorialEntrevista.create({
      entrevistaId: id,
      usuarioId: user.id,
      accion: 'edicion',
      fechaHora: new Date().toISOString(),
      valorAnterior,
      valorNuevo: JSON.stringify({ observaciones: datos.observaciones }),
    });
    return entrevista;
  }

  if (entrevista.estado === 'cancelada') {
    throw Object.assign(new Error('No se puede editar una entrevista cancelada'), { status: 400 });
  }

  const valorAnteriorObj = {
    fecha: entrevista.fecha, 
    horaInicio: entrevista.horaInicio,
    horaFin: entrevista.horaFin, 
    modalidad: entrevista.modalidad,
    ubicacion: entrevista.ubicacion, 
    link: entrevista.link,
    observaciones: entrevista.observaciones,
    entrevistadorId: entrevista.entrevistadorId
  };
  const valorAnterior = JSON.stringify(valorAnteriorObj);

  const { postulanteId, entrevistadorId, fecha, horaInicio, horaFin, modalidad, ubicacion, link, observaciones } = datos;

  if (horaInicio && horaFin) validarHorario(horaInicio, horaFin);
  if (modalidad) validarModalidad(modalidad, ubicacion || entrevista.ubicacion, link || entrevista.link);

  // Verificar superposición si cambia fecha/hora/entrevistador
  const nuevaFecha = fecha || entrevista.fecha;
  const nuevoInicio = horaInicio || entrevista.horaInicio;
  const nuevoFin = horaFin || entrevista.horaFin;
  const nuevoEntrevistador = entrevistadorId || entrevista.entrevistadorId;

  if (fecha || horaInicio || horaFin || entrevistadorId) {
    await verificarSuperposicion(nuevoEntrevistador, nuevaFecha, nuevoInicio, nuevoFin, id);
  }

  // Aplicar cambios (solo campos permitidos)
  if (fecha) entrevista.fecha = fecha;
  if (horaInicio) entrevista.horaInicio = horaInicio;
  if (horaFin) entrevista.horaFin = horaFin;
  if (modalidad) entrevista.modalidad = modalidad;
  if (ubicacion !== undefined) entrevista.ubicacion = ubicacion;
  if (link !== undefined) entrevista.link = link;
  if (observaciones !== undefined) entrevista.observaciones = observaciones;
  if (entrevistadorId) entrevista.entrevistadorId = entrevistadorId;

  await entrevista.save();

  const valorNuevoObj = {
    fecha: entrevista.fecha, 
    horaInicio: entrevista.horaInicio,
    horaFin: entrevista.horaFin, 
    modalidad: entrevista.modalidad,
    ubicacion: entrevista.ubicacion, 
    link: entrevista.link,
    observaciones: entrevista.observaciones,
    entrevistadorId: entrevista.entrevistadorId
  };

  await HistorialEntrevista.create({
    entrevistaId: id,
    usuarioId: user.id,
    accion: 'edicion',
    fechaHora: new Date().toISOString(),
    valorAnterior,
    valorNuevo: JSON.stringify(valorNuevoObj),
  });

  return entrevista;
};

export const cancelarEntrevista = async (id, user, motivo) => {
  const entrevista = await Entrevista.findByPk(id);
  if (!entrevista) {
    throw Object.assign(new Error('Entrevista no encontrada'), { status: 404 });
  }

  validarTransicionEstado(entrevista.estado, 'cancelada');

  const valorAnterior = JSON.stringify({ estado: entrevista.estado });
  entrevista.estado = 'cancelada';
  if (motivo) entrevista.observaciones = motivo;
  await entrevista.save();

  await HistorialEntrevista.create({
    entrevistaId: id,
    usuarioId: user.id,
    accion: 'cancelacion',
    fechaHora: new Date().toISOString(),
    valorAnterior,
    valorNuevo: JSON.stringify({ estado: 'cancelada' }),
  });

  return entrevista;
};

export const realizarEntrevista = async (id, user, observaciones) => {
  const entrevista = await Entrevista.findByPk(id);
  if (!entrevista) {
    throw Object.assign(new Error('Entrevista no encontrada'), { status: 404 });
  }

  validarTransicionEstado(entrevista.estado, 'realizada');

  const valorAnterior = JSON.stringify({ estado: entrevista.estado, observaciones: entrevista.observaciones });
  entrevista.estado = 'realizada';
  if (observaciones) entrevista.observaciones = observaciones;
  await entrevista.save();

  await HistorialEntrevista.create({
    entrevistaId: id,
    usuarioId: user.id,
    accion: 'realizacion',
    fechaHora: new Date().toISOString(),
    valorAnterior,
    valorNuevo: JSON.stringify({ estado: 'realizada', observaciones }),
  });

  return entrevista;
};

export const reprogramarEntrevista = async (id, datos, user) => {
  const entrevista = await Entrevista.findByPk(id);
  if (!entrevista) {
    throw Object.assign(new Error('Entrevista no encontrada'), { status: 404 });
  }

  validarTransicionEstado(entrevista.estado, 'reprogramada');

  const { fecha, horaInicio, horaFin, entrevistadorId, modalidad, ubicacion, link, motivo } = datos;

  const nuevaFecha = fecha || entrevista.fecha;
  const nuevoInicio = horaInicio || entrevista.horaInicio;
  const nuevoFin = horaFin || entrevista.horaFin;
  const nuevoEntrevistador = entrevistadorId || entrevista.entrevistadorId;

  validarHorario(nuevoInicio, nuevoFin);
  if (modalidad) validarModalidad(modalidad, ubicacion || entrevista.ubicacion, link || entrevista.link);
  await verificarSuperposicion(nuevoEntrevistador, nuevaFecha, nuevoInicio, nuevoFin, id);

  const valorAnteriorObj = {
    fecha: entrevista.fecha, 
    horaInicio: entrevista.horaInicio,
    horaFin: entrevista.horaFin, 
    entrevistadorId: entrevista.entrevistadorId,
    estado: entrevista.estado,
    modalidad: entrevista.modalidad,
    ubicacion: entrevista.ubicacion,
    link: entrevista.link,
    observaciones: entrevista.observaciones
  };
  const valorAnterior = JSON.stringify(valorAnteriorObj);

  entrevista.fecha = nuevaFecha;
  entrevista.horaInicio = nuevoInicio;
  entrevista.horaFin = nuevoFin;
  entrevista.entrevistadorId = nuevoEntrevistador;
  entrevista.estado = 'reprogramada';
  if (modalidad) entrevista.modalidad = modalidad;
  if (ubicacion !== undefined) entrevista.ubicacion = ubicacion;
  if (link !== undefined) entrevista.link = link;
  if (motivo) entrevista.observaciones = motivo;
  await entrevista.save();

  const valorNuevoObj = {
    fecha: entrevista.fecha, 
    horaInicio: entrevista.horaInicio,
    horaFin: entrevista.horaFin, 
    entrevistadorId: entrevista.entrevistadorId,
    estado: entrevista.estado,
    modalidad: entrevista.modalidad,
    ubicacion: entrevista.ubicacion,
    link: entrevista.link,
    observaciones: entrevista.observaciones
  };

  await HistorialEntrevista.create({
    entrevistaId: id,
    usuarioId: user.id,
    accion: 'reprogramacion',
    fechaHora: new Date().toISOString(),
    valorAnterior,
    valorNuevo: JSON.stringify(valorNuevoObj),
  });

  return entrevista;
};

export const obtenerResumen = async () => {
  const hoy = new Date().toISOString().split('T')[0];

  const entrevistasHoy = await Entrevista.findAll({
    where: { fecha: hoy },
    include: [
      { model: Postulante, as: 'postulante', attributes: ['nombre', 'apellido', 'puesto'] },
      { model: Usuario, as: 'entrevistador', attributes: ['id', 'nombre'] },
    ],
    order: [['horaInicio', 'ASC']],
  });

  const postulantesEnProceso = await Postulante.count({ where: { estado: 'en_proceso' } });

  const entrevistasCanceladas = await Entrevista.count({ where: { estado: 'cancelada' } });

  // Entrevistas realizadas este mes
  const inicioMes = new Date();
  inicioMes.setDate(1);
  const realizadasMes = await Entrevista.count({
    where: {
      estado: 'realizada',
      fecha: { [Op.gte]: inicioMes.toISOString().split('T')[0] },
    },
  });

  // Entrevistas por entrevistador
  const entrevistadores = await Usuario.findAll({
    where: { rol: 'entrevistador' },
    attributes: ['id', 'nombre'],
  });

  const cargaPorEntrevistador = await Promise.all(
    entrevistadores.map(async (ent) => {
      const total = await Entrevista.count({ where: { entrevistadorId: ent.id } });
      return { id: ent.id, nombre: ent.nombre, total };
    })
  );

  return {
    entrevistasHoy,
    totalHoy: entrevistasHoy.length,
    postulantesEnProceso,
    entrevistasCanceladas,
    realizadasEsteMes: realizadasMes,
    cargaPorEntrevistador,
  };
};
