const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./otica.db", (erro) => {
    if (erro) {
        console.log("Erro ao conectar ao banco:", erro.message);
    } else {
        console.log("Banco de dados conectado");
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        telefone TEXT,
        senha TEXT NOT NULL
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS receitas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        od_esferico TEXT,
        od_cilindrico TEXT,
        od_eixo TEXT,
        od_adicao TEXT,
        oe_esferico TEXT,
        oe_cilindrico TEXT,
        oe_eixo TEXT,
        oe_adicao TEXT,
        tipo_lente TEXT,
        indice_lente TEXT,
        campo_multifocal TEXT,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS tratamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        receita_id INTEGER NOT NULL,
        nome_tratamento TEXT NOT NULL,
        FOREIGN KEY (receita_id) REFERENCES receitas(id)
    )
`);
module.exports = db;