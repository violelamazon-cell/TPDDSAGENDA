import api from './axios.instance';

export const usuariosService = {
  getEntrevistadores: () => api.get('/usuarios?rol=entrevistador'),
};
