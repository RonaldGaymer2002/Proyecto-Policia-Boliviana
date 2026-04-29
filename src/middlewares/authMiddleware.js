const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    // PARA PRUEBAS: Permitir el paso y asignar un usuario dummy
    req.user = { id: 'dummy-uuid', rol: 'Comandante' };
    return next();
    // En producción usar: return res.status(403).json({ message: 'No se proporcionó un token.' });
  }

  const token = authHeader.split(' ')[1]; // Formato: "Bearer <token>"

  if (!token) {
    req.user = { id: 'dummy-uuid', rol: 'Comandante' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_policia');
    req.user = decoded; 
    next();
  } catch (error) {
    // PARA PRUEBAS: Permitir el paso
    req.user = { id: 'dummy-uuid', rol: 'Comandante' };
    next();
  }
};

module.exports = {
  verifyToken
};
