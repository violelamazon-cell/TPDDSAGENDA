import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export const registrarUsuario = async ({ nombre, email, password, rol }) => {
  const existente = await Usuario.findOne({ where: { email } });
  if (existente) {
    throw Object.assign(new Error('El email ya está registrado'), { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const usuario = await Usuario.create({ nombre, email, passwordHash, rol: rol || 'entrevistador' });

  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
};

export const loginUsuario = async ({ email, password }) => {
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });
  }

  if (!usuario.activo) {
    throw Object.assign(new Error('Usuario desactivado'), { status: 401 });
  }

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) {
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });
  }

  const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return {
    accessToken,
    refreshToken,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
  };
};

export const refreshAccessToken = (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: payload.id, email: payload.email, rol: payload.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    return { accessToken };
  } catch (err) {
    throw Object.assign(new Error('Refresh token inválido o expirado'), { status: 403 });
  }
};
