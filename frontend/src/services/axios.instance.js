import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Error de red — backend no disponible
      console.error('Error de red: el backend no está disponible');
    }
    if (error.response?.status === 401) {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('usuario');
      sessionStorage.removeItem('rol');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
