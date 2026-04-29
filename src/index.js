const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a Base de Datos (Singleton)
const db = require('./dataAccess/DatabaseConnector');

// Importar Rutas
const authRoutes = require('./routes/authRoutes');
const activosRoutes = require('./routes/activosRoutes');

// Registrar Rutas
app.use('/api/auth', authRoutes);
app.use('/api/activos', activosRoutes);

// Manejador de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Backend Node.js corriendo en el puerto ${PORT}`);
});
