import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
import * as ctrl from '../controllers/entrevistas.controller.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// IMPORTANTE: /resumen DEBE ir ANTES de /:id para evitar que Express capture "resumen" como parámetro
router.get('/', ctrl.listar);
router.get('/resumen', authorizeRole('admin', 'rrhh'), ctrl.obtenerResumen);
router.get('/:id', ctrl.obtenerPorId);
router.get('/:id/historial', ctrl.obtenerHistorial);

// Rutas de escritura — solo admin/rrhh excepto realizar
router.post('/',
  authorizeRole('admin', 'rrhh'),
  validate([
    body('postulanteId').isInt({ min: 1 }).withMessage('postulanteId debe ser un número entero positivo'),
    body('entrevistadorId').isInt({ min: 1 }).withMessage('entrevistadorId requerido'),
    body('fecha').isDate().withMessage('fecha debe tener formato YYYY-MM-DD'),
    body('horaInicio').matches(/^\d{2}:\d{2}$/).withMessage('horaInicio debe tener formato HH:mm'),
    body('horaFin').matches(/^\d{2}:\d{2}$/).withMessage('horaFin debe tener formato HH:mm'),
    body('modalidad').isIn(['presencial', 'virtual']).withMessage('modalidad debe ser presencial o virtual'),
  ]),
  ctrl.crear
);

router.put('/:id',
  authorizeRole('admin', 'rrhh'),
  validate([
    body('postulanteId').optional().isInt({ min: 1 }).withMessage('postulanteId debe ser un número entero positivo'),
    body('entrevistadorId').optional().isInt({ min: 1 }).withMessage('entrevistadorId debe ser un número entero positivo'),
    body('fecha').optional().isDate().withMessage('fecha debe tener formato YYYY-MM-DD'),
    body('horaInicio').optional().matches(/^\d{2}:\d{2}$/).withMessage('horaInicio debe tener formato HH:mm'),
    body('horaFin').optional().matches(/^\d{2}:\d{2}$/).withMessage('horaFin debe tener formato HH:mm'),
    body('modalidad').optional().isIn(['presencial', 'virtual']).withMessage('modalidad debe ser presencial o virtual'),
  ]),
  ctrl.editar
);

router.patch('/:id/cancelar',
  authorizeRole('admin', 'rrhh'),
  validate([
    body('motivo').optional().isString().withMessage('El motivo debe ser un texto'),
  ]),
  ctrl.cancelar
);

router.patch('/:id/realizar',
  validate([
    body('observaciones').optional().isString().withMessage('Las observaciones deben ser texto'),
  ]),
  ctrl.realizar
);

router.patch('/:id/reprogramar',
  authorizeRole('admin', 'rrhh'),
  validate([
    body('fecha').optional().isDate().withMessage('fecha debe tener formato YYYY-MM-DD'),
    body('horaInicio').optional().matches(/^\d{2}:\d{2}$/).withMessage('horaInicio debe tener formato HH:mm'),
    body('horaFin').optional().matches(/^\d{2}:\d{2}$/).withMessage('horaFin debe tener formato HH:mm'),
    body('entrevistadorId').optional().isInt({ min: 1 }).withMessage('entrevistadorId debe ser un número entero positivo'),
    body('modalidad').optional().isIn(['presencial', 'virtual']).withMessage('modalidad debe ser presencial o virtual'),
  ]),
  ctrl.reprogramar
);

export default router;
