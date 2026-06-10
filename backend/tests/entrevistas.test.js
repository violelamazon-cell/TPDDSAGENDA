import { jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';

// Establecer NODE_ENV=test para que Sequelize use :memory:
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

import app from '../app.js';
import { sequelize, Usuario, Postulante, Entrevista } from '../models/index.js';

let adminToken;
let entrevistadorToken;
let entrevistaId;
let entrevistadorId;
let postulante1Id;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const passwordHash = await bcrypt.hash('password123', 12);

  // Crear usuarios de prueba
  const admin = await Usuario.create({
    nombre: 'Admin Test', email: 'admin@test.com', passwordHash, rol: 'admin',
  });
  const entrevistador = await Usuario.create({
    nombre: 'Entrevistador Test', email: 'entrev@test.com', passwordHash, rol: 'entrevistador',
  });
  entrevistadorId = entrevistador.id;

  // Crear postulantes de prueba
  const p1 = await Postulante.create({
    nombre: 'Test', apellido: 'Postulante', email: 'test@post.com', puesto: 'Dev', estado: 'nuevo',
  });
  postulante1Id = p1.id;

  await Postulante.create({
    nombre: 'Rechazado', apellido: 'Post', email: 'rechazado@post.com', puesto: 'Dev', estado: 'rechazado',
  });

  // Crear entrevista existente para tests de superposición y detalle
  const ent = await Entrevista.create({
    postulanteId: p1.id, entrevistadorId: entrevistador.id,
    fecha: '2026-06-18', horaInicio: '10:00', horaFin: '10:45',
    modalidad: 'presencial', ubicacion: 'Sala 1', estado: 'programada',
  });
  entrevistaId = ent.id;

  // Obtener tokens
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  adminToken = adminRes.body.accessToken;

  const entrevRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'entrev@test.com', password: 'password123' });
  entrevistadorToken = entrevRes.body.accessToken;
});

afterAll(async () => {
  await sequelize.close();
});

// --- TEST 1: Login correcto ---
describe('POST /api/auth/login', () => {
  it('1. debe retornar 200 y un accessToken con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario.email).toBe('admin@test.com');
  });

  // --- TEST 2: Login inválido ---
  it('2. debe retornar 401 con credenciales inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

// --- TEST 3: Listado sin filtros ---
describe('GET /api/entrevistas', () => {
  it('3. debe retornar 200 y un array con token válido', async () => {
    const res = await request(app)
      .get('/api/entrevistas')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('entrevistas');
    expect(Array.isArray(res.body.entrevistas)).toBe(true);
  });

  // --- TEST 4: Listado con filtro de estado ---
  it('4. debe retornar 200 y filtrar por estado=programada', async () => {
    const res = await request(app)
      .get('/api/entrevistas?estado=programada')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entrevistas.every(e => e.estado === 'programada')).toBe(true);
  });

  // --- TEST 10: Acceso sin token ---
  it('10. debe retornar 401 sin token', async () => {
    const res = await request(app).get('/api/entrevistas');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

// --- TEST 5 y 6: Detalle ---
describe('GET /api/entrevistas/:id', () => {
  it('5. debe retornar 200 con id existente', async () => {
    const res = await request(app)
      .get(`/api/entrevistas/${entrevistaId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', entrevistaId);
    expect(res.body).toHaveProperty('fecha');
  });

  it('6. debe retornar 404 con id inexistente', async () => {
    const res = await request(app)
      .get('/api/entrevistas/99999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// --- TESTS de creación ---
describe('POST /api/entrevistas', () => {
  // --- TEST 7: Creación válida ---
  it('7. debe retornar 201 con datos válidos y token admin', async () => {
    const res = await request(app)
      .post('/api/entrevistas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        postulanteId: postulante1Id,
        entrevistadorId,
        fecha: '2026-06-25',
        horaInicio: '14:00',
        horaFin: '14:45',
        modalidad: 'presencial',
        ubicacion: 'Sala 3',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.estado).toBe('programada');
  });

  // --- TEST 8: horaFin <= horaInicio ---
  it('8. debe retornar 400 con horaFin menor o igual a horaInicio', async () => {
    const res = await request(app)
      .post('/api/entrevistas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        postulanteId: postulante1Id,
        entrevistadorId,
        fecha: '2026-06-26',
        horaInicio: '15:00',
        horaFin: '14:00',
        modalidad: 'presencial',
        ubicacion: 'Sala 1',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/hora de fin/i);
  });

  // --- TEST 9: Superposición ---
  it('9. debe retornar 400 con entrevistador que ya tiene entrevista en ese horario', async () => {
    const res = await request(app)
      .post('/api/entrevistas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        postulanteId: postulante1Id,
        entrevistadorId,
        fecha: '2026-06-18',
        horaInicio: '10:15',
        horaFin: '11:00',
        modalidad: 'presencial',
        ubicacion: 'Sala 2',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/horario/i);
  });

  // --- TEST 11: Rol insuficiente ---
  it('11. debe retornar 403 con token de entrevistador', async () => {
    const res = await request(app)
      .post('/api/entrevistas')
      .set('Authorization', `Bearer ${entrevistadorToken}`)
      .send({
        postulanteId: postulante1Id,
        entrevistadorId,
        fecha: '2026-06-27',
        horaInicio: '09:00',
        horaFin: '09:45',
        modalidad: 'presencial',
        ubicacion: 'Sala 1',
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  // --- TEST 13: Modalidad virtual sin link ---
  it('13. debe retornar 400 con modalidad virtual sin link', async () => {
    const res = await request(app)
      .post('/api/entrevistas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        postulanteId: postulante1Id,
        entrevistadorId,
        fecha: '2026-06-28',
        horaInicio: '09:00',
        horaFin: '09:45',
        modalidad: 'virtual',
        // sin link
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/link/i);
  });
});

// --- TEST 12: Reprogramación con superposición ---
describe('PATCH /api/entrevistas/:id/reprogramar', () => {
  it('12. debe retornar 400 al reprogramar con superposición de horario', async () => {
    // Primero crear otra entrevista que ocupe el horario destino
    await Entrevista.create({
      postulanteId: postulante1Id, entrevistadorId,
      fecha: '2026-06-30', horaInicio: '09:00', horaFin: '09:45',
      modalidad: 'presencial', ubicacion: 'Sala 1', estado: 'programada',
    });

    const res = await request(app)
      .patch(`/api/entrevistas/${entrevistaId}/reprogramar`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fecha: '2026-06-30',
        horaInicio: '09:00',
        horaFin: '09:45',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/horario/i);
  });
});
