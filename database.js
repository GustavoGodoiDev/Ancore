const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Configuração do caminho do banco de dados
const dbPath = path.resolve(__dirname, '..', 'data', 'ancore.db');

// Exibe o caminho da pasta 'data' para depuração
console.log('Caminho da pasta data:', path.dirname(dbPath));

// Verifica se a pasta 'data' existe, caso contrário cria
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Pasta "data" criada com sucesso!');
}

// Inicializa a conexão com o banco de dados
const db = new Database(dbPath);

// Criação das tabelas (caso não existam)
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        theme TEXT DEFAULT 'light',
        background TEXT DEFAULT 'default',
        FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
`);

console.log('Banco de dados e tabelas criadas com sucesso!');

// Funções auxiliares ----------------------------------------------------------------------------------------------------

// Função para verificar se um usuário existe pelo nome de usuário
function checkUserExists(username) {
    return db.prepare(`SELECT * FROM users WHERE username = ?;`).get(username);
}

// Função para inserir um novo usuário
function insertUser(username, password) {
    const stmt = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?);`);
    stmt.run(username, password);
}

// Função para verificar se as configurações do usuário existem
function checkSettingsExists(userId) {
    return db.prepare(`SELECT * FROM settings WHERE user_id = ?;`).get(userId);
}

// Função para inserir configurações de um usuário
function insertSettings(userId, theme = 'light', background = 'default') {
    const stmt = db.prepare(`INSERT INTO settings (user_id, theme, background) VALUES (?, ?, ?);`);
    stmt.run(userId, theme, background);
}

// Função para inserir uma nova tarefa
function insertTask(userId, title, description, completed = false) {
    const stmt = db.prepare(`
        INSERT INTO tasks (user_id, title, description, completed) 
        VALUES (?, ?, ?, ?);
    `);
    stmt.run(userId, title, description, completed ? 1 : 0);
}

// Função para obter o ID de um usuário a partir do nome de usuário
function getUserId(username) {
    const result = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    return result ? result.id : null;
}

// Funções exportadas ----------------------------------------------------------------------------------------------------

// Exportando funções para o `ca.js` poder usar
module.exports = {
    checkUserExists,
    insertUser,
    insertSettings,
    insertTask,
    getUserId,
    checkSettingsExists
};
