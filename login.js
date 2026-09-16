const btnLogin = document.getElementById("btnLogin");
const loginCpf = document.getElementById("loginCpf");
const loginSenha = document.getElementById("loginSenha");

btnLogin.addEventListener("click", function () {

    const cpf = loginCpf.value.replace(/\D/g, "");
    const senha = loginSenha.value;

    if (cpf === "" || senha === "") {
        alert("Preencha o CPF e a senha.");
        return;
    }

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cpf: cpf,
            senha: senha
        })
    })
    .then(resposta => resposta.json())
    .then(dados => {

        if (dados.erro) {
            alert(dados.erro);
            return;
        }

        console.log("DADOS DO LOGIN:", dados);
        console.log("CLIENTE ID RECEBIDO:", dados.cliente.id);
        localStorage.setItem("clienteId", dados.cliente.id);

        alert("Login realizado com sucesso!");

        window.location.href = "receita.html";
    })
    .catch(erro => {
        console.error(erro);
        alert("Não foi possível conectar ao servidor.");
    });

});