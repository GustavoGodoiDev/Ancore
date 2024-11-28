const Database = require('better-sqlite3'); // Importa o better-sqlite3
const path = require('path'); // Para gerenciar caminhos

// Caminho para o arquivo do banco de dados
const dbPath = path.join(__dirname, 'data', 'ancore.db');

// Inicializa a conexão com o banco
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

// Verificar as tabelas
const tables = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table';
`).all();

console.log('Tabelas no banco de dados:', tables);

// Tabela User ----------------------------------------------------------------------------------------------------
const checkUserExists = db.prepare(`
    SELECT * FROM users WHERE username = ?;
`);
const insertUser = db.prepare(`
    INSERT INTO users (username, password) VALUES (?, ?);
`);

// Verifica se o usuário existe antes de inserir
const existingUser = checkUserExists.get('johndoe');
if (existingUser) {
    console.log('Usuário já existe.');
} else {
    insertUser.run('johndoe', 'password123');  // Substitua com os dados do usuário
    console.log('Novo usuário inserido.');
}

// Tabela Config ----------------------------------------------------------------------------------------------------
const checkSettingsExists = db.prepare(`
    SELECT * FROM settings WHERE user_id = ?;
`);
const insertSettings = db.prepare(`
    INSERT INTO settings (user_id, theme, background) VALUES (?, ?, ?);
`);

// Verifica se as configurações já foram inseridas para o usuário
const existingSettings = checkSettingsExists.get(1); // Substitua pelo user_id desejado
if (!existingSettings) {
    insertSettings.run(1, 'dark', 'background1');  // Substitua os valores conforme necessário
    console.log('Configurações inseridas para o usuário.');
} else {
    console.log('Configurações já existentes para o usuário.');
}

// Tabela Tasks ----------------------------------------------------------------------------------------------------
const insertTask = db.prepare(`
    INSERT INTO tasks (user_id, title, description, completed) VALUES (?, ?, ?, ?);
`);

// Tenta inserir uma nova tarefa
try {
    insertTask.run(1, 'Tarefa 1', 'Descrição da tarefa', 0);  // 0 representa 'false' para a coluna 'completed'
    console.log('Tarefa inserida.');
} catch (err) {
    console.error('Erro ao inserir tarefa:', err.message);
}

// Verificação Tabelas ----------------------------------------------------------------------------------------------------
const users = db.prepare(`SELECT * FROM users`).all();
console.log('Usuários:', users);

const settings = db.prepare(`SELECT * FROM settings`).all();
console.log('Configurações:', settings);

const tasks = db.prepare(`SELECT * FROM tasks`).all();
console.log('Tarefas:', tasks);
