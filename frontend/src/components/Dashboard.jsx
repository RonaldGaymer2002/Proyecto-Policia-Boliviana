import React, { useState, useEffect } from 'react';
import api from '../services/api';
import HeaderStatus from './HeaderStatus';

// Componente inteligente para intentar cargar la imagen con distintas extensiones automáticamente
const AutoImage = ({ baseName, alt, className, isDarkMode }) => {
  const extensions = ['.png', '.jpg', '.jpeg', '.webp'];
  const [extIndex, setExtIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setExtIndex(0);
    setHasError(false);
  }, [baseName]);

  if (!baseName || hasError || extIndex >= extensions.length) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
        <span className="text-4xl opacity-20 mb-2">📸</span>
        <span className="text-xs text-gray-500 font-bold uppercase">Sin Fotografía</span>
      </div>
    );
  }

  return (
    <img 
      src={`${baseName}${extensions[extIndex]}`} 
      alt={alt} 
      className={className}
      onError={() => {
        if (extIndex < extensions.length - 1) {
          setExtIndex(prev => prev + 1);
        } else {
          setHasError(true);
        }
      }}
    />
  );
};

const Dashboard = () => {
  // Estados para UI
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [rolActual, setRolActual] = useState('Comandante Gral.');
  const [vistaActual, setVistaActual] = useState('inicio'); // 'inicio', 'activos', 'auditorias', 'bitacora'

  // Estados del Carrusel (Hero Slider)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Estados para Maestro-Detalle de Activos
  const [activos, setActivos] = useState([]);
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  
  // Estados para Filtros
  const [filtroUnidad, setFiltroUnidad] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  
  // Estados para Modal de Baja
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivoBaja, setMotivoBaja] = useState('');
  const [archivoEvidencia, setArchivoEvidencia] = useState(null);

  // Textos y Rutas del Carrusel
  const slides = [
    { id: 1, image: '/slide1.jpg', title: 'Servicios digitales para una Bolivia segura', subtitle: 'Trámites, denuncias y orientación en un solo lugar.' },
    { id: 2, image: '/slide2.jpg', title: '200 Años de Historia', subtitle: 'Vocación y Servicio a la Patria (1826 - 2026).' },
    { id: 3, image: '/slide3.jpg', title: 'Gestión Transparente de Activos', subtitle: 'Modernizando la administración de nuestros recursos logísticos.' },
    { id: 4, image: '/slide4.jpg', title: 'Seguridad Ciudadana', subtitle: 'Tu bienestar es nuestra prioridad en todo el territorio nacional.' },
    { id: 5, image: '/slide5.jpg', title: 'Prevención y Educación', subtitle: 'Trabajando juntos para construir una sociedad más segura.' },
  ];

  // Datos simulados para los nuevos módulos
  const mockAuditorias = [
    { id: 1, fecha: '2026-04-10', unidad: 'DP-1 Santa Cruz', auditor: 'Lic. Juan Pérez', estado: 'Concluida sin observaciones' },
    { id: 2, fecha: '2026-03-25', unidad: 'DP-2 La Paz', auditor: 'Lic. Ana Gómez', estado: 'Faltante de 2 activos (Robo reportado)' },
    { id: 3, fecha: '2026-02-14', unidad: 'DP-3 Cochabamba', auditor: 'Lic. Juan Pérez', estado: 'En proceso de conciliación' },
  ];

  const mockBitacora = [
    { id: 101, timestamp: '2026-04-29 08:30:12', accion: 'INSERT', tabla: 'tbl_activos', usuario: 'Administrativo (DP-1)', detalle: 'Nuevo registro: ACT-005 (Camioneta)' },
    { id: 102, timestamp: '2026-04-28 14:15:05', accion: 'UPDATE', tabla: 'tbl_activos', usuario: 'Comandante Gral.', detalle: 'Cambio de estado ACT-002 a "Dado de Baja"' },
    { id: 103, timestamp: '2026-04-25 09:10:00', accion: 'DELETE', tabla: 'tbl_usuarios', usuario: 'DBA Sysadmin', detalle: 'Eliminación lógica de usuario inactivo' },
  ];

  // Efecto para Carrusel Automático (10 segundos)
  useEffect(() => {
    if (vistaActual !== 'inicio') return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 10000); // 10000 ms = 10 segundos
    return () => clearInterval(interval);
  }, [vistaActual, slides.length]);

  // Simular carga inicial de activos
  useEffect(() => {
    const mockData = [
      { id: '1', codigo: 'ACT-001', descripcion: 'Patrulla Toyota Hilux', estado: 'Bueno', unidad: 'DP-1 Santa Cruz', fecha: '2023-01-15', imagenBase: '/patrulla' },
      { id: '2', codigo: 'ACT-002', descripcion: 'Radio Motorola DP4400', estado: 'Bueno', unidad: 'DP-2 La Paz', fecha: '2023-02-10', imagenBase: '/motorola' },
      { id: '3', codigo: 'ACT-003', descripcion: 'Computadora Desktop HP', estado: 'En Mantenimiento', unidad: 'DP-1 Santa Cruz', fecha: '2022-11-05', imagenBase: '/computadora' },
      { id: '4', codigo: 'ACT-004', descripcion: 'Motocicleta Honda XR250', estado: 'Bueno', unidad: 'DP-3 Cochabamba', fecha: '2023-05-20', imagenBase: '/moto' },
    ];
    setActivos(mockData);
  }, []);

  // Efecto para aplicar Dark Mode al HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleDescargarReporte = async (formato) => {
    try {
      const response = await api.get(`/activos/reporte/${formato}`, { responseType: 'blob' });
      
      const type = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type });
      const url = window.URL.createObjectURL(blob);
      
      let extension = formato;
      if (formato === 'excel') extension = 'xlsx';
      if (formato === 'word') extension = 'docx';

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reporte_Activos.${extension}`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error al descargar reporte ${formato}`, error);
    }
  };

  const handleRegistrarBaja = async (e) => {
    e.preventDefault();
    if (!activoSeleccionado) return;

    try {
      await api.post(`/activos/${activoSeleccionado.id}/baja`, { 
        motivo: motivoBaja,
        tieneArchivo: !!archivoEvidencia
      });
      alert('Activo dado de baja exitosamente');
      setIsModalOpen(false);
      setActivoSeleccionado(null);
    } catch (error) {
      alert('Error al registrar baja: ' + (error.response?.data?.message || 'Desconocido'));
    }
  };

  // Permisos basados en Roles (RBAC Visual)
  const canExport = rolActual !== 'Administrativo';
  const canBaja = rolActual !== 'Auditor';

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 overflow-x-hidden ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      
      {/* Franja Tricolor Bandera Boliviana */}
      <div className="flex h-2 w-full">
        <div className="flex-1 bg-policia-rojo"></div>
        <div className="flex-1 bg-policia-amarillo"></div>
        <div className="flex-1 bg-policia-verde"></div>
      </div>

      {/* Barra Táctica: Reloj en Vivo y Clima (Ticker) */}
      <HeaderStatus isDarkMode={isDarkMode} />

      {/* Header Institucional estilo www.policia.bo */}
      <header className={`px-8 py-5 flex justify-between items-center shadow-sm z-20 relative transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-5">
          {/* Logo Oficial de la Policía Boliviana */}
          <img 
            src="/logo-policia.png" 
            alt="Escudo Policía Boliviana" 
            className="w-16 h-auto drop-shadow-lg"
          />
          <div>
            <h1 className={`text-3xl font-bold tracking-wide ${isDarkMode ? 'text-policia-gold' : 'text-policia-green'}`}>
              POLICÍA BOLIVIANA
            </h1>
            <p className={`text-sm font-serif italic mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              "Contra el mal por el bien de todos"
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-6 border-l-2 border-gray-300 pl-6 dark:border-gray-600">
          
          {/* Botón Dark Mode */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            title="Alternar Modo Oscuro"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          <div className="text-right flex flex-col items-end">
            {/* Selector de Rol Dinámico */}
            <select 
              value={rolActual}
              onChange={(e) => setRolActual(e.target.value)}
              className={`font-bold text-sm bg-transparent outline-none cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            >
              <option value="Comandante Gral.">Comandante Gral.</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Auditor">Auditor (Inspectoría)</option>
            </select>
            <p className={`text-xs uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              SGE-Activos Central
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-2 shadow-md ${isDarkMode ? 'bg-policia-dark text-policia-gold border-policia-gold' : 'bg-policia-gold text-policia-dark border-white'}`}>
            {rolActual.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Navegación Principal */}
      <nav className={`text-white px-8 py-4 shadow-md flex justify-between items-center relative z-10 border-b-4 border-policia-gold transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-policia-green'}`}>
        <div className="flex space-x-8">
          <button 
            onClick={() => setVistaActual('inicio')}
            className={`font-bold uppercase tracking-wider text-sm flex items-center transition-colors ${vistaActual === 'inicio' ? 'text-policia-gold border-b-2 border-policia-gold' : 'text-gray-300 hover:text-white'}`}
          >
            <span className="mr-2">🏠</span> Inicio
          </button>
          <button 
            onClick={() => setVistaActual('activos')}
            className={`font-bold uppercase tracking-wider text-sm flex items-center transition-colors ${vistaActual === 'activos' ? 'text-policia-gold border-b-2 border-policia-gold' : 'text-gray-300 hover:text-white'}`}
          >
            <span className="mr-2">🛡️</span> Gestión de Activos
          </button>
          <button 
            onClick={() => setVistaActual('auditorias')}
            className={`font-bold uppercase tracking-wider text-sm flex items-center transition-colors ${vistaActual === 'auditorias' ? 'text-policia-gold border-b-2 border-policia-gold' : 'text-gray-300 hover:text-white'}`}
          >
            <span className="mr-2">📊</span> Auditorías
          </button>
          <button 
            onClick={() => setVistaActual('bitacora')}
            className={`font-bold uppercase tracking-wider text-sm flex items-center transition-colors ${vistaActual === 'bitacora' ? 'text-policia-gold border-b-2 border-policia-gold' : 'text-gray-300 hover:text-white'}`}
          >
            <span className="mr-2">🖥️</span> Bitácora
          </button>
        </div>

        {canExport && vistaActual === 'activos' && (
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-300 uppercase mr-2">Exportar Padrón:</span>
            <button onClick={() => handleDescargarReporte('pdf')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow">PDF</button>
            <button onClick={() => handleDescargarReporte('excel')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow">EXCEL</button>
            <button onClick={() => handleDescargarReporte('word')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow">WORD</button>
          </div>
        )}
      </nav>

      {/* Contenido Principal Dinámico */}
      {vistaActual === 'inicio' ? (
        // ================= VISTA DE INICIO (PORTAL INSTITUCIONAL) =================
        <main className={`flex-1 w-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          
          {/* 1. SECCIÓN: HERO SLIDER */}
          <div className="relative w-full h-[600px] sm:h-[700px] overflow-hidden">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {/* Imagen del Slide */}
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback de color abstracto si la imagen no existe */}
                <div 
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-policia-green to-policia-dark hidden items-center justify-center"
                >
                  <span className="text-white opacity-20 text-4xl">[{slide.image} no encontrada]</span>
                </div>

                {/* Overlay Oscuro para lectura */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {/* Contenido (Textos) */}
                <div className="absolute inset-0 flex flex-col justify-center items-start p-12 md:p-24 w-full md:w-2/3">
                  <span className="px-4 py-1 bg-policia-gold text-policia-dark font-black text-sm uppercase tracking-widest rounded-full mb-6 shadow-md">
                    Módulo de Información
                  </span>
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-2xl text-gray-200 drop-shadow-md font-medium">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Controles Laterales */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full p-4 transition-all"
            >
              ❮
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full p-4 transition-all"
            >
              ❯
            </button>

            {/* Puntos (Dots) */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-policia-gold w-8' : 'bg-white bg-opacity-50 hover:bg-opacity-100'}`}
                />
              ))}
            </div>
          </div>

          {/* 2. SECCIÓN: NOTICIAS */}
          <section className={`py-16 px-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h3 className={`text-4xl font-black uppercase tracking-wide mb-2 ${isDarkMode ? 'text-policia-gold' : 'text-policia-dark'}`}>
                  Noticias
                </h3>
                <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Comunicados, operativos, prevención y servicios
                </p>
                <div className="w-24 h-1.5 bg-policia-gold mx-auto mt-6 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Noticia 1 */}
                <div className={`rounded-xl overflow-hidden shadow-lg border transition-transform hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
                  <div className="h-48 bg-gray-300 relative overflow-hidden flex items-center justify-center">
                    <span className="text-gray-500">[Imagen Noticia 1]</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-4 h-4 rounded-full bg-policia-gold mr-2 shadow-inner"></div>
                      <h4 className={`font-bold text-lg leading-tight uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Agasajo por el día del niño
                      </h4>
                    </div>
                    <p className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Nuestros servidores policiales del Comando Policial El Alto compartieron una jornada llena de alegría y sonrisas junto a niñas y niños en la actividad Sanos y Seguros con Mi Policía.
                    </p>
                    <div className={`flex justify-between items-center text-xs font-bold uppercase pt-4 border-t ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                      <span className="bg-policia-light text-policia-dark px-3 py-1 rounded-full">Actividades</span>
                      <span>Abril 12, 2026</span>
                    </div>
                  </div>
                </div>

                {/* Noticia 2 */}
                <div className={`rounded-xl overflow-hidden shadow-lg border transition-transform hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
                  <div className="h-48 bg-gray-300 relative overflow-hidden flex items-center justify-center">
                    <span className="text-gray-500">[Imagen Noticia 2]</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-4 h-4 rounded-full bg-policia-gold mr-2 shadow-inner"></div>
                      <h4 className={`font-bold text-lg leading-tight uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Operativos contra el tráfico de fauna
                      </h4>
                    </div>
                    <p className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      En el marco de la Orden de Operaciones "Protección a la Fauna Silvestre", nuestros efectivos realizaron patrullajes exhaustivos logrando la recuperación de especies en peligro.
                    </p>
                    <div className={`flex justify-between items-center text-xs font-bold uppercase pt-4 border-t ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                      <span className="bg-policia-light text-policia-dark px-3 py-1 rounded-full">Operativos</span>
                      <span>Abril 5, 2026</span>
                    </div>
                  </div>
                </div>

                {/* Noticia 3 */}
                <div className={`rounded-xl overflow-hidden shadow-lg border transition-transform hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
                  <div className="h-48 bg-gray-300 relative overflow-hidden flex items-center justify-center">
                    <span className="text-gray-500">[Imagen Noticia 3]</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-4 h-4 rounded-full bg-policia-gold mr-2 shadow-inner"></div>
                      <h4 className={`font-bold text-lg leading-tight uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Persona Desaparecida
                      </h4>
                    </div>
                    <p className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Nuestros servidores policiales de la Dirección Especial de Lucha Contra el Crimen (FELCC) solicitan su colaboración para dar con el paradero de Jhoselin Copa Choque.
                    </p>
                    <div className={`flex justify-between items-center text-xs font-bold uppercase pt-4 border-t ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                      <span className="bg-policia-light text-policia-dark px-3 py-1 rounded-full">Desaparecidos</span>
                      <span>Abril 2, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. SECCIÓN: DOCUMENTOS Y CONVOCATORIAS */}
          <section className={`py-16 px-8 border-t ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h3 className={`text-3xl font-black uppercase tracking-wide mb-2 ${isDarkMode ? 'text-policia-gold' : 'text-policia-dark'}`}>
                  Documentos y Convocatorias
                </h3>
                <p className={`text-md font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Descarga información oficial, normativas y publicaciones
                </p>
                <div className="w-16 h-1 bg-policia-gold mx-auto mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta 1 */}
                <div className={`p-8 rounded-2xl flex flex-col items-start border shadow-sm hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl ${isDarkMode ? 'bg-gray-700 text-policia-gold' : 'bg-policia-light text-policia-dark'}`}>📄</div>
                  <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Portafolio de Servicios</h4>
                  <p className={`text-sm mb-6 flex-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    La función de Policía es en esencia "DEBER Y SERVICIO", entendiendo que la actividad policial debe enfocarse en las necesidades de nuestra ciudadanía.
                  </p>
                  <button className="text-xs font-black uppercase tracking-widest text-policia-gold hover:text-yellow-500 flex items-center">
                    Descargar PDF <span className="ml-2 text-lg">↓</span>
                  </button>
                </div>

                {/* Tarjeta 2 */}
                <div className={`p-8 rounded-2xl flex flex-col items-start border shadow-sm hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl ${isDarkMode ? 'bg-gray-700 text-policia-gold' : 'bg-policia-light text-policia-dark'}`}>📘</div>
                  <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Código de Tránsito</h4>
                  <p className={`text-sm mb-6 flex-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    El tránsito por las vías terrestres de la República de Bolivia, abiertas a la circulación pública, se regirá por este Código.
                  </p>
                  <button className="text-xs font-black uppercase tracking-widest text-policia-gold hover:text-yellow-500 flex items-center">
                    Leer Reglamento <span className="ml-2 text-lg">→</span>
                  </button>
                </div>

                {/* Tarjeta 3 */}
                <div className={`p-8 rounded-2xl flex flex-col items-start border shadow-sm hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl ${isDarkMode ? 'bg-gray-700 text-policia-gold' : 'bg-policia-light text-policia-dark'}`}>🎓</div>
                  <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Convocatoria UNIPOL 2026</h4>
                  <p className={`text-sm mb-6 flex-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    "Encaminados hacia la Excelencia Académica y Profesional, para el Servicio y Protección al Pueblo".
                  </p>
                  <button className="text-xs font-black uppercase tracking-widest text-policia-gold hover:text-yellow-500 flex items-center">
                    Ver Convocatorias <span className="ml-2 text-lg">→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 4. SECCIÓN: NÚMEROS DE EMERGENCIA (CON RADAR DE BARCO / TÁCTICO) */}
          <section className={`relative py-24 px-8 overflow-hidden border-t flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#000a00] border-gray-800' : 'bg-[#0f1a10] border-gray-900'}`}>
            
            {/* Animación del Radar de Monitoreo (Pantalla Circular) */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="relative w-[900px] h-[900px] md:w-[800px] md:h-[800px] rounded-full border-[6px] border-[#0a401a] bg-[#001100] shadow-[0_0_60px_rgba(0,255,0,0.15)] flex items-center justify-center overflow-hidden">
                
                {/* Cuadrícula Verde del Radar */}
                <div className={`absolute w-[600px] h-[600px] rounded-full border border-[#00ff00] opacity-30`}></div>
                <div className={`absolute w-[400px] h-[400px] rounded-full border border-dashed border-[#00ff00] opacity-40`}></div>
                <div className={`absolute w-[200px] h-[200px] rounded-full border border-[#00ff00] opacity-20`}></div>
                <div className={`absolute w-[800px] h-[800px] rounded-full border border-[#00ff00] opacity-20`}></div>
                
                {/* Ejes (Cruz) */}
                <div className={`absolute w-[900px] h-px bg-[#00ff00] opacity-30`}></div>
                <div className={`absolute h-[900px] w-px bg-[#00ff00] opacity-30`}></div>
                
                {/* Escáner de Barrido (Manecilla de Reloj) */}
                <div className="absolute w-[900px] h-[900px] md:w-[800px] md:h-[800px] rounded-full animate-radar-sweep z-10">
                  {/* Estela verde del radar */}
                  <div 
                    className="absolute inset-0 rounded-full" 
                    style={{ background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(0, 255, 0, 0.6) 360deg)' }}
                  ></div>
                  {/* Manecilla brillante (Láser de escaneo) */}
                  <div className="absolute top-0 left-[50%] w-[3px] h-[50%] bg-[#00ff00] shadow-[0_0_15px_#00ff00] transform -translate-x-1/2 origin-bottom"></div>
                </div>

                {/* Objetivos Detectados (Puntos Rojos con 'Datos Encontrados') */}
                
                {/* Objetivo 1 */}
                <div className="absolute top-[25%] left-[30%] animate-radar-blip z-20 flex items-center justify-center" style={{ animationDelay: '0s' }}>
                  <div className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_15px_rgba(255,0,0,1)]"></div>
                  <div className="absolute left-6 text-red-500 font-mono font-bold text-xs w-48 text-left uppercase tracking-wider drop-shadow-md bg-black/40 px-2 py-0.5 rounded">
                    DATO: ACT-002 ENCONTRADO
                  </div>
                </div>

                {/* Objetivo 2 */}
                <div className="absolute bottom-[20%] right-[25%] animate-radar-blip z-20 flex items-center justify-center" style={{ animationDelay: '1.2s' }}>
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(255,0,0,1)]"></div>
                  <div className="absolute right-5 text-red-500 font-mono font-bold text-xs w-48 text-right uppercase tracking-wider drop-shadow-md bg-black/40 px-2 py-0.5 rounded">
                    DATO: INCIDENCIA DP-2
                  </div>
                </div>

                {/* Objetivo 3 */}
                <div className="absolute top-[45%] right-[15%] animate-radar-blip z-20 flex flex-col items-center justify-center" style={{ animationDelay: '2.5s' }}>
                  <div className="w-5 h-5 bg-red-600 rounded-full shadow-[0_0_20px_rgba(255,0,0,1)]"></div>
                  <div className="absolute top-6 text-red-500 font-mono font-bold text-xs w-32 text-center uppercase tracking-wider drop-shadow-md bg-black/40 px-2 py-0.5 rounded">
                    DATO: PATRULLA A-1
                  </div>
                </div>

                {/* Objetivo 4 */}
                <div className="absolute bottom-[35%] left-[15%] animate-radar-blip z-20 flex items-center justify-center" style={{ animationDelay: '3.1s' }}>
                  <div className="w-2 h-2 bg-red-400 rounded-full shadow-[0_0_10px_rgba(255,0,0,1)]"></div>
                  <div className="absolute left-4 text-red-400 font-mono font-bold text-[10px] w-32 text-left uppercase tracking-wider drop-shadow-md bg-black/40 px-1 py-0.5 rounded">
                    SEÑAL DÉBIL
                  </div>
                </div>

              </div>
            </div>

            <div className="max-w-5xl w-full mx-auto text-center relative z-10 bg-black/30 backdrop-blur-md rounded-3xl p-10 border border-white/10 shadow-2xl">
              <h3 className={`text-3xl font-black uppercase tracking-widest mb-16 text-white drop-shadow-md flex items-center justify-center`}>
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-4"></span>
                Centro de Monitoreo - Líneas Seguras
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4">
                <div className="flex flex-col items-center">
                  <p className="font-bold text-sm uppercase tracking-wide mb-2 h-10 flex items-center text-green-400">Tránsito</p>
                  <p className="text-7xl font-black text-white drop-shadow-xl">111</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="font-bold text-sm uppercase tracking-wide mb-2 h-10 flex items-center text-green-400">BOL 110</p>
                  <p className="text-7xl font-black text-white drop-shadow-xl">110</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="font-bold text-sm uppercase tracking-wide mb-2 h-10 flex items-center text-green-400">Bomberos</p>
                  <p className="text-7xl font-black text-white drop-shadow-xl">119</p>
                </div>
                <div className="flex flex-col items-center md:col-start-2 mt-4">
                  <p className="font-bold text-sm uppercase tracking-wide mb-2 h-10 flex items-center text-center leading-tight text-green-400">F.E.L.C.C.</p>
                  <p className="text-7xl font-black text-white drop-shadow-xl">120</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. FOOTER INSTITUCIONAL COMPLETO */}
          <footer className="bg-[#1a1f16] text-white border-t-4 border-policia-gold mt-auto">
            <div className="max-w-7xl mx-auto px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Contacto */}
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-wider mb-6 text-policia-gold border-b border-gray-700 pb-2">Contacto</h4>
                  <ul className="space-y-4 text-sm text-gray-300">
                    <li className="flex items-center"><span className="text-policia-gold mr-3">📞</span> Central: +591 71280618</li>
                    <li className="flex items-center"><span className="text-policia-gold mr-3">✉️</span> contacto@policia.bo</li>
                    <li className="flex items-center"><span className="text-policia-gold mr-3">📍</span> La Paz, Bolivia</li>
                  </ul>
                </div>

                {/* Enlaces Rápidos */}
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-wider mb-6 text-policia-gold border-b border-gray-700 pb-2">Enlaces Rápidos</h4>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="hover:text-white cursor-pointer transition-colors">Ministerio de Gobierno</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Fiscalía General</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Defensoría del Pueblo</li>
                  </ul>
                </div>

                {/* Emergencias Menú */}
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-wider mb-6 text-policia-gold border-b border-gray-700 pb-2">Emergencias</h4>
                  <ul className="space-y-3 text-sm text-gray-300 font-bold">
                    <li>110 - Radio Patrullas</li>
                    <li>119 - Bomberos</li>
                    <li>120 - PAC</li>
                    <li>122 - FELCC</li>
                  </ul>
                </div>

                {/* Mapa Embedido */}
                <div>
                  <h4 className="font-bold text-lg uppercase tracking-wider mb-6 text-policia-gold border-b border-gray-700 pb-2">Ubicación Central</h4>
                  <div className="w-full h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                    {/* Un iframe real o placeholder visual */}
                    <div className="text-center p-2">
                      <span className="text-2xl">🗺️</span>
                      <p className="text-xs text-gray-400 mt-1">Comando General de la Policía Boliviana</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA DE DERECHOS RESERVADOS (ESTUDIANTE) */}
            <div className="bg-black py-4 border-t border-gray-800">
              <div className="max-w-7xl mx-auto px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-mono">
                <p>
                  Derechos reservados por: <strong className="text-gray-300">UTEPSA | RONALD AUGUSTO RODRIGUEZ SERRANO | GRUPO #3 | ING. DE SOFTWARE</strong>
                </p>
                <p className="mt-2 md:mt-0">© 2026</p>
              </div>
            </div>
          </footer>

        </main>
      ) : (
        // ================= VISTAS DE APLICACIÓN (MÓDULOS) =================
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto flex flex-col gap-8">
          
          {vistaActual === 'activos' && (
            <div className="flex flex-col md:flex-row gap-8 w-full h-full">
              {/* Panel Izquierdo: Filtros y Tabla (Maestro) */}
              <div className="flex-1 flex flex-col gap-6">
                
                {/* Filtros estilo Tarjeta */}
                <div className={`p-5 rounded-lg shadow-sm border flex items-end gap-4 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase mb-2 text-gray-500 dark:text-gray-400">Unidad Policial</label>
                    <select 
                      className={`w-full p-2.5 border rounded outline-none transition-shadow ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-policia-gold' : 'bg-gray-50 border-gray-300 focus:ring-policia-green'}`}
                      value={filtroUnidad} onChange={e => setFiltroUnidad(e.target.value)}
                    >
                      <option value="">Todas las Unidades</option>
                      <option value="DP-1">DP-1 Santa Cruz</option>
                      <option value="DP-2">DP-2 La Paz</option>
                      <option value="DP-3">DP-3 Cochabamba</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase mb-2 text-gray-500 dark:text-gray-400">Estado Físico</label>
                    <select 
                      className={`w-full p-2.5 border rounded outline-none transition-shadow ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-policia-gold' : 'bg-gray-50 border-gray-300 focus:ring-policia-green'}`}
                      value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
                    >
                      <option value="">Todos los Estados</option>
                      <option value="Bueno">Bueno</option>
                      <option value="En Mantenimiento">En Mantenimiento</option>
                      <option value="Dado de Baja">Dado de Baja</option>
                    </select>
                  </div>
                </div>

                {/* Tabla de Activos */}
                <div className={`rounded-lg shadow-sm border overflow-hidden flex-1 flex flex-col transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`border-b p-4 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <h2 className={`font-bold uppercase text-sm tracking-wide ${isDarkMode ? 'text-policia-gold' : 'text-policia-dark'}`}>Padrón de Activos No Corrientes</h2>
                  </div>
                  <div className="overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0">
                        <tr className={`text-xs uppercase ${isDarkMode ? 'text-gray-400 bg-gray-900' : 'text-gray-500 bg-policia-light'}`}>
                          <th className="p-4 font-bold">Código</th>
                          <th className="p-4 font-bold">Descripción</th>
                          <th className="p-4 font-bold">Unidad</th>
                          <th className="p-4 font-bold">Estado</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {activos.map(activo => (
                          <tr 
                            key={activo.id} 
                            onClick={() => setActivoSeleccionado(activo)}
                            className={`cursor-pointer transition-colors ${
                              activoSeleccionado?.id === activo.id 
                                ? (isDarkMode ? 'bg-gray-700' : 'bg-green-50') 
                                : (isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50')
                            }`}
                          >
                            <td className="p-4">
                              <span className={`font-mono text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-policia-dark'}`}>{activo.codigo}</span>
                            </td>
                            <td className={`p-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{activo.descripcion}</td>
                            <td className={`p-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{activo.unidad}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                activo.estado === 'Bueno' ? 'bg-green-100 text-green-800' : 
                                activo.estado === 'En Mantenimiento' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {activo.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Panel Derecho: Detalles (Detalle) */}
              <div className={`w-full md:w-96 rounded-lg shadow-md border-t-4 flex flex-col overflow-hidden h-fit sticky top-8 transition-colors ${isDarkMode ? 'bg-gray-800 border-policia-gold' : 'bg-white border-policia-dark'}`}>
                <div className={`p-6 border-b ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-policia-light border-gray-200'}`}>
                  <h2 className={`text-lg font-bold uppercase tracking-wide flex items-center ${isDarkMode ? 'text-white' : 'text-policia-dark'}`}>
                    <span className="text-policia-gold mr-2">ℹ️</span> Detalle del Activo
                  </h2>
                </div>
                
                {activoSeleccionado ? (
                  <div className="flex flex-col">
                    
                    {/* Contenedor Inteligente de Imagen del Activo */}
                    <div className="w-full h-48 relative overflow-hidden border-b border-gray-300 dark:border-gray-700">
                      <AutoImage 
                        baseName={activoSeleccionado.imagenBase} 
                        alt={activoSeleccionado.descripcion} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        isDarkMode={isDarkMode}
                      />
                      {activoSeleccionado.imagenBase && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none">
                          FOTO OFICIAL
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="space-y-5 mb-8">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Cód. Patrimonial</p>
                          <p className={`font-mono text-xl font-bold ${isDarkMode ? 'text-policia-gold' : 'text-policia-green'}`}>{activoSeleccionado.codigo}</p>
                        </div>
                        <div className={`p-3 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                          <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Descripción</p>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{activoSeleccionado.descripcion}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Unidad Policial Asignada</p>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{activoSeleccionado.unidad}</p>
                        </div>
                        <div className={`flex justify-between items-center border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Fecha Ingreso</p>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{activoSeleccionado.fecha}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Estado</p>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                              {activoSeleccionado.estado}
                            </span>
                          </div>
                        </div>
                      </div>

                      {canBaja ? (
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded uppercase font-bold text-sm tracking-wider shadow transition-transform transform hover:-translate-y-0.5"
                        >
                          Registrar Baja (Art. 45)
                        </button>
                      ) : (
                        <div className={`p-3 text-center rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'}`}>
                          <p className="text-xs font-bold uppercase">🔐 Acción Restringida</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-10 flex flex-col items-center justify-center text-center text-gray-400 h-64">
                    <span className="text-4xl mb-3 opacity-20">📄</span>
                    <p className="text-sm">Seleccione un activo del padrón para visualizar su expediente.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vista de Auditorías */}
          {vistaActual === 'auditorias' && (
            <div className={`rounded-lg shadow-sm border overflow-hidden flex-1 flex flex-col transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`border-b p-4 flex justify-between items-center ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <h2 className={`font-bold uppercase text-sm tracking-wide ${isDarkMode ? 'text-policia-gold' : 'text-policia-dark'}`}>Registro de Auditorías (Conciliación Físico-Contable)</h2>
                <span className={`text-xs px-2 py-1 rounded font-bold ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>Rol: {rolActual}</span>
              </div>
              <div className="p-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`text-xs uppercase border-b ${isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'}`}>
                      <th className="p-3 font-bold">ID Acta</th>
                      <th className="p-3 font-bold">Fecha</th>
                      <th className="p-3 font-bold">Unidad Policial</th>
                      <th className="p-3 font-bold">Auditor Asignado</th>
                      <th className="p-3 font-bold">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {mockAuditorias.map(aud => (
                      <tr key={aud.id} className={isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                        <td className="p-3 font-mono font-bold">ACTA-{aud.id}</td>
                        <td className="p-3">{aud.fecha}</td>
                        <td className="p-3">{aud.unidad}</td>
                        <td className="p-3">{aud.auditor}</td>
                        <td className="p-3 font-semibold text-policia-gold">{aud.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vista de Bitácora */}
          {vistaActual === 'bitacora' && (
            <div className={`rounded-lg shadow-sm border overflow-hidden flex-1 flex flex-col transition-colors ${isDarkMode ? 'bg-black border-gray-800' : 'bg-gray-900 border-gray-900'}`}>
              <div className="border-b border-gray-700 p-4 flex justify-between items-center bg-gray-800">
                <h2 className="font-bold uppercase text-sm tracking-wide text-green-400 font-mono">Terminal de Bitácora (Triggers PostgreSQL)</h2>
                <span className="text-xs px-2 py-1 rounded font-bold bg-gray-700 text-gray-300">Live</span>
              </div>
              <div className="p-6 font-mono text-sm overflow-y-auto">
                {mockBitacora.map(log => (
                  <div key={log.id} className="mb-2 pb-2 border-b border-gray-800 text-gray-300">
                    <span className="text-gray-500">[{log.timestamp}]</span> 
                    <span className={`ml-2 font-bold ${log.accion === 'INSERT' ? 'text-blue-400' : log.accion === 'UPDATE' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {log.accion}
                    </span> 
                    <span className="text-green-300 ml-2">on {log.tabla}</span>
                    <span className="text-purple-400 ml-2">by {log.usuario}</span>
                    <span className="text-gray-100 ml-2">{'->'} {log.detalle}</span>
                  </div>
                ))}
                <div className="mt-4 text-gray-500 animate-pulse">_ Waiting for new database triggers...</div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Modal Registrar Baja */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className={`rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border-t-4 border-red-600 transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-lg font-bold text-red-600 uppercase">Formulario de Baja Oficial</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleRegistrarBaja} className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-policia-light'}`}>
              <div className={`mb-4 p-4 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                <p className={`text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Activo a dar de baja:</p>
                <p className={`font-mono font-bold text-lg ${isDarkMode ? 'text-white' : 'text-policia-dark'}`}>{activoSeleccionado?.codigo}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{activoSeleccionado?.descripcion}</p>
              </div>

              <div className="mb-5">
                <label className={`block text-xs font-bold uppercase mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Motivo de Baja (Según Manual)</label>
                <select 
                  required
                  className={`w-full p-2.5 border rounded outline-none transition-shadow ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-red-500' : 'bg-white border-gray-300 focus:ring-red-600'}`}
                  value={motivoBaja}
                  onChange={e => setMotivoBaja(e.target.value)}
                >
                  <option value="">Seleccione dictamen...</option>
                  <option value="Obsolescencia">Obsolescencia Tecnológica</option>
                  <option value="Daño Irreparable">Daño Físico Irreparable</option>
                  <option value="Robo">Robo / Hurto (Requiere DENUNCIA FELCC)</option>
                  <option value="Accidente">Siniestro / Accidente (Requiere INFORME)</option>
                </select>
              </div>

              {(motivoBaja === 'Robo' || motivoBaja === 'Accidente') && (
                <div className="mb-6 p-4 bg-red-900 bg-opacity-20 border border-red-500 border-opacity-50 rounded">
                  <label className="block text-xs font-bold text-red-500 uppercase mb-2">Adjuntar Respaldo Legal (PDF/IMG)</label>
                  <input 
                    type="file" 
                    required
                    onChange={e => setArchivoEvidencia(e.target.files[0])}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-red-900 file:text-red-200 hover:file:bg-red-800 cursor-pointer"
                  />
                  <p className="text-xs text-red-500 mt-2 font-medium">* El respaldo es obligatorio para continuar con el proceso de baja.</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className={`px-5 py-2 font-bold text-sm uppercase tracking-wider transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-sm uppercase tracking-wider shadow transition-colors"
                >
                  Procesar Baja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
