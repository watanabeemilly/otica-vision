const botao = document.getElementById("btnCadastro");
const nome = document.getElementById("nome");
 const campos = document.querySelectorAll("input");
const cpf  = document.getElementById("cpf");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarsenha");
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, "")

        if (cpf.length !== 11) {
            return false;
        }
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
        let soma = 0;
        for (let i=0; i < 9; i++) {
            soma += Number(cpf[i]) * (10-i);
        }

        let primeiroDigito = (soma * 10) % 11;

        if (primeiroDigito === 10) {
            primeiroDigito = 0;
        }

        if(primeiroDigito !== Number(cpf[9])) {
            return false;
        }
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += Number(cpf[i]) * (11-i);
        }

        let segundoDigito = (soma *10) % 11;

        if(segundoDigito ===10) {
            segundoDigito = 0;
        }

        if (segundoDigito !== Number(cpf[10])) {
            return false;
        }

        return true;
    }

    function validarEmail(email) { 
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validarTelefone(telefone) {
        telefone = telefone.replace(/\D/g,"");

        return telefone.length === 11;
    }
 if (botao) {

    botao.addEventListener("click", function(){
    
    if (
        campos[0].value === "" ||
        campos[1].value === "" ||
        campos[2].value === "" ||
        campos[3].value === "" ||
        campos[4].value === "" ||
        campos[5].value === "" 

    ) {
        alert("Por favor, preencha todos os campos!");
    } else if (!validarCPF(cpf.value)) {
        alert("CPF inválido. Digite um CPF válido.");
    } else if (!validarEmail(email.value)) {
        alert("E-mail inválido. Digite um e-mail válido.");
    } else if(!validarTelefone(telefone.value)) {
        alert("Telefone inválido. Digite DDD + número.");
    } else if (senha.value.length <6) {
        alert("A senha deve ter no minimo 6 caracteres.");
    } else if(senha.value !== confirmarSenha.value) {
        alert("As senhas não coincidem.");

    } else {
    const dadosCliente = {
        nome: nome.value,
        cpf: cpf.value.replace(/\D/g, ""),
        email: email.value,
        telefone: telefone.value.replace(/\D/g, ""),
        senha: senha.value
    };

    fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosCliente)
    })
    .then(resposta => resposta.json())
    .then(dados => {
        if (dados.erro) {
            alert(dados.erro);
            return;
        }

        localStorage.setItem("clienteId", dados.clienteId);

        alert("Cliente cadastrado com sucesso!");
        window.location.href = "index.html";
    })
    .catch(erro => {
        console.error(erro);
        alert("Não foi possível conectar ao servidor.");
    });
    }
    });
}