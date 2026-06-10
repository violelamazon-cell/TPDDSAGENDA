import { registrarUsuario, loginUsuario, refreshAccessToken } from '../services/auth.service.js';

export const register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const usuario = await registrarUsuario({ nombre, email, password, rol });
  res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, usuario } = await loginUsuario({ email, password });

  // Refresh token en cookie httpOnly
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  });

  res.json({ accessToken, usuario });
};

export const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ error: 'No se encontró refresh token' });
  }

  const { accessToken } = refreshAccessToken(token);
  res.json({ accessToken });
};

export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ mensaje: 'Sesión cerrada correctamente' });
};
