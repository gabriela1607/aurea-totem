import { resultadosMap } from "./array-resultados.js"

// Recupera a chave do localStorage
const chave = localStorage.getItem("resultadoFinal");
console.log(chave)

// Seleciona os botões que serão preenchidos com imagens
const botoes = document.querySelectorAll(".roupas button");

// Preenche os botões com imagens ou mostra mensagem de erro
if (resultadosMap[chave]) {
    const imagens = resultadosMap[chave];

    botoes.forEach((botao, index) => {
        if (imagens[index]) {
            botao.style.backgroundImage = `url('${imagens[index]}')`;
            botao.style.backgroundSize = "cover";
            botao.style.backgroundPosition = "center";
        } else {
            botao.innerText = "Imagem não encontrada";
        }
    });
} else {
    botoes.forEach(botao => {
        botao.innerText = "Resultado não encontrado";
    });
}
