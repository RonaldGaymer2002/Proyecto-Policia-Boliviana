const express = require('express');
const router = express.Router();

const { login } = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuario, generar JWT y validar RNF-01 (Caducidad 90 días)
 * @access  Público
 */
router.post('/login', login);

module.exports = router;
