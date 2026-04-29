const db = require('../dataAccess/DatabaseConnector');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Login y verificación de caducidad de contraseña (RNF-01)
 */
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      `SELECT u.id_usuario, u.pass_hash, u.fecha_ultimo_cambio, u.activo, r.nombre_rol 
       FROM tbl_usuarios_sistema u
       JOIN tbl_roles r ON u.rol_id = r.id_rol
       WHERE u.username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    if (!user.activo) {
      return res.status(403).json({ message: 'Usuario inactivo' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.pass_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Validación de caducidad de 90 días (RNF-01)
    const fechaUltimoCambio = new Date(user.fecha_ultimo_cambio);
    const hoy = new Date();
    const diferenciaDias = Math.floor((hoy - fechaUltimoCambio) / (1000 * 60 * 60 * 24));

    if (diferenciaDias >= 90) {
      return res.status(403).json({ 
        message: 'Contraseña caducada. Debe cambiar su contraseña (RNF-01).',
        requirePasswordChange: true,
        userId: user.id_usuario
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id: user.id_usuario, 
        rol: user.nombre_rol 
      }, 
      process.env.JWT_SECRET || 'super_secret_policia', 
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Autenticación exitosa',
      token,
      user: {
        id: user.id_usuario,
        rol: user.nombre_rol
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  login
};
