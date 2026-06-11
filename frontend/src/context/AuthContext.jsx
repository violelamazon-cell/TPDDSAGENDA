import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = sessionStorage.getItem('accessToken');
    const usuario = sessionStorage.getItem('usuario');
    const rol = sessionStorage.getItem('rol');
    if (token && usuario) {
      return { usuario: JSON.parse(usuario), token, rol };
    }
    return { usuario: null, token: null, rol: null };
  });

  const login = (usuario, token, rol) => {
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    sessionStorage.setItem('rol', rol);
    setAuth({ usuario, token, rol });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error al cerrar sesión en el servidor', err);
    }
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('rol');
    setAuth({ usuario: null, token: null, rol: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
