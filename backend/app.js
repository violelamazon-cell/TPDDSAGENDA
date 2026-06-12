// IMPORTANTE: express-async-errors DEBE importarse antes de cualquier ruta o middleware
// para que Supertest funcione correctamente al importar app.js directamente
import 'express-async-errors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.routes.js';
import entrevistasRouter from './routes/entrevistas.routes.js';
import postulantesRouter from './routes/postulantes.routes.js';
import usuariosRouter from './routes/usuarios.routes.js';
import errorHandler from './middlewares/error.middleware.js';


const app = express();

// --- Middlewares globales (orden importa) ---
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // CORS configurado explícitamente para el frontend en desarrollo
app.use(express.json());
app.use(cookieParser());

// --- Rutas ---
app.use('/api/auth', authRouter);
app.use('/api/entrevistas', entrevistasRouter);
app.use('/api/postulantes', postulantesRouter);
app.use('/api/usuarios', usuariosRouter);

// --- Middleware de errores (SIEMPRE AL FINAL, firma de 4 parámetros obligatoria) ---
app.use(errorHandler);

// Exportar SIN app.listen() — necesario para Supertest
export default app;
