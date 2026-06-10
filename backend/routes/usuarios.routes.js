import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import * as usuariosController from '../controllers/usuarios.controller.js';

const router = Router();

router.use(authenticateToken);
router.get('/', usuariosController.getUsuarios);

export default router;
