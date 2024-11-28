// ca.js
const { checkUserExists, insertUser, insertSettings, getUserId } = require('./database'); // Ajuste o caminho conforme necessário
const bcrypt = require('bcryptjs');

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
        const userExists = checkUserExists(usuario);
        if (userExists) {
            alert("Usuário já existe.");
            return;
        }

        // Criptografar a senha
        bcrypt.hash(senha, 10, (err, hashedPassword) => {
            if (err) {
                alert("Erro ao criptografar a senha.");
                return;
            }

            // Inserir o novo usuário no banco de dados
            insertUser(usuario, hashedPassword);

            // Inserir configurações iniciais para o novo usuário
            const userId = getUserId(usuario);  // Agora buscando o ID do usuário
            insertSettings(userId, 'light', 'default'); // Configuração padrão

            alert("Conta criada com sucesso!");
            formCadastro.reset();
            window.location.href = 'index.html'; // Caminho para a página de login
        });
    });
});
