
const receitaId = localStorage.getItem("receitaId");

const resumoLente = document.getElementById("resumoLente");
const resumoTratamentos = document.getElementById("resumoTratamentos");
const resumoArmacao = document.getElementById("resumoArmacao");
const mensagemPedido = document.getElementById("mensagemPedido");
const btnFinalizar = document.getElementById("btnFinalizar");

async function carregarResumo() {
    if (!receitaId) {
        mensagemPedido.textContent = "Nenhuma receita encontrada.";
        btnFinalizar.disabled = true;
        return;
    }

    try {
        const resposta = await fetch(
            `http://localhost:3000/pedidos/resumo/${receitaId}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao consultar pedido.");
        }

        resumoLente.textContent =
            `${dados.tipo_lente || "Não informado"} - Índice ${dados.indice_lente || "Não informado"}`;

        resumoTratamentos.textContent =
            dados.tratamentos || "Nenhum tratamento selecionado";

        resumoArmacao.textContent =
            dados.armacao || "Nenhuma armação selecionada";

        if (!dados.armacao) {
            btnFinalizar.disabled = true;
            mensagemPedido.textContent = "Selecione uma armação antes de finalizar.";
        }

    } catch (erro) {
        console.error(erro);
        mensagemPedido.textContent = erro.message;
        btnFinalizar.disabled = true;
    }
}

async function finalizarPedido() {
    btnFinalizar.disabled = true;
    mensagemPedido.textContent = "Finalizando pedido...";

    try {
        const resposta = await fetch("http://localhost:3000/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                receita_id: receitaId
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao finalizar pedido.");
        }

        mensagemPedido.textContent =
            `Pedido nº ${dados.pedidoId} finalizado com sucesso!`;

    } catch (erro) {
        console.error(erro);
        mensagemPedido.textContent = erro.message;
        btnFinalizar.disabled = false;
    }
}

btnFinalizar.disabled = true;
btnFinalizar.addEventListener("click", finalizarPedido);

carregarResumo().then(() => {
    if (resumoArmacao.textContent !== "Nenhuma armação selecionada"
        && !mensagemPedido.textContent) {
        btnFinalizar.disabled = false;
    }
});
