const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";

// Home - Kevin part
requestQuizzes()
function requestQuizzes() {
    const promise = axios.get(URL_API)
    promise.then(renderQuizzes);
    promise.catch(console.log)
}

function renderQuizzes(response) {
    const quizzes = response.data;
    const allQuizzBox = document.querySelector(".all-quizzes .quizz-box");
    allQuizzBox.innerHTML = ""
    for (let i = 0; i < quizzes.length; i++) {
        allQuizzBox.innerHTML += `<div class="quizz" onclick="changePage(1, ${quizzes[i].id})">
            <img src="${quizzes[i].image}">
            <div class="black-gradient"></div>
            <p>${quizzes[i].title}</p>
        </div>`;
    }
}

function changePage(pageId, information){
    const pages = document.querySelectorAll("article");
    switch (pageId) {
        case 0:
            pages[2].classList.add("hidden");
            pages[1].classList.add("hidden");
            pages[0].classList.remove("hidden");
            requestQuizzes();
            break;
        case 1:
            pages[2].classList.add("hidden");
            pages[0].classList.add("hidden");
            pages[1].classList.remove("hidden");
            getQuizz(information);
            break;
        case 2:
            pages[0].classList.add("hidden");
            pages[1].classList.add("hidden");
            pages[2].classList.remove("hidden");
            break;
    
        default:
            break;
    }
}

// Forms scripts - Carlos part 

const formData = {
    basicInfoForm: {
        title:"",
        quizzImage:"",
        qtyQuestions:0,
        qtyLevels:0
    },

    questionsForm: [],
    levelsForm: []
}

function basicInfoForm() {
    const firstForm = document.querySelector('.basic-info-form');

    firstForm.classList.remove('hidden');
    const title = firstForm.querySelector('#title');
    const quizzImage = firstForm.querySelector('#url-quizz-image');
    const qtyQuestions = firstForm.querySelector('#qty-questions');
    const qtyLevels = firstForm.querySelector('#qty-levels');

    title.addEventListener('keyup', validateTitle);
    quizzImage.addEventListener('keyup', validateQuizzImage);
    qtyQuestions.addEventListener('keyup', validateQtyQuestions);
    qtyLevels.addEventListener('keyup', validateQtyLevels);
    
    const buttonNextForm = firstForm.querySelector('button');

    const verifyErrors = function(e) {
        e.preventDefault();
        const errors = firstForm.querySelectorAll('h5');

        if (title.value === "" || quizzImage.value === "" || qtyQuestions.value === "" || qtyLevels.value === "") {
            alert('Preencha todos os campo');
            return;
        }

        for (let i = 0; i < errors.length; i++){
            if (!errors[i].classList.contains('hidden')) {
                alert('Preencha os campos corretamente');
                return;
            }
        }

        formData.basicInfoForm.title = title.value;
        formData.basicInfoForm.quizzImage = quizzImage.value;
        formData.basicInfoForm.qtyQuestions = Number(qtyQuestions.value);
        formData.basicInfoForm.qtyLevels = Number(qtyLevels.value);
        buttonNextForm.removeEventListener('click', verifyErrors);
        firstForm.classList.add('hidden');
        loadQuestionsSection();
    }

    buttonNextForm.addEventListener('click', verifyErrors);

    
}


function loadQuestionsSection() {
    const questionsSection = document.querySelector('.questions-form');
    questionsSection.classList.remove('hidden');

    const qtyQuestions = formData.basicInfoForm.qtyQuestions;
    const questionsContainer = questionsSection.querySelector('.subforms-container');
    questionsContainer.innerHTML = "";

    for (let i = 0; i < qtyQuestions; i++) {
        let questionFormModel = 
        `<form action="" id="question-${i+1}">
            <div class="top-question-bar" onclick="toggleQuestion(this.parentNode,${i})">
                <h3>Pergunta ${i+1}</h3>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class="question-content">
                <input required type="text" id="question-text" placeholder="Texto da pergunta">
                    <h5 class="question-text-error hidden">Título precisa possuir no mínimo 20 caracteres</h5>
                <input required type="text" id="background-color-text" placeholder="Cor de fundo da pergunta">
                    <h5 class="background-text-error hidden">Insira no formato hexadecimal. Ex: #123ABC</h5>

                <h3 class="right">Resposta correta</h3>
                <input required type="text" id="right-answer" placeholder="Resposta correta">
                    <h5 class="right-answer-error hidden">Campo obrigatório. Preencha a resposta correta</h5>
                <input required type="text" id="url-image-right" placeholder="URL da imagem">
                    <h5 class="image-right-error hidden">Formato URL inválido</h5>
                
                <h3 class="wrong">Respostas incorretas</h3>
                <input required type="text" id="wrong-answer-1" placeholder="Resposta incorreta 1">
                    <h5 class="wrong-answer1-error hidden">Campo obrigatório. Preencha 1 resposta incorreta</h5>
                <input required type="text" id="wrong-url-1" placeholder="URL da imagem 1">
                    <h5 class="wrong-url1-error hidden">Formato URL inválido</h5>


                <input type="text" id="wrong-answer-2" placeholder="Resposta incorreta 2">
                    <h5 class="wrong-answer2-error hidden">Campo não pode permanecer vazio</h5>
                <input type="text" id="wrong-url-2" placeholder="URL da imagem 2">
                    <h5 class="wrong-url2-error hidden">Formato URL inválido</h5>


                <input type="text" id="wrong-answer-3" placeholder="Resposta incorreta 3">
                    <h5 class="wrong-answer3-error hidden">Campo não pode permanecer vazio</h5>
                <input type="text" id="wrong-url-3" placeholder="URL da imagem 3">
                    <h5 class="wrong-url2-error hidden">Formato URL inválido</h5>

                
            </div>
            
        </form>`;
        questionsContainer.innerHTML += questionFormModel;
    }

    currentQuestion = document.querySelector(`#question-1`);
    listenQuestion();

}

