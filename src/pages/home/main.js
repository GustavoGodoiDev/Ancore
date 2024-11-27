const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Se usar preload
            nodeIntegration: true,
            contextIsolation: false, // Somente para desenvolvimento
        },
    });

    // Carrega a página inicial
    mainWindow.loadFile('src/pages/home/index.html');
}

// Evento para navegar para a página de criação de conta
ipcMain.on('navigate-to-create-account', () => {
    const filePath = path.join(app.getAppPath(), 'src', 'pages', 'create_account', 'ca.html');
    console.log('Carregando página:', filePath); // Para verificar o caminho correto
    mainWindow.loadFile(filePath);
});


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
