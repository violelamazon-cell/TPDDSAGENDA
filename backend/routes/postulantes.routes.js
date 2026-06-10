import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
import { listar, actualizarEstado } from '../controllers/postulantes.controller.js';

const router = Router();

router.get('/', authenticateToken, authorizeRole('admin', 'rrhh'), listar);
router.patch('/:id/estado', authenticateToken, authorizeRole('admin', 'rrhh'), actualizarEstado);

export default router;
