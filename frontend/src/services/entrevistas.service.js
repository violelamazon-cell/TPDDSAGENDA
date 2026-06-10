import api from './axios.instance';

export const entrevistasService = {
  getAll:       (params)   => api.get('/entrevistas', { params }),
  getById:      (id)       => api.get(`/entrevistas/${id}`),
  getResumen:   ()         => api.get('/entrevistas/resumen'),
  getHistorial: (id)       => api.get(`/entrevistas/${id}/historial`),
  create:       (data)     => api.post('/entrevistas', data),
  update:       (id, data) => api.put(`/entrevistas/${id}`, data),
  cancelar:     (id, data) => api.patch(`/entrevistas/${id}/cancelar`, data),
  realizar:     (id, data) => api.patch(`/entrevistas/${id}/realizar`, data),
  reprogramar:  (id, data) => api.patch(`/entrevistas/${id}/reprogramar`, data),
};
