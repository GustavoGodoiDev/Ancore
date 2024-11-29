const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const { createUsersTable, registerUser, verifyUserCredentials } = require('./database');
const url = require('url');

// Função para criar a janela principal do Electron
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src', 'pages', 'home', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        app.quit();
    });
}

// Inicialização do Electron
app.whenReady().then(async () => {
    // Cria a tabela de usuários no banco de dados
    await createUsersTable();
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Comunicação entre renderizador (frontend) e processo principal (backend)
ipcMain.on('login', async (event, { username, password }) => {
    const response = await verifyUserCredentials({ username, password });
    event.reply('login-response', response);
});

ipcMain.on('create-account', async (event, { username, name, password }) => {
    await registerUser({ username, name, password });
    event.reply('account-created', { success: true, message: 'Conta criada com sucesso!' });
});
