import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [expiredMessage, setExpiredMessage] = useState('');

  useEffect(() => {
    // Escuchar el evento emitido por el interceptor de Axios
    const handlePasswordExpired = (event) => {
      setExpiredMessage(event.detail || 'Por políticas de seguridad, debe cambiar su contraseña.');
      setRequirePasswordChange(true);
    };

    window.addEventListener('passwordExpired', handlePasswordExpired);
    return () => window.removeEventListener('passwordExpired', handlePasswordExpired);
  }, []);

  if (requirePasswordChange) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans text-gray-800">
        <div className="bg-white max-w-md w-full rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-red-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Seguridad - Policía Boliviana</h1>
            <p className="text-red-100">RNF-01: Caducidad de Contraseña</p>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <span className="text-5xl border-4 border-red-600 text-red-600 rounded-full p-4 block">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-center mb-4">Cambio Obligatorio</h2>
            <p className="text-center text-gray-600 mb-8">{expiredMessage}</p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Contraseña actualizada'); setRequirePasswordChange(false); }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nueva Contraseña</label>
                  <input type="password" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-600 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Confirmar Contraseña</label>
                  <input type="password" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-600 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-policia-green hover:bg-policia-dark text-white font-bold py-3 rounded-lg transition-colors">
                Actualizar Contraseña
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar la aplicación principal (Dashboard)
  return <Dashboard />;
}

export default App;
