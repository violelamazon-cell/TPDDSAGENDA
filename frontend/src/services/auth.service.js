import api from './axios.instance';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (datos) => api.post('/auth/register', datos),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};
