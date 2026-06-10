import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { sequelize, Usuario, Postulante, Entrevista, HistorialEntrevista } from '../models/index.js';

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Tablas creadas');

    // --- USUARIOS (4) ---
    const passwordHash = await bcrypt.hash('password123', 12);

    const admin = await Usuario.create({ nombre: 'Admin Sistema', email: 'admin@test.com', passwordHash, rol: 'admin' });
    const entrev1 = await Usuario.create({ nombre: 'Carlos Méndez', email: 'entrev1@test.com', passwordHash, rol: 'entrevistador' });
    const entrev2 = await Usuario.create({ nombre: 'Laura Gómez', email: 'entrev2@test.com', passwordHash, rol: 'entrevistador' });
    const entrev3 = await Usuario.create({ nombre: 'Marcos Ríos', email: 'entrev3@test.com', passwordHash, rol: 'entrevistador' });

    console.log('Usuarios creados');

    // --- POSTULANTES (8) ---
    const p1 = await Postulante.create({ nombre: 'Juan', apellido: 'Martínez', email: 'juan@mail.com', telefono: '3515551001', puesto: 'Frontend Junior', estado: 'nuevo' });
    const p2 = await Postulante.create({ nombre: 'Ana', apellido: 'López', email: 'ana@mail.com', telefono: '3515551002', puesto: 'UX Designer', estado: 'en_proceso' });
    const p3 = await Postulante.create({ nombre: 'Pedro', apellido: 'Sosa', email: 'pedro@mail.com', telefono: '3515551003', puesto: 'Backend Senior', estado: 'en_proceso' });
    const p4 = await Postulante.create({ nombre: 'Valentina', apellido: 'Cruz', email: 'valentina@mail.com', telefono: '3515551004', puesto: 'QA Tester', estado: 'en_proceso' });
    const p5 = await Postulante.create({ nombre: 'Lucas', apellido: 'Herrera', email: 'lucas@mail.com', telefono: '3515551005', puesto: 'DevOps', estado: 'nuevo' });
    const p6 = await Postulante.create({ nombre: 'Sofía', apellido: 'Romero', email: 'sofia@mail.com', telefono: '3515551006', puesto: 'Product Manager', estado: 'rechazado' });
    const p7 = await Postulante.create({ nombre: 'Diego', apellido: 'Fernández', email: 'diego@mail.com', telefono: '3515551007', puesto: 'Mobile Developer', estado: 'contratado' });
    const p8 = await Postulante.create({ nombre: 'Camila', apellido: 'Torres', email: 'camila@mail.com', telefono: '3515551008', puesto: 'Data Analyst', estado: 'en_proceso' });

    console.log('Postulantes creados');

    // --- ENTREVISTAS (12) ---
    // Entrevistas distribuidas entre 3 entrevistadores, ninguna para rechazado/contratado

    // 4 PROGRAMADAS (fechas futuras)
    const e1 = await Entrevista.create({ postulanteId: p1.id, entrevistadorId: entrev1.id, fecha: '2026-06-18', horaInicio: '09:00', horaFin: '09:45', modalidad: 'presencial', ubicacion: 'Sala 1', estado: 'programada' });
    const e2 = await Entrevista.create({ postulanteId: p2.id, entrevistadorId: entrev2.id, fecha: '2026-06-18', horaInicio: '10:00', horaFin: '10:45', modalidad: 'virtual', link: 'https://meet.google.com/abc-defg-hij', estado: 'programada' });
    const e3 = await Entrevista.create({ postulanteId: p5.id, entrevistadorId: entrev3.id, fecha: '2026-06-19', horaInicio: '14:00', horaFin: '14:45', modalidad: 'presencial', ubicacion: 'Sala 2', estado: 'programada' });
    const e4 = await Entrevista.create({ postulanteId: p8.id, entrevistadorId: entrev1.id, fecha: '2026-06-20', horaInicio: '11:00', horaFin: '11:45', modalidad: 'virtual', link: 'https://meet.google.com/xyz-uvwx-rst', estado: 'programada' });

    // 3 REALIZADAS (fechas pasadas, con observaciones)
    const e5 = await Entrevista.create({ postulanteId: p2.id, entrevistadorId: entrev1.id, fecha: '2026-06-02', horaInicio: '09:00', horaFin: '09:45', modalidad: 'presencial', ubicacion: 'Sala 1', estado: 'realizada', observaciones: 'Excelente manejo de Figma y design systems. Avanza a segunda ronda.' });
    const e6 = await Entrevista.create({ postulanteId: p3.id, entrevistadorId: entrev2.id, fecha: '2026-06-03', horaInicio: '15:00', horaFin: '15:45', modalidad: 'virtual', link: 'https://meet.google.com/rea-liza-da1', estado: 'realizada', observaciones: 'Sólido en Node.js y arquitectura. Buen candidato.' });
    const e7 = await Entrevista.create({ postulanteId: p4.id, entrevistadorId: entrev3.id, fecha: '2026-06-04', horaInicio: '10:00', horaFin: '10:45', modalidad: 'presencial', ubicacion: 'Sala 3', estado: 'realizada', observaciones: 'Buen manejo de testing y automatización.' });

    // 2 CANCELADAS (fechas pasadas)
    const e8 = await Entrevista.create({ postulanteId: p1.id, entrevistadorId: entrev2.id, fecha: '2026-06-05', horaInicio: '11:00', horaFin: '11:45', modalidad: 'presencial', ubicacion: 'Sala 2', estado: 'cancelada', observaciones: 'Postulante pidió reprogramar pero no confirmó.' });
    const e9 = await Entrevista.create({ postulanteId: p8.id, entrevistadorId: entrev3.id, fecha: '2026-06-05', horaInicio: '16:00', horaFin: '16:45', modalidad: 'virtual', link: 'https://meet.google.com/can-cela-da1', estado: 'cancelada', observaciones: 'Entrevistador no disponible.' });

    // 3 REPROGRAMADAS (1 futura, 2 pasadas)
    const e10 = await Entrevista.create({ postulanteId: p3.id, entrevistadorId: entrev1.id, fecha: '2026-06-21', horaInicio: '14:00', horaFin: '14:45', modalidad: 'virtual', link: 'https://meet.google.com/rep-rog-fut', estado: 'reprogramada', observaciones: 'Reprogramada por conflicto de agenda.' });
    const e11 = await Entrevista.create({ postulanteId: p4.id, entrevistadorId: entrev2.id, fecha: '2026-06-06', horaInicio: '09:00', horaFin: '09:45', modalidad: 'presencial', ubicacion: 'Sala 1', estado: 'reprogramada', observaciones: 'Se cambió de presencial a virtual inicialmente, luego se reprogramó.' });
    const e12 = await Entrevista.create({ postulanteId: p2.id, entrevistadorId: entrev3.id, fecha: '2026-06-07', horaInicio: '10:00', horaFin: '10:45', modalidad: 'virtual', link: 'https://meet.google.com/rep-rog-pas', estado: 'reprogramada' });

    console.log('Entrevistas creadas');

    // --- HISTORIAL ---
    const entrevistas = [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12];
    for (const ent of entrevistas) {
      await HistorialEntrevista.create({
        entrevistaId: ent.id,
        usuarioId: admin.id,
        accion: 'creacion',
        fechaHora: new Date().toISOString(),
        valorAnterior: null,
        valorNuevo: JSON.stringify({ fecha: ent.fecha, horaInicio: ent.horaInicio, estado: ent.estado }),
      });
    }

    // Historial adicional para entrevistas con cambios de estado
    await HistorialEntrevista.create({
      entrevistaId: e8.id, usuarioId: admin.id, accion: 'cancelacion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ estado: 'programada' }),
      valorNuevo: JSON.stringify({ estado: 'cancelada' }),
    });

    await HistorialEntrevista.create({
      entrevistaId: e9.id, usuarioId: admin.id, accion: 'cancelacion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ estado: 'programada' }),
      valorNuevo: JSON.stringify({ estado: 'cancelada' }),
    });

    await HistorialEntrevista.create({
      entrevistaId: e10.id, usuarioId: admin.id, accion: 'reprogramacion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ fecha: '2026-06-14', horaInicio: '14:00' }),
      valorNuevo: JSON.stringify({ fecha: '2026-06-21', horaInicio: '14:00', estado: 'reprogramada' }),
    });

    await HistorialEntrevista.create({
      entrevistaId: e5.id, usuarioId: entrev1.id, accion: 'realizacion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ estado: 'programada' }),
      valorNuevo: JSON.stringify({ estado: 'realizada', observaciones: e5.observaciones }),
    });

    await HistorialEntrevista.create({
      entrevistaId: e6.id, usuarioId: entrev2.id, accion: 'realizacion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ estado: 'programada' }),
      valorNuevo: JSON.stringify({ estado: 'realizada', observaciones: e6.observaciones }),
    });

    await HistorialEntrevista.create({
      entrevistaId: e7.id, usuarioId: entrev3.id, accion: 'realizacion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ estado: 'programada' }),
      valorNuevo: JSON.stringify({ estado: 'realizada', observaciones: e7.observaciones }),
    });

    console.log('Historial creado');
    console.log('\n=== SEED COMPLETADO ===');
    console.log('Credenciales de prueba:');
    console.log('  Admin:           admin@test.com / password123');
    console.log('  Entrevistador 1: entrev1@test.com / password123');
    console.log('  Entrevistador 2: entrev2@test.com / password123');
    console.log('  Entrevistador 3: entrev3@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
};

seed();
