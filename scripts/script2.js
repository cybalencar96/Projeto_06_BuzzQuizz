let quizz = [];
let questions = [];
let correctAnswers = [];

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
    verifyAnswer(options);
}

function verifyAnswer(options) {
    options.forEach(element => {
        if (correctAnswers[element.id]){
            element.classList.add("correct");
        }else{
            element.classList.add("wrong");
        }
    });
}