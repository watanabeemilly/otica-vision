const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend da Ã“tica Vision funcionando");
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
                erro: "NÃ£o foi possÃ­vel cadastrar o cliente"
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

// SALVAR node -e "const sqlite3=require('sqlite3').verbose(); const db=new sqlite3.Database('otica.db'); db.all('SELECT * FROM receitas',[],(e,r)=>{if(e)console.error(e);else console.table(r);db.close();});" DO CLIENTE
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

app.post("/tratamentos", (req, res) => {
    const { receita_id, nome_tratamento } = req.body;

    if (!receita_id || !nome_tratamento) {
        return res.status(400).json({
            erro: "Informe a receita e o tratamento."
        });
    }


const sql = `
    INSERT INTO tratamentos (receita_id, nome_tratamento)
    SELECT ?, ?
    WHERE NOT EXISTS (
        SELECT 1 FROM tratamentos
        WHERE receita_id = ?
        AND nome_tratamento = ?
    )
`;



    db.run(sql, [receita_id, nome_tratamento, receita_id, nome_tratamento], function (erro) {
        if (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao salvar tratamento."
            });
        }

        
if (this.changes === 0) {
    return res.status(200).json({
        mensagem: "Tratamento jÃ¡ cadastrado.",
        jaExistia: true
    });
}

res.status(201).json({
    mensagem: "Tratamento salvo com sucesso!",
    tratamentoId: this.lastID,
    jaExistia: false
});

    });
});
app.post("/armacoes", (req, res) => {
    const { receita_id, tipo_armacao } = req.body;

    if (!receita_id || !tipo_armacao) {
        return res.status(400).json({
            erro: "Informe a receita e o tipo de armaÃ§Ã£o."
        });
    }

    const tiposPermitidos = ["Acetato", "Metal", "Nylor"];

    if (!tiposPermitidos.includes(tipo_armacao)) {
        return res.status(400).json({
            erro: "Tipo de armaÃ§Ã£o invÃ¡lido."
        });
    }

    const sql = `
        INSERT INTO armacoes (receita_id, tipo_armacao)
        SELECT id, ? FROM receitas WHERE id = ?
    `;

    db.run(sql, [tipo_armacao, receita_id], function (erro) {
        if (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao salvar armaÃ§Ã£o."
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                erro: "Receita nÃ£o encontrada."
            });
        }

        res.status(201).json({
            mensagem: "ArmaÃ§Ã£o salva com sucesso!",
            armacaoId: this.lastID
        });
    });
});

app.get("/pedidos/resumo/:receitaId", (req, res) => {
    const receitaId = Number(req.params.receitaId);

    if (!Number.isInteger(receitaId) || receitaId <= 0) {
        return res.status(400).json({
            erro: "Receita inv├ílida."
        });
    }

    const sql = `
        SELECT
            r.id AS receita_id,
            r.tipo_lente,
            r.indice_lente,
            r.campo_multifocal,
            (SELECT GROUP_CONCAT(nome_tratamento, ', ')
             FROM tratamentos
             WHERE receita_id = r.id) AS tratamentos,
            (SELECT tipo_armacao
             FROM armacoes
             WHERE receita_id = r.id
             ORDER BY id DESC
             LIMIT 1) AS armacao
        FROM receitas r
        WHERE r.id = ?
    `;

    db.get(sql, [receitaId], (erro, pedido) => {
        if (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao consultar pedido."
            });
        }

        if (!pedido) {
            return res.status(404).json({
                erro: "Receita n├úo encontrada."
            });
        }

        res.json(pedido);
    });
});


app.post("/pedidos", (req, res) => {
    const receitaId = Number(req.body.receita_id);

    if (!Number.isInteger(receitaId) || receitaId <= 0) {
        return res.status(400).json({
            erro: "Receita inv├ílida."
        });
    }

    const sql = `
        INSERT INTO pedidos (receita_id)
        SELECT r.id
        FROM receitas r
        WHERE r.id = ?
          AND EXISTS (
              SELECT 1 FROM armacoes a
              WHERE a.receita_id = r.id
          )
    `;

    db.run(sql, [receitaId], function (erro) {
        if (erro) {
            if (erro.code === "SQLITE_CONSTRAINT") {
                return res.status(409).json({
                    erro: "Este pedido j├í foi finalizado."
                });
            }

            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao finalizar pedido."
            });
        }

        if (this.changes === 0) {
            return res.status(400).json({
                erro: "Receita n├úo encontrada ou arma├º├úo n├úo selecionada."
            });
        }

        res.status(201).json({
            mensagem: "Pedido finalizado com sucesso!",
            pedidoId: this.lastID
        });
    });
});



const servidor = app.listen(3000, () => {
    console.log("Servidor da Ã“tica Vision rodando na porta 3000");
});

servidor.on("error", (erro) => {
    console.error("ERRO NO SERVIDOR:", erro);
});

process.on("exit", (codigo) => {
    console.log("Node encerrado com cÃ³digo:", codigo);
});
