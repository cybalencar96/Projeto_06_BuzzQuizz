let quizz = [];
let questions = [];

function getQuizz(id) {
    const promise = axios.get(URL_API + `/${id}`);
    promise.then(listQuizz);
}

function listQuizz(response) {
    quizz = response.data;
    questions = quizz.questions;
    renderBanner();
    renderQuestions();
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
    for (let i = 0; i < questions.length; i++) {
        alternative = [];
        for (let x = 0; x < questions[i].answers.length; x++) {
            alternative.push(x)
        }
        alternative = alternative.sort(shuffleAlternatives);
        stringAlternatives = "";
        for (let j = 0; j < alternative.length; j++) {
            stringAlternatives += `<div class="alternative">
                <img class="alternative-image" src="${questions[i].answers[alternative[j]].image}">
                <span class="alternative-name">${questions[i].answers[alternative[j]].text}</span>
            </div>
            `
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