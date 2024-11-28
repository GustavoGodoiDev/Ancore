const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Configuração do caminho do banco de dados
const dbPath = path.resolve(__dirname, 'data', 'ancore.db');

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
    return db.prepare(`
        SELECT * FROM users WHERE username = ?;
    `).get(username);
}

// Função para inserir um novo usuário
function insertUser(username, password) {
    return db.prepare(`
        INSERT INTO users (username, password) VALUES (?, ?);
    `).run(username, password);
}

// Função para verificar se as configurações do usuário existem
function checkSettingsExists(userId) {
    return db.prepare(`
        SELECT * FROM settings WHERE user_id = ?;
    `).get(userId);
}

// Função para inserir configurações de um usuário
function insertSettings(userId, theme, background) {
    return db.prepare(`
        INSERT INTO settings (user_id, theme, background) VALUES (?, ?, ?);
    `).run(userId, theme, background);
}

// Função para inserir uma nova tarefa
function insertTask(userId, title, description, completed = false) {
    return db.prepare(`
        INSERT INTO tasks (user_id, title, description, completed) VALUES (?, ?, ?, ?);
    `).run(userId, title, description, completed ? 1 : 0);
}

// Inserções e verificações ----------------------------------------------------------------------------------------------------

// Insere um novo usuário, se não existir
const username = 'johndoe';
const password = 'password123';
if (checkUserExists(username)) {
    console.log('Usuário já existe:', username);
} else {
    insertUser(username, password);
    console.log('Novo usuário inserido:', username);
}

// Configurações padrão para o usuário (se não existirem)
const userId = 1; // Substitua pelo ID real do usuário
if (!checkSettingsExists(userId)) {
    insertSettings(userId, 'dark', 'background1');
    console.log('Configurações padrão inseridas para o usuário com ID:', userId);
} else {
    console.log('Configurações já existentes para o usuário com ID:', userId);
}

// Insere uma nova tarefa para o usuário
try {
    insertTask(userId, 'Tarefa 1', 'Descrição da tarefa', false);
    console.log('Nova tarefa inserida para o usuário com ID:', userId);
} catch (err) {
    console.error('Erro ao inserir tarefa:', err.message);
}

// Exibição de dados ----------------------------------------------------------------------------------------------------

// Exibe todos os usuários
const users = db.prepare(`SELECT * FROM users`).all();
console.log('Usuários cadastrados:', users);

// Exibe todas as configurações
const settings = db.prepare(`SELECT * FROM settings`).all();
console.log('Configurações dos usuários:', settings);

// Exibe todas as tarefas
const tasks = db.prepare(`SELECT * FROM tasks`).all();
console.log('Tarefas cadastradas:', tasks);

// Fechar a conexão com o banco de dados após todas as operações
db.close();  // Fechar a conexão com o banco de dados