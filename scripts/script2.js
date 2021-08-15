let quizz = [];
let questions = [];
let correctAnswers = [];
let qtyCorrectChoices = 0

// Se adicionar mais variaveis globais lembre de zerar elas nessa função
function resetQuizzGame(id){
    const quizzGame = document.querySelector(".quizz-game");
    quizzGame.innerHTML = `<div class="banner">
    </div>
    <main class="questions">
        <section class="question">
            <div class="alternatives">
            </div>
        </section>
    </main>
    <section class="results">
    </section>
    <button class="reload-quizz" onclick="changePage(1, ${id})">Reiniciar Quizz</button>
    <button class="back-home" onclick="changePage(0)">Voltar para Home</button>
    `
    quizz = [];
    questions = [];
    correctAnswers = [];
    qtyCorrectChoices = 0;
    getQuizz(id)
}

function getQuizz(id) {
    const promise = axios.get(URL_API + `/${id}`);
    promise.then(listQuizz);
    promise.catch(alertError);
}

function listQuizz(response) {
    quizz = response.data;
    questions = quizz.questions;
    renderBanner();
    renderQuestions();
}

function alertError() {
    alert("Houve um erro ao carregar este quizz");
}

function renderBanner() {
    let banner = document.querySelector(".banner");
    banner.innerHTML = "";

    banner.style.backgroundImage = `
    linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${quizz.image})
    `;
    banner.innerHTML += ` <h2 class="quizz-name">${quizz.title}</h2>`
}

function renderQuestions() {
    let questionsQuizz = document.querySelector(".questions");
    questionsQuizz.innerHTML = ""

    let alternative = [];
    let stringAlternatives = ""
    let altId = 0;
    for (let i = 0; i < questions.length; i++) {
        alternative = [];
        for (let x = 0; x < questions[i].answers.length; x++) {
            alternative.push(x)
        }
        alternative = alternative.sort(shuffleAlternatives);
        stringAlternatives = "";
        for (let j = 0; j < alternative.length; j++, altId++) {
            stringAlternatives += `<div class="alternative clickable" onclick="selectAnswer(this)" id="${altId}">
                <img class="alternative-image" src="${questions[i].answers[alternative[j]].image}">
                <span class="alternative-name">${questions[i].answers[alternative[j]].text}</span>
            </div>
            `
            correctAnswers.push(questions[i].answers[alternative[j]].isCorrectAnswer);
        }
        questionsQuizz.innerHTML += `
        <section class="question">
            <h3 class="question-text">${questions[i].title}</h3>
            <div class="alternatives">
                ${stringAlternatives}
            </div>
        </section>
        `     
    }

    let titles = document.querySelectorAll(".question-text");

    for (i = 0; i < titles.length; i++) {
        titles[i].style.backgroundColor = `${questions[i].color}`
    }
}

function shuffleAlternatives() { 
	return Math.random() - 0.5; 
}

function selectAnswer(choice) {
    let alternativesByQuestion = choice.parentNode;
    let options = alternativesByQuestion.querySelectorAll(".alternative");

    if (alternativesByQuestion.classList.contains("answered")) {
        return;
    }
    for (let i = 0; i < options.length; i++) {
        options[i].classList.add("unchosen");
        alternativesByQuestion.classList.add("answered")
    }
    choice.classList.remove("unchosen");
    verifyAnswer(options, choice);
    setTimeout(newAutoScroll, 2000, choice);
}

function verifyAnswer(options, choice) {
    options.forEach(option => {
        if (correctAnswers[option.id]){
            option.classList.add("correct");
            if (option.id === choice.id){
                qtyCorrectChoices++;
            }
        }else{
            option.classList.add("wrong");
        }
    });
}

function calcScore() {
    return ((qtyCorrectChoices / questions.length) * 100).toFixed(0);
}

// Essa versão tem um bug tenso, como o usuario pode descer a pagina a vontade
// se ele responder a ultima questão ja é renderizado a resposta.
// Pra concertar isso teria que ou limitar o usuario a responder as questões em ordem,
// ou sempre que ele respondesse uma questão verificariamos se todas ja foram respondidas,
// a newAutoScroll junta tudo em uma coisa só menor e melhor.
function autoScroll(choice) {
    let DOMQuestions = document.querySelectorAll(".question");
    let question = choice.parentNode.parentNode;
    let nextQuestionIndex = 0;

    for (i = 0; i < DOMQuestions.length; i++) {
        if (DOMQuestions[i] === question) {
            if (i === DOMQuestions.length - 1) {
                renderResult();
                document.querySelector(".results").scrollIntoView({block:"center", behavior:"smooth"});
            } else {
                nextQuestionIndex = i + 1;
                DOMQuestions[nextQuestionIndex].scrollIntoView({block:"center", behavior:"smooth"});
            }
            return;
        }
    }
}

// Com essa função surge um problema menor, mas ainda existente:
// - Ela sempre pega a questão não respondida mais acima
// Da pra fazer uma solução pra esse problema com variavel global
function newAutoScroll(choice) {
    let DOMQuestions = document.querySelectorAll(".question");
    let question = choice.parentNode.parentNode;
    for (let i = 0; i < DOMQuestions.length; i++) {
        if (!DOMQuestions[i].lastElementChild.classList.contains("answered")) {
            DOMQuestions[i].scrollIntoView({block:"center", behavior:"smooth"});
            return;
        }
    }
    renderResult();
    document.querySelector(".results").scrollIntoView({block:"center", behavior:"smooth"});
}

function renderResult() {
    const results = document.querySelector(".results");
    const score = calcScore();
    const level = selectLevel(score);
    results.innerHTML = `<h3 class="results-title">${score}% de acerto: ${level.title}</h3>
    <img class="results-image" src="${level.image}">
    <p class="results-text">${level.text}</p>
    `
}

function selectLevel(score) {
    let currentMin = 0;
    let currentIndex = 0;
    quizz.levels.forEach((level, index) => {
        if (level.minValue <= score && level.minValue >= currentMin){
            currentMin = level.minValue;
            currentIndex = index;
        }
    });
    return quizz.levels[currentIndex];
}
