const { app, BrowserWindow } = require('electron');
const path = require('path');

// Comprobar si estamos en modo desarrollo
const isDev = !app.isPackaged;

function createWindow() {
  // Crear la ventana del navegador.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    show: false, // Evitar parpadeos al iniciar
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Permitir uso de Node en React (ajustar según políticas de seguridad finales)
      preload: path.join(__dirname, 'preload.js') // Opcional, para mayor seguridad en producción
    }
  });

  // Ocultar el menú por defecto
  mainWindow.setMenuBarVisibility(false);

  // Cargar la aplicación
  if (isDev) {
    // En desarrollo, cargar desde el servidor Vite
    mainWindow.loadURL('http://localhost:5173');
    // Abrir las herramientas de desarrollo
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, cargar el archivo index.html compilado por Vite
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Mostrar la ventana una vez que esté lista para renderizar
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// Este método se llamará cuando Electron haya finalizado la inicialización
// y esté listo para crear ventanas del navegador.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // icono del dock es clicado y no hay otras ventanas abiertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Salir cuando todas las ventanas estén cerradas, excepto en macOS.
// Allí, es común que las aplicaciones y su barra de menú permanezcan
// activas hasta que el usuario salga explícitamente con Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