function listenQuestion() {
    currentQuestion.classList.add('show');

    const questionText = currentQuestion.querySelector('#question-text');
    const backgroundColorText = currentQuestion.querySelector('#background-color-text');

    const rightAnswer = currentQuestion.querySelector('#right-answer');
    const urlImageRight = currentQuestion.querySelector('#url-image-right');

    const wrongAnswer1 = currentQuestion.querySelector('#wrong-answer-1');
    const wrongUrl1 = currentQuestion.querySelector('#wrong-url-1');

    const wrongAnswer2 = currentQuestion.querySelector('#wrong-answer-2');
    const wrongUrl2 = currentQuestion.querySelector('#wrong-url-2');

    const wrongAnswer3 = currentQuestion.querySelector('#wrong-answer-3');
    const wrongUrl3 = currentQuestion.querySelector('#wrong-url-3');

    questionText.addEventListener('keyup', validateQuestionText);
    backgroundColorText.addEventListener('keyup', validateBackgroudColorText);
    
    rightAnswer.addEventListener('keyup', validateRightAnswer);
    urlImageRight.addEventListener('keyup',validateRightUrlImage);

    wrongAnswer1.addEventListener('keyup',validateWrongAnswer1);
    wrongUrl1.addEventListener('keyup', validateWrongUrl1);

    wrongAnswer2.addEventListener('keyup',validateWrongAnswer2);
    wrongUrl2.addEventListener('keyup', validateWrongUrl2);

    wrongAnswer3.addEventListener('keyup',validateWrongAnswer3);
    wrongUrl3.addEventListener('keyup', validateWrongUrl3);

}

//form de qual pergunta está sendo preenchida
let currentQuestion;
function toggleQuestion(newSectionForm) {
    // antes de mostrar novo form, validar e salvar infos do ultimo preenchido
    if (!hasQuestionErrors()) {
        console.log('salva questão')
        saveQuestion();
    } 
    else {
        alert('Preencha todos os campos obrigatórios corretamente');
        return;
    }

    currentQuestion.classList.add('hidden')
    currentQuestion = newSectionForm;
    currentQuestion.classList.remove('hidden');
}

function hasQuestionErrors() {
    const errorMessages = currentQuestion.querySelectorAll('h5');

    for (let i = 0; i < errorMessages.length; i++) {
        const hasError = !errorMessages[i].classList.contains('hidden');
        if (hasError) {
            alert('Corrija os erros antes de prosseguir');
            return true;
        }
    }
    return false;
}

const validateTitle = function(e) {
    e.preventDefault();

    const firstForm = document.querySelector('.basic-info-form');
    const title = firstForm.querySelector('#title');
    const titleError = firstForm.querySelector(".title-error");

    if (title.value.length < 20 || title.value.length > 65) {
        if (title.value === "") {
            title.style.border = "1px solid #D1D1D1";
            titleError.classList.add("hidden");
            return;
        }
        title.style.border = "2px solid crimson";
        titleError.classList.remove("hidden");
    }
    else {            
        title.style.border = "2px solid green";
        titleError.classList.add("hidden");
    }
}

const validateQuizzImage = function(e) {
    e.preventDefault();

    const firstForm = document.querySelector('.basic-info-form');
    const quizzImage = firstForm.querySelector('#url-quizz-image');
    const quizzImageError = firstForm.querySelector(".url-error");
    

    if (quizzImage.value.length < 5 || quizzImage.value.substring(0,8) !== "https://") {
        if (quizzImage.value === "") {
            quizzImage.style.border = "1px solid #D1D1D1";
            quizzImageError.classList.add("hidden");
            return;
        }
        quizzImage.style.border = "2px solid crimson";
        quizzImageError.classList.remove("hidden");
    }
    else {            
        quizzImage.style.border = "2px solid green";
        quizzImageError.classList.add("hidden");
    }
}

