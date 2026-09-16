const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend da Ótica Vision funcionando");
});

// CADASTRO DO CLIENTE
app.post("/clientes", (req, res) => {
    const { nome, cpf, email, telefone, senha } = req.body;

    const sql = `
        INSERT INTO clientes (nome, cpf, email, telefone, senha)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [nome, cpf, email, telefone, senha], function (erro) {
        if (erro) {
            return res.status(400).json({
                erro: "Não foi possível cadastrar o cliente"
            });
        }

        res.json({
            mensagem: "Cliente cadastrado com sucesso",
            clienteId: this.lastID
        });
    });
});

// LOGIN
app.post("/login", (req, res) => {
    const { cpf, senha } = req.body;

    const sql = `
        SELECT id, nome, cpf
        FROM clientes
        WHERE cpf = ? AND senha = ?
    `;

    db.get(sql, [cpf, senha], (erro, cliente) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao realizar login"
            });
        }

        if (!cliente) {
            return res.status(401).json({
                erro: "CPF ou senha incorretos"
            });
        }

        res.json({
            mensagem: "Login realizado com sucesso",
            cliente: cliente
        });
    });
});

// SALVAR RECEITA DO CLIENTE
app.post("/receitas", (req, res) => {
    const {
        cliente_id,
        od_esferico,
        od_cilindrico,
        od_eixo,
        od_adicao,
        oe_esferico,
        oe_cilindrico,
        oe_eixo,
        oe_adicao,
        tipo_lente,
        indice_lente,
        campo_multifocal
    } = req.body;

    console.log("DADOS RECEBIDOS:", req.body);

    const sql = `
        INSERT INTO receitas (
            cliente_id,
            od_esferico,
            od_cilindrico,
            od_eixo,
            od_adicao,
            oe_esferico,
            oe_cilindrico,
            oe_eixo,
            oe_adicao,
            tipo_lente,
            indice_lente,
            campo_multifocal
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            cliente_id,
            od_esferico,
            od_cilindrico,
            od_eixo,
            od_adicao,
            oe_esferico,
            oe_cilindrico,
            oe_eixo,
            oe_adicao,
            tipo_lente,
            indice_lente,
            campo_multifocal
        ],
        function (erro) {
         if (erro) {
    console.error("ERRO SQLITE:", erro.message);

    return res.status(500).json({
        erro: "Erro ao salvar receita: " + erro.message
    });
}
            res.json({
                mensagem: "Receita salva com sucesso",
                receitaId: this.lastID
            });
        }
    );
});
 
 app.post("/login", (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res.status(400).json({
            erro: "Informe o CPF e a senha."
        });
    }

    const sql = `
        SELECT id, nome, cpf
        FROM clientes
        WHERE cpf = ? AND senha = ?
    `;

    db.get(sql, [cpf, senha], (erro, cliente) => {
        if (erro) {
            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao realizar login."
            });
        }

        if (!cliente) {
            return res.status(401).json({
                erro: "CPF ou senha incorretos."
            });
        }

        res.json({
            mensagem: "Login realizado com sucesso!",
            clienteId: cliente.id,
            nome: cliente.nome
        });
    });
});

app.listen(3000, () => {
    console.log("Servidor da Ótica Vision rodando na porta 3000");
});