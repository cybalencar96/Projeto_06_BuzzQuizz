const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";

// Home - Kevin part
requestQuizzes()
function requestQuizzes() {
    const promise = axios.get(URL_API)
    promise.then(renderHome);
    promise.catch(console.log)
}

function renderHome(response) {
    const quizzes = response.data;
    const userQuizzIds = renderUserQuizzes();
    const allQuizzBox = document.querySelector(".all-quizzes .quizz-box");
    allQuizzBox.innerHTML = ""
    quizzes.forEach(quizz => {
        if (!userQuizzIds.includes(quizz.id)){
            allQuizzBox.innerHTML += `<div class="quizz clickable" onclick="changePage(1, ${quizz.id})">
                <img src="${quizz.image}">
                <div class="black-gradient"></div>
                <p>${quizz.title}</p>
            </div>`;
        }});
}

function renderUserQuizzes () {
    const userQuizzIds = getUserQuizzes();
    const userQuizzes = document.querySelector(".user-quizzes");
    userQuizzes.innerHTML = `<div class="empty">
        <p>
            Você não criou nenhum <br>
            quizz ainda :(
        </p>
        <button onclick="changePage(2)">
            <span>Criar Quizz</span>
        </button>
    </div>`;
    if (userQuizzIds.length > 0) {
        userQuizzes.innerHTML = `<div class="section-title">
            <strong>Seus Quizzes</strong>
            <ion-icon name="add-circle" class="clickable" onclick="changePage(2)"></ion-icon>
        </div>
        <div class="quizz-box">
        </div>`
        const userQuizzBox = document.querySelector(".user-quizzes .quizz-box")
        userQuizzIds.forEach(quizzId => {
            let quizz;
            const promise = axios.get(URL_API + `/${quizzId}`);
            promise.then(response => {quizz = response.data
                userQuizzBox.innerHTML += `<div class="quizz clickable" onclick="changePage(1, ${quizzId})">
                <img src="${quizz.image}">
                <div class="black-gradient"></div>
                <p>${quizz.title}</p>
            </div>`
            });
        });
    }
    return userQuizzIds;
}

function getUserQuizzes() {
    let userQuizzIds = localStorage.getItem("userQuizzIds");
    if (!userQuizzIds) {
        localStorage.setItem("userQuizzIds", "[]");
        return getUserQuizzes();
    }
    userQuizzIds = JSON.parse(userQuizzIds);
    return userQuizzIds;
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
            pages[0].classList.add("hidden");
            pages[1].classList.add("hidden");
            pages[2].classList.add("hidden");
            break;
    }
}

// Forms scripts - Carlos part 
let qtyQuestionsValue;
let qtyLevelsValue;

const formData = {
    title:"",
    image:"",
    questions: [],
    levels: []
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

        formData.title = title.value;
        formData.image = quizzImage.value;
        qtyQuestionsValue = Number(qtyQuestions.value);
        qtyLevelsValue = Number(qtyLevels.value);
        buttonNextForm.removeEventListener('click', verifyErrors);
        firstForm.classList.add('hidden');
        loadQuestionsSection();
    }

    buttonNextForm.addEventListener('click', verifyErrors);

    
}


function loadQuestionsSection() {
    const questionsSection = document.querySelector('.questions-form');
    questionsSection.classList.remove('hidden');

    const questionsContainer = questionsSection.querySelector('.subforms-container');
    questionsContainer.innerHTML = "";

    for (let i = 0; i < qtyQuestionsValue; i++) {
        let questionFormModel = 
        `<form action="" id="question-${i+1}">
            <div class="top-question-bar" onclick="toggleQuestion(this.parentNode,${i+1})">
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
                    <h5 class="wrong-url3-error hidden">Formato URL inválido</h5>

                
            </div>
            
        </form>`;
        questionsContainer.innerHTML += questionFormModel;
    }

    currentQuestion = document.querySelector(`#question-1`);
    listenQuestion();

}

