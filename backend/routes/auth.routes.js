import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.middleware.js';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register',
  validate([
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ]),
  register
);

router.post('/login',
  validate([
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ]),
  login
);

router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
