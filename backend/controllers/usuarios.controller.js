import { Usuario } from '../models/index.js';

export const getUsuarios = async (req, res) => {
  const { rol } = req.query;
  const whereClause = rol ? { rol, activo: true } : { activo: true };
  
  const usuarios = await Usuario.findAll({
    where: whereClause,
    attributes: ['id', 'nombre']
  });
  
  res.json(usuarios);
};

