async function selecionarArmacao(tipo) {
    const mensagem = document.getElementById("mensagemArmacao");
    const receitaId = localStorage.getItem("receitaId");

    if (!receitaId) {
        mensagem.textContent = "Erro: nenhuma receita encontrada.";
        return;
    }

    mensagem.textContent = "Salvando armação...";

    try {
        const resposta = await fetch("http://localhost:3000/armacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                receita_id: receitaId,
                tipo_armacao: tipo
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = dados.erro || "Erro ao salvar armação.";
            return;
        }

        mensagem.textContent = `Armação de ${tipo} selecionada e salva com sucesso!`;

        // Guarda a armação selecionada
        localStorage.setItem("armacaoSelecionada", tipo);

        // Abre a página de confirmação do pedido
        window.location.href = "pedido.html";
        
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Erro ao conectar com o servidor.";
    }
}