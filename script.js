const fs = require('fs');
const path = require('path');

const oldDbPath = path.resolve('C:', 'data', 'ancore.db');

// Verifica se o arquivo existe e exclui
if (fs.existsSync(oldDbPath)) {
    fs.unlinkSync(oldDbPath);
    console.log('Banco de dados antigo excluído:', oldDbPath);
} else {
    console.log('Nenhum banco de dados antigo encontrado no caminho:', oldDbPath);
}
