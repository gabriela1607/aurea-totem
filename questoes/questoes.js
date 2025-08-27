const perguntas = [
    {
        question: "QUAL É A OCASIÃO PARA O LOOK?",
        options: [
            { text: "FESTA" },
            { text: "CASUAL" },
            { text: "TRABALHO" },
            { text: "OUTRO" }
        ]
    },
    {
        question: "QUAIS CORES VOCÊ MAIS GOSTA DE USAR?",
        options: [
            { text: "NEUTRAS" },
            { text: "VIBRANTES" },
            { text: "PASTEIS" },
            { text: "ESCURAS" }
        ]
    },
    {
        question: "QUAL ESTILO MAIS COMBINA COM VOCÊ?",
        options: [
            { text: "CLASSICO" },
            { text: "MODERNO" },
            { text: "ESPORTIVO" },
            { text: "ROMANTICO" }
        ]
    }
];

const answerButtons = document.getElementById("answer-buttons");
const questionElement = document.getElementById("question");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let respostasSelecionadas = []; // Aqui vamos armazenar as respostas do usuário

function startQuiz() {
    currentQuestionIndex = 0;
    respostasSelecionadas = [];
    nextButton.innerHTML = "PRÓXIMO";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = perguntas[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.innerHTML = option.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        button.addEventListener("click", () => selectAnswer(option.text));
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(resposta) {
    respostasSelecionadas[currentQuestionIndex] = resposta; // Salva a resposta da pergunta atual
    nextButton.style.display = "block";
}

function showResult() {
    // Cria a chave baseada nas 3 respostas
    const chave = respostasSelecionadas.join("-");
    
    // Armazena no localStorage para usar na página de resultado
    localStorage.setItem("resultadoFinal", chave);
    
    // Redireciona para a página de resultado
    window.location.href = "../resultado/resul.html";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < perguntas.length) {
        showQuestion();
    } else {
        showResult();
    }
}

nextButton.addEventListener("click", () => {
    if (nextButton.style.display === "block") {
        handleNextButton();
    } else {
        alert("Por favor, selecione uma resposta antes de continuar.");
    }
});

startQuiz();
