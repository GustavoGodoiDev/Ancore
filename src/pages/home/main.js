const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const bcrypt = require('bcryptjs'); // Importando o bcryptjs
const Database = require('better-sqlite3'); // Usando o banco de dados SQLite

let mainWindow;

// Caminho do banco de dados
const dbPath = path.join(app.getAppPath(), 'data', 'ancore.db');
let db;

try {
    db = new Database(dbPath); // Conectando ao banco de dados
    console.log(`Banco de dados conectado em: ${dbPath}`);
    console.log('Aplicacao iniciada.');
} catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    app.quit(); // Encerra o aplicativo caso o banco não possa ser conectado
}

// Função para criar a janela principal
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

    // Carrega a página inicial com caminho absoluto
    mainWindow.loadFile(path.join(app.getAppPath(), 'src', 'pages', 'home', 'index.html'));
}

// Evento para navegar para a página de criação de conta
ipcMain.on('navigate-to-create-account', () => {
    const filePath = path.join(app.getAppPath(), 'src', 'pages', 'create_account', 'ca.html');
    console.log('Carregando página:', filePath); // Para verificar o caminho correto
    mainWindow.loadFile(filePath);
});

// Evento para validar login
ipcMain.on('login', (event, { username, password }) => {
    try {
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username); // Consulta ao banco

        if (!user) {
            // Usuário não encontrado
            new Notification({
                title: 'Erro no Login',
                body: 'Usuário não encontrado. Deseja criar uma conta?',
            }).show();
            event.reply('login-response', { success: false, message: 'Usuário não encontrado' });
            return;
        }

        // Verificar se a senha está correta usando bcryptjs
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Erro ao comparar senhas:', err);
                event.reply('login-response', { success: false, message: 'Erro interno. Tente novamente mais tarde.' });
                return;
            }

            if (isMatch) {
                // Senha correta
                event.reply('login-response', { success: true, message: 'Login bem-sucedido!' });
                // Aqui você pode realizar a navegação ou outras ações após o login bem-sucedido
            } else {
                // Senha incorreta
                new Notification({
                    title: 'Erro no Login',
                    body: 'Senha incorreta. Tente novamente.',
                }).show();
                event.reply('login-response', { success: false, message: 'Senha incorreta' });
            }
        });
    } catch (error) {
        console.error('Erro ao processar login:', error);
        event.reply('login-response', { success: false, message: 'Erro interno. Tente novamente mais tarde.' });
    }
});

app.whenReady().then(createWindow);

// Fechando o banco de dados ao sair
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        db.close();
        console.log('Conexao com o banco de dados encerrada.');
        console.log('Aplicacao encerrada.');
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
