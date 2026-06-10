import app from './app.js';
import { sequelize } from './models/index.js';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

// Rate limiting en login (máx 5 intentos en 15 min)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos, intente en 15 minutos' },
});
app.post('/api/auth/login', loginLimiter);

// Sincronizar BD y levantar servidor
const start = async () => {
  try {
    await sequelize.sync();
    console.log('Base de datos sincronizada');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

start();
