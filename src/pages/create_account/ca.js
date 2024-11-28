const { remote } = require('electron'); // Importa o remote para acessar o backend do Electron
const db = require('./path-to-your/database'); // Importa o banco de dados SQLite

document.addEventListener("DOMContentLoaded", () => {
    // Referência ao formulário de cadastro
    const formCadastro = document.getElementById("form-cadastro");

    // Evento de envio do formulário
    formCadastro.addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o envio do formulário padrão

        // Pegando os valores dos campos
        const usuario = document.getElementById("usuario").value;
        const nome = document.getElementById("nome").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;

        // Validação simples
        if (!usuario || !nome || !senha || !confirmarSenha) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        // Verifica se o usuário já existe no banco
        const userExists = db.prepare('SELECT * FROM users WHERE username = ?').get(usuario);
        if (userExists) {
            alert("Usuário já existe.");
            return;
        }

        // Criptografar a senha (opcional mas recomendado)
        const bcrypt = require('bcryptjs');
        bcrypt.hash(senha, 10, (err, hashedPassword) => {
            if (err) {
                alert("Erro ao criptografar a senha.");
                return;
            }

            // Inserir o novo usuário no banco de dados
            const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
            insertUser.run(usuario, hashedPassword);

            // Inserir configurações iniciais para o novo usuário
            const insertSettings = db.prepare('INSERT INTO settings (user_id, theme, background) VALUES (?, ?, ?)');
            const userId = db.prepare('SELECT id FROM users WHERE username = ?').get(usuario).id;
            insertSettings.run(userId, 'light', 'default');

            alert("Conta criada com sucesso!");
            formCadastro.reset();
            window.location.href = 'index.html'; // Caminho para a página de login
        });
    });
});
