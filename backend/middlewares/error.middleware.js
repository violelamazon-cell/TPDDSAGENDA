// Middleware de manejo centralizado de errores
// IMPORTANTE: debe montarse DESPUÉS de todas las rutas en app.js
// La firma de 4 parámetros (err, req, res, next) es obligatoria para que Express lo identifique como error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({ error: message });
};

export default errorHandler;