function listenQuestion() {
    currentQuestion.classList.add('show');

    questionText = currentQuestion.querySelector('#question-text');
    backgroundColorText = currentQuestion.querySelector('#background-color-text');

    rightAnswer = currentQuestion.querySelector('#right-answer');
    urlImageRight = currentQuestion.querySelector('#url-image-right');

    wrongAnswer1 = currentQuestion.querySelector('#wrong-answer-1');
    wrongUrl1 = currentQuestion.querySelector('#wrong-url-1');

    wrongAnswer2 = currentQuestion.querySelector('#wrong-answer-2');
    wrongUrl2 = currentQuestion.querySelector('#wrong-url-2');

    wrongAnswer3 = currentQuestion.querySelector('#wrong-answer-3');
    wrongUrl3 = currentQuestion.querySelector('#wrong-url-3');

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
let questionText;
let backgroundColorText;

let rightAnswer;
let urlImageRight;

let wrongAnswer1;
let wrongUrl1;

let wrongAnswer2;
let wrongUrl2;

let wrongAnswer3;
let wrongUrl3;

let questionId = 1;
function toggleQuestion(newSectionForm, questionIdentifier) {
    // antes de mostrar novo form, validar e salvar infos do ultimo preenchido
    if (!hasQuestionErrors()) {
        console.log('salva questão')
        saveQuestion();
        questionText.removeEventListener('keyup', validateQuestionText);
        backgroundColorText.removeEventListener('keyup', validateBackgroudColorText);
        
        rightAnswer.removeEventListener('keyup', validateRightAnswer);
        urlImageRight.removeEventListener('keyup',validateRightUrlImage);

        wrongAnswer1.removeEventListener('keyup',validateWrongAnswer1);
        wrongUrl1.removeEventListener('keyup', validateWrongUrl1);

        wrongAnswer2.removeEventListener('keyup',validateWrongAnswer2);
        wrongUrl2.removeEventListener('keyup', validateWrongUrl2);

        wrongAnswer3.removeEventListener('keyup',validateWrongAnswer3);
        wrongUrl3.removeEventListener('keyup', validateWrongUrl3);

        currentQuestion.classList.remove('show');
        currentQuestion = newSectionForm;
        questionId = questionIdentifier;
        currentQuestion.classList.add('show');

        listenQuestion();
    } 
    else {
        alert('Preencha todos os campos obrigatórios corretamente');
        return;
    }

    
}
const questionIds= [];
const levelIds = [];
function saveQuestion() {

    const question = {
        title: questionText.value,
        color: backgroundColorText.value,
        answers: [
            {
                text: rightAnswer.value,
                image: urlImageRight.value,
                isCorrectAnswer: true
            },
            {
                text: wrongAnswer1.value,
                image: wrongUrl1.value,
                isCorrectAnswer: false
            }
        ]


    }

    const answer = {
        text: "",
        image: "",
        isCorrectAnswer:false
    }
    if (wrongAnswer2.value !== "" && wrongUrl2.value !== "") {
        answer.text = wrongAnswer2.value;
        answer.image = wrongUrl2.value;
        question.answers.push(answer);
    }
    if (wrongAnswer3.value !== "" && wrongUrl3.value !== "") {
        answer.text = wrongAnswer3.value;
        answer.image = wrongUrl3.value;
        question.answers.push(answer);
    }

    

    // const questionUpdate = formData.questionsForm.indexOf((question) => {
    //     if (question.questionId === questionAnswers.questionId) {
    //         return true;
    //     }
    // })

    // transforma um array de objetos em um array de ids, depois procura id novo vericando se ja existe, e retorna o index ou -1
    indexUpdateQuestion = questionIds.indexOf(questionId);
    
    if (indexUpdateQuestion === -1) {
        questionIds.push(questionId);
        formData.questions.push(question);
    }
    else {
        formData.questions[indexUpdateQuestion] = question
    }

    console.log(formData)
}

function hasQuestionErrors() {
    const errorMessages = currentQuestion.querySelectorAll('h5');

    for (let i = 0; i < errorMessages.length; i++) {
        const hasError = !errorMessages[i].classList.contains('hidden');
        if (hasError) {
            return true;
        }
    }
    if (questionText.value === "" || backgroundColorText.value === "" || rightAnswer.value === "" || urlImageRight.value === "" || wrongAnswer1.value ===  "" || wrongUrl1.value === "") {
        return true;
    }
    return false;
}

let currentLevel;
function loadLevelsSection() {
    if (hasQuestionErrors()) { 
        alert('Preencha os campos obrigatórios corretamente');
        return; 
    }
    //primeiro verificar se todas as perguntas constam preenchidas e salvas
    saveQuestion();
    if (formData.questions.length !== qtyQuestionsValue) {
        alert('Preencha todas as perguntas antes de prosseguir');
        return;
    }

    const questionsSection = document.querySelector('.questions-form');
    questionsSection.classList.add('hidden');

    const levelsSection = document.querySelector('.levels-form');
    levelsSection.classList.remove('hidden');

    const levelsContainer = levelsSection.querySelector('.levels-form .subforms-container');
    levelsContainer.innerHTML = "";

    for (let i = 0; i < qtyLevelsValue; i++) {
        let levelFormModel = 
        `<form action="" id="level-${i+1}">
        <div class="top-question-bar" onclick="toggleLevel(this.parentNode,${i+1})">
            <h3>Nível ${i+1}</h3>
            <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="question-content">
            <input type="text" id="level-title" placeholder="Título do nível">
            <h5 class="level-title-error hidden">Título do nível deve ter no mínimo de 10 caracteres</h5>

            <input type="text" id="min-percentage" placeholder="% de acerto mínima">
            <h5 class="min-percentage-error hidden">Escolha um numero inteiro entre 0 e 100</h5>

            <input type="text" id="level-url-image" placeholder="URL da imagem do nível">
            <h5 class="level-image-error hidden">Formato URL inválido</h5>
            
            <input type="text" id="level-description" placeholder="Descrição do nível">
            <h5 class="level-description-error hidden">Descrição do nível deve ter no mínimo 30 caracteres</h5>
        </div>
        
    </form>`;
        levelsContainer.innerHTML += levelFormModel;
    }

    currentLevel = document.querySelector(`#level-1`);
    listenLevel();

}
let levelTitle;
let minPercentage;
let levelImageUrl;
let levelDescription;
let levelId = 1;
function listenLevel() {
    currentLevel.classList.add('show');

    levelTitle = currentLevel.querySelector('#level-title');
    minPercentage = currentLevel.querySelector('#min-percentage');

    levelImageUrl = currentLevel.querySelector('#level-url-image');
    levelDescription = currentLevel.querySelector('#level-description');


    levelTitle.addEventListener('keyup', validateLevelTitle);
    minPercentage.addEventListener('keyup', validateMinPercentage);
    
    levelImageUrl.addEventListener('keyup', validateLevelImageUrl);
    levelDescription.addEventListener('keyup',validateLevelDescription);
}

function toggleLevel(newSectionForm, levelIdentifier) {
    // antes de mostrar novo form, validar e salvar infos do ultimo preenchido
    if (!hasLevelErrors()) {
        console.log('salva questão')
        saveLevel();
        levelTitle.removeEventListener('keyup', validateLevelTitle);
        minPercentage.removeEventListener('keyup', validateMinPercentage);
        
        levelImageUrl.removeEventListener('keyup', validateLevelImageUrl);
        levelDescription.removeEventListener('keyup',validateLevelDescription);


        currentLevel.classList.remove('show');
        currentLevel = newSectionForm;
        levelId = levelIdentifier;
        currentLevel.classList.add('show');

        listenLevel();
    } 
    else {
        alert('Preencha todos os campos obrigatórios corretamente');
        return;
    }    
}

function saveLevel() {

    const level = {
        title: levelTitle.value,
        minValue: Number(minPercentage.value),
        image: levelImageUrl.value,
        text: levelDescription.value
    }

    // const levelUpdate = formData.levelsForm.indexOf(level => {
    //     if (level.levelId === levelAnswers.levelId) {
    //         return true;
    //     }
    // })

    // transforma um array de objetos em um array de ids, depois procura id novo vericando se ja existe, e retorna o index ou -1
    indexUpdateLevel = levelIds.indexOf(levelId);
    console.log(indexUpdateLevel);
    
    if (indexUpdateLevel === -1) {
        levelIds.push(levelId);
        formData.levels.push(level);
    }
    else {
        formData.levels[indexUpdateLevel] = level 
    }

    console.log(formData)
}

function hasLevelErrors() {
    const errorMessages = currentLevel.querySelectorAll('h5');

    for (let i = 0; i < errorMessages.length; i++) {
        const hasError = !errorMessages[i].classList.contains('hidden');
        if (hasError) {
            return true;
        }
    }
    if (levelTitle.value === "" || levelImageUrl.value === "" || levelDescription.value === "" || minPercentage.value === "") {
        return true;
    }
    return false;
}

function loadFormEnd() {
    if (hasLevelErrors()) { return; }
    saveLevel();
    //primeiro verificar se todas os niveis constam preenchidos e salvos
    if (!validateLevelSection()) {return;}


    const levelsSection = document.querySelector('.levels-form');
    levelsSection.classList.add('hidden');

    const formEndSection = document.querySelector('.quizz-ready');
    formEndSection.classList.remove('hidden');

    const quizzImage = formEndSection.querySelector('.quizz-image img');
    quizzImage.setAttribute('src',formData.image);

    const quizzTitle = formEndSection.querySelector('.quizz-image p');
    quizzTitle.innerHTML = formData.title;

    uploadNewQuizz();
}

function uploadNewQuizz() {
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes',formData)
    .then(res => {
        console.log(res.data);
        //podemos acesasr o id com res.data.id
    })
    .catch(err => {
        console.log(err.response)
    })
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
    const hexa = "#0123456789ABCDEF";

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

const validateLevelTitle = function(e) {
    e.preventDefault();

    const levelTitleError = currentLevel.querySelector('.level-title-error');
    const inputValue = levelTitle.value 

    if (inputValue.length < 10) {
            if (inputValue === "") {
                levelTitle.style.border = "1px solid #D1D1D1";
                levelTitleError.classList.add("hidden");
                return;
            }
            levelTitle.style.border = "2px solid crimson";
            levelTitleError.classList.remove("hidden");
    }
    else {            
            levelTitle.style.border = "2px solid green";
            levelTitleError.classList.add("hidden");
    }
}

const validateMinPercentage = function(e) {
    e.preventDefault();

    const minPercentageError = currentLevel.querySelector('.min-percentage-error');
    const inputValue = minPercentage.value 

    // !inputValue é um truthy ou falsy dependendo se o inputValue veio como numero ou letra
    if ((!Number(inputValue) && Number(inputValue) !== 0) || !Number.isInteger(Number(inputValue)) || Number(inputValue) < 0 || Number(inputValue) > 100 || inputValue === "") {
            if (inputValue === "") {
                minPercentage.style.border = "1px solid #D1D1D1";
                minPercentageError.classList.add("hidden");
                return;
            }
            minPercentage.style.border = "2px solid crimson";
            minPercentageError.classList.remove("hidden");
    }
    else {            
            minPercentage.style.border = "2px solid green";
            minPercentageError.classList.add("hidden");
    }
}

const validateLevelImageUrl = function(e) {
    e.preventDefault();

    const levelImageUrlError = currentLevel.querySelector('.level-image-error');
    const inputValue = levelImageUrl.value 

    if (inputValue.length < 5 || inputValue.substring(0,8) !== "https://") {
            if (inputValue === "") {
                levelImageUrl.style.border = "1px solid #D1D1D1";
                levelImageUrlError.classList.add("hidden");
                return;
            }
            levelImageUrl.style.border = "2px solid crimson";
            levelImageUrlError.classList.remove("hidden");
    }
    else {            
            levelImageUrl.style.border = "2px solid green";
            levelImageUrlError.classList.add("hidden");
    }
}

const validateLevelDescription = function(e) {
    e.preventDefault();

    const levelDescriptionError = currentLevel.querySelector('.level-description-error');
    const inputValue = levelDescription.value;

    if (inputValue.length < 30) {
            if (inputValue === "") {
                levelDescription.style.border = "1px solid #D1D1D1";
                levelDescriptionError.classList.add("hidden");
                return;
            }
            levelDescription.style.border = "2px solid crimson";
            levelDescriptionError.classList.remove("hidden");
    }
    else {            
            levelDescription.style.border = "2px solid green";
            levelDescriptionError.classList.add("hidden");
    }
}

function validateLevelSection() {
    //verifica todos os niveis foram salvos
    if (formData.levels.length !== qtyLevelsValue) {
        alert('Preencha todas os níveis antes de prosseguir');
        return false;
    }       

    //verifica se tem algum nível 0
    const hasZero = formData.levels.map(level => {return level.minValue}).indexOf(0);
    if (hasZero === -1){
        alert('Insira ao menos um nível cuja porcentagem mínima seja 0');
        return false;
    }

    return true;
}


basicInfoForm();

