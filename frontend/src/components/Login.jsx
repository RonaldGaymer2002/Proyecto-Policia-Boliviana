import React, { useState, useEffect } from 'react';
import { translations } from '../services/translations';

const Login = ({ onLogin, isDarkMode, setIsDarkMode, idioma, setIdioma }) => {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [scanPosition, setScanPosition] = useState(0);

  // Animación del escáner decorativo
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Simular tiempo de conexión/cifrado
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-mono relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-100'}`}>
      
      {/* Botón de Alternancia de Modo (Capa superior) */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
          title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
          <span className="text-xl group-hover:scale-110 transition-transform">
            {isDarkMode ? '☀️' : '🌙'}
          </span>
        </button>
      </div>
      
      {/* Fondo de Radar Táctico ( Wallpaper Animado ) */}
      <div className={`absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden transition-opacity duration-700 ${isDarkMode ? 'opacity-90' : 'opacity-40'}`}>
        <div className={`relative w-[1200px] h-[1200px] md:w-[1500px] md:h-[1500px] rounded-full border-[12px] flex items-center justify-center transition-colors duration-500 shadow-[0_0_100px_rgba(16,185,129,0.15)] ${isDarkMode ? 'border-emerald-500/30 bg-black' : 'border-emerald-500/20 bg-white'}`}>
          
          {/* Círculos Concéntricos con Brillo Propio */}
          <div className={`absolute w-[1000px] h-[1000px] rounded-full border-2 ${isDarkMode ? 'border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-emerald-500/20'}`}></div>
          <div className={`absolute w-[800px] h-[800px] rounded-full border-2 ${isDarkMode ? 'border-emerald-500/35 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-emerald-500/25'}`}></div>
          <div className={`absolute w-[600px] h-[600px] rounded-full border-2 border-dashed ${isDarkMode ? 'border-emerald-500/45 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'border-emerald-500/30'}`}></div>
          <div className={`absolute w-[400px] h-[400px] rounded-full border-2 ${isDarkMode ? 'border-emerald-500/35 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-emerald-500/25'}`}></div>
          <div className={`absolute w-[200px] h-[200px] rounded-full border-2 ${isDarkMode ? 'border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-emerald-500/20'}`}></div>
          
          {/* Ejes Cartesianos Reforzados */}
          <div className={`absolute w-full h-0.5 ${isDarkMode ? 'bg-emerald-500/40' : 'bg-emerald-500/20'}`}></div>
          <div className={`absolute h-full w-0.5 ${isDarkMode ? 'bg-emerald-500/40' : 'bg-emerald-500/20'}`}></div>
          
          {/* Barrido de Radar (Ultra Intenso) */}
          <div className="absolute inset-0 rounded-full animate-radar-sweep z-10">
            <div 
              className="absolute inset-0 rounded-full" 
              style={{ background: isDarkMode 
                ? 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(16, 185, 129, 0.7) 360deg)'
                : 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(16, 185, 129, 0.4) 360deg)'
              }}
            ></div>
            <div className={`absolute top-0 left-[50%] w-[6px] h-[50%] transform -translate-x-1/2 origin-bottom shadow-[0_0_40px_#10b981] ${isDarkMode ? 'bg-emerald-300' : 'bg-emerald-600'}`}></div>
          </div>

          {/* Puntos de Rastreo (Blips) - Más Brillantes */}
          <div className="absolute top-[20%] left-[35%] w-5 h-5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_25px_#10b981]"></div>
          <div className="absolute bottom-[30%] right-[40%] w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_20px_#10b981]" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute top-[45%] right-[25%] w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_18px_#10b981]" style={{ animationDelay: '2.5s' }}></div>
        </div>
      </div>

      {/* Contenedor Principal Glassmorphism */}
      <div className={`w-full max-w-md relative z-10 backdrop-blur-md border shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-slate-900/60 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-white/80 border-gray-200 shadow-gray-200/50'}`}>
        
        {/* Decoración Superior */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        
        <div className="p-8">
          
          {/* Cabecera / Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className={`w-20 h-20 rounded-full border-2 border-yellow-600 flex items-center justify-center shadow-lg mb-4 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <img src="/escudopoliciaboliviana.png" alt="Escudo Policía" className="w-14 h-14 object-contain z-10 relative" />
              {/* Animación Radar Logo */}
              <div className="absolute inset-0 bg-emerald-500/20 rotate-45 animate-spin origin-bottom-right" style={{ animationDuration: '3s' }}></div>
            </div>
            <h1 className={`text-2xl font-black tracking-widest text-center transition-colors duration-500 ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200' : 'text-emerald-700'}`}>
              S.G.A.N.C.
            </h1>
            <p className="text-xs text-yellow-600 tracking-widest mt-1 font-bold">PORTAL INSTITUCIONAL</p>
            <p className={`text-[10px] font-black tracking-widest mt-2 px-3 py-1 border rounded transition-colors duration-500 ${isDarkMode ? 'text-red-500 border-red-500/30 bg-red-900/20' : 'text-red-700 border-red-200 bg-red-50'}`}>
              ⚠️ ACCESO RESTRINGIDO - USO OFICIAL
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Usuario */}
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors ${isDarkMode ? 'text-emerald-500/70 group-focus-within:text-emerald-400' : 'text-gray-400 group-focus-within:text-emerald-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input 
                type="text" 
                required
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                className={`w-full text-sm rounded-lg block w-full pl-10 p-3 transition-all outline-none shadow-inner border ${isDarkMode ? 'bg-slate-950/50 border-slate-700 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-emerald-600 focus:border-emerald-600'}`}
                placeholder="Identificador de Placa / Usuario"
              />
              <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-r-lg"></div>
            </div>

            {/* Input Contraseña */}
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors ${isDarkMode ? 'text-emerald-500/70 group-focus-within:text-emerald-400' : 'text-gray-400 group-focus-within:text-emerald-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full text-sm rounded-lg block w-full pl-10 p-3 transition-all outline-none shadow-inner tracking-widest border ${isDarkMode ? 'bg-slate-950/50 border-slate-700 text-emerald-100 focus:ring-emerald-500 focus:border-emerald-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-emerald-600 focus:border-emerald-600'}`}
                placeholder="••••••••"
              />
              <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-r-lg"></div>
            </div>

            {/* Elemento Decorativo (Escaneo) */}
            <div className={`w-full h-8 border rounded relative overflow-hidden flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 border-emerald-900' : 'bg-gray-100 border-gray-200'}`}>
              <div className={`absolute left-0 top-0 h-full w-full ${isDarkMode ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(16,185,129,0.1)_2px,rgba(16,185,129,0.1)_4px)]' : 'bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.02)_2px,rgba(0,0,0,0.02)_4px)]'}`}></div>
              <div 
                className={`absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent`}
                style={{ left: `${-100 + scanPosition * 2}%` }}
              ></div>
              <span className={`text-[10px] z-10 font-bold uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-emerald-600' : 'text-gray-500'}`}>
                {isAuthenticating ? (idioma === 'en' ? 'Establishing VPN Tunnel...' : 'Estableciendo Túnel VPN...') : translations[idioma].bienvenido}
              </span>
            </div>

            {/* Botón Acceder */}
            <button 
              type="submit" 
              disabled={isAuthenticating}
              className={`w-full py-3 px-4 flex justify-center items-center rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300
                ${isAuthenticating 
                  ? 'bg-emerald-800 text-emerald-400 cursor-not-allowed' 
                  : 'bg-emerald-600 text-slate-950 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:text-black border border-emerald-400'
                }`}
            >
              {isAuthenticating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {idioma === 'en' ? 'AUTHENTICATING...' : 'AUTENTICANDO...'}
                </>
              ) : (
                translations[idioma].atencion === 'Warning' ? 'Enter System' : 'Ingresar al Sistema'
              )}
            </button>
          </form>

          {/* Ayuda Contacto */}
          <div className={`mt-8 pt-4 border-t text-center transition-colors duration-500 ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
            <p className={`text-[10px] font-medium tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
              Si olvidó su acceso, contacte con el Administrador de Sistemas de la Unidad.
            </p>
          </div>

        </div>
        
        {/* Borde inferior decorativo */}
        <div className={`h-1.5 w-full transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-r from-transparent via-yellow-600 to-transparent' : 'bg-policia-verde'}`}></div>
      </div>
    </div>
  );
};

export default Login;
