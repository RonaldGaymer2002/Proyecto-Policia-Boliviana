import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajustar según entorno
  headers: {
    'Content-Type': 'application/json'
  }
});

/* 
 * PATRÓN DE ARQUITECTURA (MVC y DAO):
 * Este archivo actúa como el conector principal entre la capa de VISTA (Frontend en React) 
 * y la capa de CONTROLADOR (Backend en Express). 
 * Las peticiones que salen de aquí son procesadas por los Controllers, quienes a su vez 
 * interactúan con los Data Access Objects (DAO) para realizar operaciones seguras 
 * (CRUD) sobre PostgreSQL, garantizando la separación de responsabilidades.
 */

// Interceptor de Peticiones: Adjuntar Token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuestas: Manejo de Seguridad RNF-01 (90 días)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      const data = error.response.data;
      if (data.requirePasswordChange) {
        // Emitir un evento global o modificar el estado global para mostrar el modal de cambio de contraseña
        window.dispatchEvent(new CustomEvent('passwordExpired', { detail: data.message }));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
