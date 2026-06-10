import api from './axios.instance';

export const postulantesService = {
  getAll: (params) => api.get('/postulantes', { params }),
  cambiarEstado: (id, estado) => api.patch(`/postulantes/${id}/estado`, { estado }),
};
