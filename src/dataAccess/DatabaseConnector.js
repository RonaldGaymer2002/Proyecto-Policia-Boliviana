const { Pool } = require('pg');
require('dotenv').config();

/**
 * Clase DatabaseConnector que implementa el Patrón Singleton
 * Asegura una única instancia de conexión a PostgreSQL en todo el backend (RNF-06).
 */
class DatabaseConnector {
  constructor() {
    if (DatabaseConnector.instance) {
      return DatabaseConnector.instance;
    }

    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'policia_activos',
      password: process.env.DB_PASSWORD || 'admin',
      port: process.env.DB_PORT || 5432,
    });

    // Probar conexión inicial
    this.pool.on('connect', () => {
      console.log('Conexión a PostgreSQL establecida.');
    });

    this.pool.on('error', (err) => {
      console.error('Error inesperado en el pool de PostgreSQL', err);
      process.exit(-1);
    });

    DatabaseConnector.instance = this;
    return this;
  }

  /**
   * Ejecuta una consulta SQL utilizando el pool de conexiones.
   * @param {string} text - La consulta SQL.
   * @param {Array} params - Parámetros de la consulta.
   * @returns {Promise} - Resultado de la consulta.
   */
  async query(text, params) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(text, params);
      return res;
    } finally {
      client.release();
    }
  }

  /**
   * Cierra todas las conexiones del pool.
   */
  async close() {
    await this.pool.end();
  }
}

// Congelar el objeto para evitar que se modifique la instancia
const instance = new DatabaseConnector();
Object.freeze(instance);

module.exports = instance;
