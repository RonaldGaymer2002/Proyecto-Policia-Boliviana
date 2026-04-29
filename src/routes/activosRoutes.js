const express = require('express');
const router = express.Router();

const { darDeBajaActivo, generarReporte } = require('../controllers/activosController');
const { verifyToken } = require('../middlewares/authMiddleware');

// ==========================================================
// Rutas de Activos (Protegidas por JWT)
// ==========================================================

// Aplicar middleware de seguridad a todas las rutas de este router
router.use(verifyToken);

/**
 * @route   POST /api/activos/:id_activo/baja
 * @desc    Registra la baja de un activo (Llama al SP en PostgreSQL)
 * @access  Privado (Requiere Token JWT válido)
 */
router.post('/:id_activo/baja', darDeBajaActivo);

/**
 * @route   GET /api/activos/reporte/:formato
 * @desc    Genera reporte Maestro-Detalle usando Factory Method (Formatos: PDF, EXCEL, WORD)
 * @access  Privado (Requiere Token JWT válido)
 */
router.get('/reporte/:formato', generarReporte);

module.exports = router;
