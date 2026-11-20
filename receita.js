const botaoPesquisar = document.getElementById("btnPesquisar");
const odEsferico = document.getElementById("odEsferico");
const odCilindrico = document.getElementById("odCilindrico");
const odEixo = document.getElementById("odEixo");
const odAdicao = document.getElementById("odAdicao");
const oeEsferico = document.getElementById("oeEsferico");
const oeCilindrico = document.getElementById("oeCilindrico");
const oeEixo = document.getElementById("oeEixo");
const oeAdicao = document.getElementById("oeAdicao");
const resultadoLentes = document.getElementById("resultadoLentes");
function grauValido(valor) {
    if (valor === "") {
        return true;
    }
    const formato = /^[+-]\d+([, .](00|25|50|75))$/;
    return formato.test(valor);
}

botaoPesquisar.addEventListener("click", function () {
const valorOdEsferico = odEsferico.value; 
const valorOdCilindrico = odCilindrico.value;
const valorOdEixo = odEixo.value;
const valorOdAdicao = odAdicao.value;
const valorOeEsferico = oeEsferico.value; 
const valorOeCilindrico = oeCilindrico.value;
const valorOeEixo = oeEixo.value;
const valorOeAdicao = oeAdicao.value;

if (!grauValido(valorOdEsferico)){
    alert("Digite o grau esférico do OD no formato +0,00 ou -0,00 usando intervalos de 0,25")
    return;
}

if (!grauValido(valorOdCilindrico)){
    alert("Digite o grau Cilindrico do OD no formato +0,00 ou -0,00 usando intervalos de 0,25");
    return;
}
if (!grauValido(valorOeEsferico)){
    alert("Digite o grau esférico do OE no formato +0,00 ou -0,00 usando intervalos de 0,25")
    return;
}

if (!grauValido(valorOeCilindrico)){
    alert("Digite o grau Cilindrico do OE no formato +0,00 ou -0,00 usando intervalos de 0,25");
    return;
}

if (valorOdEixo !== "" && (Number(valorOdEixo) < 0 || Number(valorOdEixo) > 180)) {
    alert("0 Eixo do OD deve estar entre 0 e 180");
    return;
}

if (valorOeEixo !== "" && (Number(valorOeEixo) < 0 || Number(valorOeEixo) > 180)) {
    alert("0 Eixo do OE deve estar entre 0 e 180");
    return;   
}

if(!grauValido(valorOdAdicao)) {
    alert("Digite a Adição do OD no formato +0,00 usando intervalos de 0,25");
    return;
}

if(!grauValido(valorOeAdicao)) {
    alert("Digite a Adição do OE no formato +0,00 usando intervalos de 0,25");
    return;
}

if ((valorOdCilindrico && !valorOdEixo) ||(!valorOdCilindrico && valorOdEixo)) {
    alert("Preencha o Cilindrico e o Eixo do OD juntos");
    return;
}
if ((valorOeCilindrico && !valorOeEixo) ||(!valorOeCilindrico && valorOeEixo)) {
    alert("Preencha o Cilindrico e o Eixo do OE juntos");
    return;
}

const temGrau = 
valorOdEsferico !== "" ||
valorOdCilindrico !== "" ||
valorOeEsferico !== "" ||
valorOeCilindrico !== "";

if (!temGrau) {
    alert("Preencha o grau da receita antes de pesquisar sua lente.");
    resultadoLentes.innerHTML = "";
    return;
}

const temAdicao = 
      valorOdAdicao !== "" && valorOdAdicao !== "+0,00" ||
      valorOeAdicao !== "" && valorOeAdicao !== "+0,00";

const graus = [
    valorOdEsferico,
    valorOdCilindrico,
    valorOeEsferico,
    valorOeCilindrico
];

const maiorGrau = Math.max(
    ...graus
    .filter(valor => valor !== "")
    .map(valor => Math.abs(Number(valor.replace(",", "."))))
);

let opcoesIndices = [];

if (maiorGrau >= 0.25 && maiorGrau <= 1.00) {
    opcoesIndices = ["1.50", "1.56", "1.60", "1.67", "1.74"];

} else if (maiorGrau <= 2.75) {
  opcoesIndices = ["1.56", "1.60", "1.67", "1.74"];

} else if (maiorGrau <=4.00) {
  opcoesIndices = [ "1.60", "1.67", "1.74"];

} else if (maiorGrau <=7.00) {
  opcoesIndices = [ "1.67", "1.74"];

} else if (maiorGrau <=12.00) {
  opcoesIndices = ["1.74"];

}else {
    opcoesIndices = [];

}

const explicacoes = {
    "1.50": "Indicada para graus baixos. Boa nitidez e ótimo custo-beneficio.",
    "1.56": "Mais fina e leve que a 1.50. Indicada para graus moderados.",
    "1.60": "Mais fina e resistente. Boa opção pra graus mais elevados.",
    "1.67": "Lente mais fina e mais leve, além de alta transparencia, indicada para graus mais elevados.",
    "1.74": "Lente ultrafina, indicada para graus mais altos, para melhor espessura e nitidez.",
};
const cardsIndices = opcoesIndices.map(indice => `
    <div class="opcao-indice">

     <div class="numero-indice">
    ${indice}
    </div>

    <div class="info-indice">
    <h3>Lente indice ${indice}</h3>
    <p>${explicacoes[indice]}</p>

</div>

    <button type="button" onclick="selecionarLente('${indice}')">
    Selecionar lente
    </button>
</div>

    `).join("");

if (temAdicao) {
    tipoLenteSelecionada = "Multifocal";

resultadoLentes.innerHTML = `

    <h2>Lentes encontradas</h2>

    <div class="opcao-lente">
        <h3>Lente Multifocal</h3>

        <p>
            Indicada para corrigir presbiopia (vista cansada) e permitir
            uma visão nítida em diferentes distâncias.
        </p>

        <button type="button" class="btn-opcoes"
            onclick="mostrarCamposMultifocal()">
            Escolher campo visual ->
        </button>

        <div id="camposMultifocal" hidden>

            <div class="opcao-campo">
                <h3>Campo Essencial</h3>
                <p>
                    Campo visual mais reduzido. Uma opção de entrada
                    para lentes multifocais.
                </p>
                <button type="button"
                    onclick="selecionarCampo('Essencial')">
                    Selecionar
                </button>
            </div>

            <div class="opcao-campo">
                <h3>Campo Amplo</h3>
                <p>
                    Campo visual intermediário, proporcionando mais
                    conforto nas diferentes distâncias.
                </p>
                <button type="button"
                    onclick="selecionarCampo('Amplo')">
                    Selecionar
                </button>
            </div>

            <div class="opcao-campo">
                <h3>Campo Premium</h3>
                <p>
                    Campo visual mais amplo, oferecendo maior conforto
                    e transições mais suaves entre longe, intermediário e perto.
                </p>
                <button type="button"
                    onclick="selecionarCampo('Premium')">
                    Selecionar
                </button>
            </div>

        </div>
    </div>
`;
}
else {
    resultadoLentes.innerHTML = `
<h2>Lentes encontradas</h2>

<div class = "opcao-lente">
    <h3>Lente Visão Simples</h3>
    <p>
    Indicada para correção de miopia, hipermetropia e astigmatismo.
    </p>

    <button type="button" class="btn-opcoes" onclick="mostrarOpcoes()">
       Opções de lentes ->
</button>
</div>

<div id="opcoesIndices" hidden>
  ${cardsIndices}
  </div>


`;

}
}); 

