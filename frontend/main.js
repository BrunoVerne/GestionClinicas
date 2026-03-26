const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess;

function startBackend() {
  backendProcess = spawn('node', ['src/index.js'], {
    cwd: path.join(__dirname, '../clinica-backend'),
    stdio: 'inherit'
  });

  backendProcess.on('error', (err) => {
    console.error('Error al iniciar el backend:', err);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(() => {
  startBackend();

  // Esperar un poco a que el backend levante
  setTimeout(() => {
    createWindow();
  }, 1500);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});