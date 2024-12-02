const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

// função para criar a janela principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'scripts/preload.js'), // Definindo o preload
      nodeIntegration: false // Não permitir nodeIntegration no processo de renderização
    }
  });

  // Carrega o arquivo HTML inicial
  mainWindow.loadFile(path.join(__dirname, '../src/pages/home/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});