function mostrarOpcoes() {
    const opcoes = document.getElementById("opcoesIndices");
    const botao = document.querySelector(".btn-opcoes");

    if (opcoes.hidden) {
        opcoes.hidden = false;
        botao.innerHTML = "<- Ocultar opçoes";
    }else{
        opcoes.hidden= true;
        botao.innerHTML = "Opçoes de lentes ->";
    }
 }

   let indiceSelecionado = null;
   let campoSelecionado = null;  
   let tipoLenteSelecionada = null;


   function selecionarLente(indice) {
    indiceSelecionado = indice;
    alert("Lente índice " + indice + " selecionada!");
     salvarReceita();
}
 function mostrarCamposMultifocal() {
    const campos = document.getElementById("camposMultifocal");

    if (campos.hidden) {
        campos.hidden = false;
    } else {
        campos.hidden = true;
    }
 }

function selecionarCampo(campo) {
    campoSelecionado = campo;

    alert("Campo visual " + campo + " selecionado!");
    salvarReceita();
}

function salvarReceita() {
    const clienteId = localStorage.getItem("clienteId");

    if (!clienteId) {
        alert("Cliente não identificado. Faça o login novamente.");
        window.location.href = "index.html";
        return;
    }

    const dadosReceita = {
        cliente_id: Number(clienteId),

        od_esferico: odEsferico.value,
        od_cilindrico: odCilindrico.value,
        od_eixo: odEixo.value,
        od_adicao: odAdicao.value,

        oe_esferico: oeEsferico.value,
        oe_cilindrico: oeCilindrico.value,
        oe_eixo: oeEixo.value,
        oe_adicao: oeAdicao.value,

        tipo_lente: campoSelecionado ? "Multifocal" : "Visão Simples",
        indice_lente: indiceSelecionado || null,
        campo_multifocal: campoSelecionado || null
    };

    fetch("http://localhost:3000/receitas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosReceita)
    })
    .then(resposta => resposta.json())
    .then(dados => {
        if (dados.erro) {
            alert(dados.erro);
            return;
        }
 localStorage.setItem("receitaId", dados.receitaId);

 document.getElementById("secaoTratamentos").style.display = "block";

        alert("Receita e lente salvas com sucesso!");
    })
    .catch(erro => {
        console.error(erro);
        alert("Não foi possível salvar a receita.");
    });
}



document.getElementById("btnSalvarTratamentos").addEventListener("click", async function () {
    const receitaId = localStorage.getItem("receitaId");

    const selecionados = document.querySelectorAll(
        'input[name="tratamento"]:checked'
    );

    if (!receitaId) {
        alert("Salve a receita antes de escolher os tratamentos.");
        return;
    }

    if (selecionados.length === 0) {
        alert("Selecione pelo menos um tratamento.");
        return;
    }

    try {
        for (const tratamento of selecionados) {
            const resposta = await fetch("http://localhost:3000/tratamentos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    receita_id: Number(receitaId),
                    nome_tratamento: tratamento.value
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok || dados.erro) {
                throw new Error(dados.erro || "Erro ao salvar tratamento.");
            }
        }

        alert("Tratamentos salvos com sucesso!");

    } catch (erro) {
        console.error(erro);
        alert("Erro ao salvar tratamentos. Verifique o servidor.");
    }
});
