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

        // Aqui você pode adicionar o código para salvar as informações no banco de dados ou em localStorage
        // Para este exemplo, vamos apenas simular um "cadastro" bem-sucedido
        alert("Conta criada com sucesso!");

        // Limpar os campos após o "cadastro"
        formCadastro.reset();

        // Redireciona para a página de login (index.html)
        document.getElementById('login-btn').addEventListener('click', function() {
            window.location.href = 'C:/DEV/Ancore/src/pages/home/index.html'; // Caminho para a página de login
        });
        
    });

});
