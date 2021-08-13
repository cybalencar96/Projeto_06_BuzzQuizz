let quizz = [];
let questions = [];

function getQuizz() {
    const promise = axios.get(URL_API + "/1");
    promise.then(listQuizz);
}

function listQuizz(response) {
    quizz = response.data;
    questions = quizz.questions;
    renderBanner();
    renderQuestions();
}

getQuizz();

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

    for (i = 0; i < questions.length; i++) {
        if (questions[i].answers.length === 2) {
            let alternative = [0, 1];
            alternative = alternative.sort(shuffleAlternatives);

            questionsQuizz.innerHTML += `
            <section class="question">
                <h3 class="question-text">${questions[i].title}</h3>
                <div class="alternatives">
                    <div class="alternative">
                        <img class="alternative-image" src="${questions[i].answers[alternative[0]].image}">
                        <span class="alternative-name">${questions[i].answers[alternative[0]].text}</span>
                     </div>
                    <div class="alternative">
                        <img class="alternative-image" src="${questions[i].answers[alternative[1]].image}">
                        <span class="alternative-name">${questions[i].answers[alternative[1]].text}</span>
                     </div>
                </div>
            </section>
            `
        }
        if (questions[i].answers.length === 3) {
            let alternative = [0, 1, 2];
            alternative = alternative.sort(shuffleAlternatives);

            questionsQuizz.innerHTML += `
            <section class="question">
                <h3 class="question-text">${questions[i].title}</h3>
                <div class="alternatives">
                    <div class="alternative">
                        <img class="alternative-image" src="${questions[i].answers[alternative[0]].image}">
                        <span class="alternative-name">${questions[i].answers[alternative[0]].text}</span>
                     </div>
                    <div class="alternative">
                        <img class="alternative-image" src="${questions[i].answers[alternative[1]].image}">
                        <span class="alternative-name">${questions[i].answers[alternative[1]].text}</span>
                     </div>
                    <div class="alternative">
                        <img class="alternative-image" src="${questions[i].answers[alternative[2]].image}">
                        <span class="alternative-name">${questions[i].answers[alternative[2]].text}</span>
                     </div>
                </div>
            </section>
            `
        }
        if (questions[i].answers.length === 4) {
            let alternative = [0, 1, 2, 3];
            alternative = alternative.sort(shuffleAlternatives);

            questionsQuizz.innerHTML += `
            <section class="question">
                <h3 class="question-text">${questions[i].title}</h3>
                <div class="alternatives">
                    <div class="alternative">
                        <img class="alternative-image" src="${questions[i].answers[alternative[0]].image}">
                        <span class="alternative-name">${questions[i].answers[alternative[0]].text}</span>
                     </div>
                    <div class="alternative">
                        <img class="alternative-image" src="${questions[i].answers[alternative[1]].image}">
                        <span class="alternative-name">${questions[i].answers[alternative[1]].text}</span>
                     </div>
                    <div class="alternative">
                        <img class="alternative-image" src="${questions[i].answers[alternative[2]].image}">
                        <span class="alternative-name">${questions[i].answers[alternative[2]].text}</span>
                     </div>
                    <div class="alternative">
                        <img class="alternative-image" src="${questions[i].answers[alternative[3]].image}">
                        <span class="alternative-name">${questions[i].answers[alternative[3]].text}</span>
                     </div>
                </div>
            </section>
            `
        }
    }

    let titles = document.querySelectorAll(".question-text");

    for (i = 0; i < titles.length; i++) {
        titles[i].style.backgroundColor = `${questions[i].color}`
    }
}

function shuffleAlternatives() { 
	return Math.random() - 0.5; 
}