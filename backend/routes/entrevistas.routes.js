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
    body('postulanteId').notEmpty().withMessage('El postulante es obligatorio'),
    body('entrevistadorId').notEmpty().withMessage('El entrevistador es obligatorio'),
    body('fecha').isDate().withMessage('La fecha es obligatoria y debe ser válida'),
    body('horaInicio').notEmpty().withMessage('La hora de inicio es obligatoria'),
    body('horaFin').notEmpty().withMessage('La hora de fin es obligatoria'),
    body('modalidad').isIn(['presencial', 'virtual']).withMessage('La modalidad debe ser presencial o virtual'),
  ]),
  ctrl.crear
);

router.put('/:id',
  authorizeRole('admin', 'rrhh'),
  ctrl.editar
);

router.patch('/:id/cancelar',
  authorizeRole('admin', 'rrhh'),
  ctrl.cancelar
);

router.patch('/:id/realizar', ctrl.realizar);

router.patch('/:id/reprogramar',
  authorizeRole('admin', 'rrhh'),
  validate([
    body('fecha').optional().isDate().withMessage('La fecha debe ser válida'),
    body('horaInicio').optional().notEmpty().withMessage('La hora de inicio no puede estar vacía'),
    body('horaFin').optional().notEmpty().withMessage('La hora de fin no puede estar vacía'),
  ]),
  ctrl.reprogramar
);

export default router;
