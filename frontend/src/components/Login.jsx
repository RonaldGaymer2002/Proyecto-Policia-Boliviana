import React, { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-mono relative overflow-hidden">
      
      {/* Fondo Decorativo Cyberpunk */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
      </div>

      {/* Contenedor Principal Glassmorphism */}
      <div className="w-full max-w-md relative z-10 backdrop-blur-md bg-slate-900/60 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-2xl overflow-hidden">
        
        {/* Decoración Superior */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        
        <div className="p-8">
          
          {/* Cabecera / Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-slate-800 rounded-full border-2 border-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(202,138,4,0.3)] mb-4 relative overflow-hidden">
              <img src="/escudopoliciaboliviana.png" alt="Escudo Policía" className="w-14 h-14 object-contain z-10 relative" />
              {/* Animación Radar Logo */}
              <div className="absolute inset-0 bg-emerald-500/20 rotate-45 animate-spin origin-bottom-right" style={{ animationDuration: '3s' }}></div>
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 tracking-widest text-center">
              S.G.A.N.C.
            </h1>
            <p className="text-xs text-yellow-500 tracking-widest mt-1 font-bold">PORTAL INSTITUCIONAL</p>
            <p className="text-[10px] text-red-500 font-black tracking-widest mt-2 px-3 py-1 border border-red-500/30 bg-red-900/20 rounded">
              ⚠️ ACCESO RESTRINGIDO - USO OFICIAL
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Usuario */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500/70 group-focus-within:text-emerald-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input 
                type="text" 
                required
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 text-emerald-100 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-3 transition-all outline-none shadow-inner"
                placeholder="Identificador de Placa / Usuario"
              />
              <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-r-lg"></div>
            </div>

            {/* Input Contraseña */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-500/70 group-focus-within:text-emerald-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 text-emerald-100 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 p-3 transition-all outline-none shadow-inner tracking-widest"
                placeholder="••••••••"
              />
              <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-r-lg"></div>
            </div>

            {/* Elemento Decorativo (Escaneo) */}
            <div className="w-full h-8 bg-slate-950 border border-emerald-900 rounded relative overflow-hidden flex items-center justify-center">
              <div className="absolute left-0 top-0 h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(16,185,129,0.1)_2px,rgba(16,185,129,0.1)_4px)]"></div>
              <div 
                className="absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
                style={{ left: `${-100 + scanPosition * 2}%` }}
              ></div>
              <span className="text-[10px] text-emerald-600 z-10 font-bold uppercase tracking-widest">
                {isAuthenticating ? 'Estableciendo Túnel VPN...' : 'Esperando Credenciales'}
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
                  AUTENTICANDO...
                </>
              ) : (
                'Acceder al Sistema'
              )}
            </button>
          </form>

          {/* Ayuda Contacto */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-500">
              Si olvidó su acceso, contacte con el Administrador de Sistemas de la Unidad.
            </p>
          </div>

        </div>
        
        {/* Borde inferior decorativo */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>
      </div>
    </div>
  );
};

export default Login;
