const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const FRONTEND_URL = process.env.FRONTEND_URL;

function createWindow() {
  if (!FRONTEND_URL && !app.isPackaged) {
    throw new Error(
      'Falta la variable FRONTEND_URL en el archivo .env',
    );
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,

    webPreferences: {
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);
  win.setMenuBarVisibility(false);

  if (!app.isPackaged) {
    win.loadURL(FRONTEND_URL).catch((error) => {
      console.error(
        `No se pudo cargar ${FRONTEND_URL}:`,
        error,
      );
    });

    win.webContents.openDevTools({mode: 'detach'});
  } else {
    win
      .loadFile(path.join(__dirname, 'dist/index.html'))
      .catch((error) => {
        console.error(
          'No se pudo cargar el build:',
          error,
        );
      });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});