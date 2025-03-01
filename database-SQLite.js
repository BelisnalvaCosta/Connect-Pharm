/* esta database é para usar o SQLite3, se precisar
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pharmassure.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        telefone TEXT,
        email TEXT UNIQUE,
        senha TEXT,
        endereco TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS medicamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        descricao TEXT,
        preco REAL,
        local TEXT
    )`);
});

module.exports = db;

*/