const validateQtyQuestions = function(e) {
    e.preventDefault();

    const firstForm = document.querySelector('.basic-info-form');
    const qtyQuestions = firstForm.querySelector('#qty-questions');
    const qtyQuestionsError = firstForm.querySelector(".qty-questions-error");

    if (!Number(qtyQuestions.value) || Number(qtyQuestions.value) < 3 || !Number.isInteger(Number(qtyQuestions.value)) ) {
        if (qtyQuestions.value === "") {
            qtyQuestions.style.border = "1px solid #D1D1D1";
            qtyQuestionsError.classList.add("hidden");
            return;
        }
        qtyQuestions.style.border = "2px solid crimson";
        qtyQuestionsError.classList.remove("hidden");
    }
    else {            
        qtyQuestions.style.border = "2px solid green";
        qtyQuestionsError.classList.add("hidden");
    }
}

const validateQtyLevels = function(e) {
    e.preventDefault();

    const firstForm = document.querySelector('.basic-info-form');
    const qtyLevels = firstForm.querySelector('#qty-levels');
    const qtyLevelsError = firstForm.querySelector(".qty-levels-error");

    if (!Number(qtyLevels.value) || Number(qtyLevels.value) < 2 || !Number.isInteger(Number(qtyLevels.value)) ) {
        if (qtyLevels.value === "") {
            qtyLevels.style.border = "1px solid #D1D1D1";
            qtyLevelsError.classList.add("hidden");
            return;
        }
        qtyLevels.style.border = "2px solid crimson";
        qtyLevelsError.classList.remove("hidden");
    }
    else {            
        qtyLevels.style.border = "2px solid green";
        qtyLevelsError.classList.add("hidden");
    }
}

const validateQuestionText = function(e){
    e.preventDefault();

    const questionText = currentQuestion.querySelector('#question-text');
    const questionTextError = currentQuestion.querySelector('.question-text-error');

    if (questionText.value.length < 20) {
            if (questionText.value === "") {
                questionText.style.border = "1px solid #D1D1D1";
                questionTextError.classList.add("hidden");
                return;
            }
            questionText.style.border = "2px solid crimson";
            questionTextError.classList.remove("hidden");
    }
    else {            
            questionText.style.border = "2px solid green";
            questionTextError.classList.add("hidden");
    }
}

const validateBackgroudColorText = function(e) {
    e.preventDefault();


    const backgroundColorText = currentQuestion.querySelector('#background-color-text');
    const backgroundColorTextError = currentQuestion.querySelector('.background-text-error');
    const inputValue = backgroundColorText.value;
    const hexa = "#123456789ABCDEF";

    let invalidHexa = false;

     for (let i = 0; i < inputValue.length; i++) {
         if (hexa.indexOf(inputValue[i]) === -1) {
             invalidHexa = true;
         }
     }
    if (inputValue === "" || inputValue[0] !== "#" || inputValue.length !== 7 || invalidHexa ) {
            if (inputValue === "") {
                backgroundColorText.style.border = "1px solid #D1D1D1";
                backgroundColorTextError.classList.add("hidden");
                return;
            }
            backgroundColorText.style.border = "2px solid crimson";
            backgroundColorTextError.classList.remove("hidden");
    }
    else {            
            backgroundColorText.style.border = "2px solid green";
            backgroundColorTextError.classList.add("hidden");
    }
}

const validateRightAnswer = function(e){
    e.preventDefault();

    const rightAnswer = currentQuestion.querySelector('#right-answer');
    const rightAnswerError = currentQuestion.querySelector('.right-answer-error');
    const inputValue = rightAnswer.value 

    if (inputValue === "") {
            if (inputValue === "") {
                rightAnswer.style.border = "1px solid #D1D1D1";
                rightAnswerError.classList.add("hidden");
                return;
            }
            rightAnswer.style.border = "2px solid crimson";
            rightAnswerError.classList.remove("hidden");
    }
    else {            
            rightAnswer.style.border = "2px solid green";
            rightAnswerError.classList.add("hidden");
    }

}

const validateRightUrlImage = function(e) {
    e.preventDefault();

    const urlImageRight = currentQuestion.querySelector('#url-image-right');
    const urlImageRightError = currentQuestion.querySelector('.image-right-error');
    const inputValue = urlImageRight.value 

    if (inputValue.length < 5 || inputValue.substring(0,8) !== "https://") {
            if (inputValue === "") {
                urlImageRight.style.border = "1px solid #D1D1D1";
                urlImageRightError.classList.add("hidden");
                return;
            }
            urlImageRight.style.border = "2px solid crimson";
            urlImageRightError.classList.remove("hidden");
    }
    else {            
            urlImageRight.style.border = "2px solid green";
            urlImageRightError.classList.add("hidden");
    }
}

