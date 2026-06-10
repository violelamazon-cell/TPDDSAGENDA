export const authorizeRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tenés permiso para esta acción' });
    }
    next();
  };
};