const validateWrongAnswer1 = function(e) {
    e.preventDefault();

    const wrongAnswer1 = currentQuestion.querySelector('#wrong-answer-1');
    const wrongAnswer1Error = currentQuestion.querySelector('.wrong-answer1-error');
    const inputValue = wrongAnswer1.value 

    if (inputValue === "") {
            if (inputValue === "") {
                wrongAnswer1.style.border = "1px solid #D1D1D1";
                wrongAnswer1Error.classList.add("hidden");
                return;
            }
            wrongAnswer1.style.border = "2px solid crimson";
            wrongAnswer1Error.classList.remove("hidden");
    }
    else {            
            wrongAnswer1.style.border = "2px solid green";
            wrongAnswer1Error.classList.add("hidden");
    }
}

const validateWrongAnswer2 = function(e) {
    e.preventDefault();

    const wrongAnswer2 = currentQuestion.querySelector('#wrong-answer-2');
    const wrongAnswer2Error = currentQuestion.querySelector('.wrong-answer2-error');
    const inputValue = wrongAnswer2.value 

    if (inputValue === "") {
            if (inputValue === "") {
                wrongAnswer2.style.border = "1px solid #D1D1D1";
                wrongAnswer2Error.classList.add("hidden");
                return;
            }
            wrongAnswer2.style.border = "2px solid crimson";
            wrongAnswer2Error.classList.remove("hidden");
    }
    else {            
            wrongAnswer2.style.border = "2px solid green";
            wrongAnswer2Error.classList.add("hidden");
    }
}

const validateWrongAnswer3 = function(e) {
    e.preventDefault();

    const wrongAnswer3 = currentQuestion.querySelector('#wrong-answer-3');
    const wrongAnswer3Error = currentQuestion.querySelector('.wrong-answer3-error');
    const inputValue = wrongAnswer3.value 

    if (inputValue === "") {
            if (inputValue === "") {
                wrongAnswer3.style.border = "1px solid #D1D1D1";
                wrongAnswer3Error.classList.add("hidden");
                return;
            }
            wrongAnswer3.style.border = "2px solid crimson";
            wrongAnswer3Error.classList.remove("hidden");
    }
    else {            
            wrongAnswer3.style.border = "2px solid green";
            wrongAnswer3Error.classList.add("hidden");
    }
}

const validateWrongUrl1 = function(e){
    e.preventDefault();

    const wrongUrl1 = currentQuestion.querySelector('#wrong-url-1');
    const wrongUrl1Error = currentQuestion.querySelector('.wrong-url1-error');
    const inputValue = wrongUrl1.value 

    if (inputValue.length < 5 || inputValue.substring(0,8) !== "https://") {
            if (inputValue === "") {
                wrongUrl1.style.border = "1px solid #D1D1D1";
                wrongUrl1Error.classList.add("hidden");
                return;
            }
            wrongUrl1.style.border = "2px solid crimson";
            wrongUrl1Error.classList.remove("hidden");
    }
    else {            
            wrongUrl1.style.border = "2px solid green";
            wrongUrl1Error.classList.add("hidden");
    }
}

const validateWrongUrl2 = function(e){
    e.preventDefault();

    const wrongUrl2 = currentQuestion.querySelector('#wrong-url-2');
    const wrongUrl2Error = currentQuestion.querySelector('.wrong-url2-error');
    const inputValue = wrongUrl2.value 

    if (inputValue.length < 5 || inputValue.substring(0,8) !== "https://") {
            if (inputValue === "") {
                wrongUrl2.style.border = "1px solid #D1D1D1";
                wrongUrl2Error.classList.add("hidden");
                return;
            }
            wrongUrl2.style.border = "2px solid crimson";
            wrongUrl2Error.classList.remove("hidden");
    }
    else {            
            wrongUrl2.style.border = "2px solid green";
            wrongUrl2Error.classList.add("hidden");
    }
}

const validateWrongUrl3 = function(e){
    e.preventDefault();

    const wrongUrl3 = currentQuestion.querySelector('#wrong-url-3');
    const wrongUrl3Error = currentQuestion.querySelector('.wrong-url3-error');
    const inputValue = wrongUrl3.value 

    if (inputValue.length < 5 || inputValue.substring(0,8) !== "https://") {
            if (inputValue === "") {
                wrongUrl3.style.border = "1px solid #D1D1D1";
                wrongUrl3Error.classList.add("hidden");
                return;
            }
            wrongUrl3.style.border = "2px solid crimson";
            wrongUrl3Error.classList.remove("hidden");
    }
    else {            
            wrongUrl3.style.border = "2px solid green";
            wrongUrl3Error.classList.add("hidden");
    }
}

basicInfoForm();

