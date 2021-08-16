const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";

// Home - Kevin part
resetHome();
function requestQuizzes() {
    addLoadScreen();
    const promise = axios.get(URL_API)
    promise.then(renderHome);
    promise.catch(console.log)
}

function resetHome() {
    document.querySelector(".home").innerHTML = `<section class="user-quizzes ">
    </section>
    <section class="all-quizzes">
        <div class="section-title">
            <strong>Todos os Quizzes</strong>
        </div>
        <div class="quizz-box">
        </div>
    </section>
    `;
    requestQuizzes()
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
    if (userQuizzIds.length === 0){
        removeLoadScreen();
    }
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
        userQuizzIds.forEach((quizzId, index) => {
            let quizz;
            const promise = axios.get(URL_API + `/${quizzId.id}`);
            promise.then(response => {
                quizz = response.data;
                userQuizzBox.innerHTML += 
                `<div class="quizz">
                    <div class="clickable-box clickable" onclick="changePage(1, ${quizzId.id})"></div>
                    <img src="${quizz.image}">
                    <div class="black-gradient"></div>
                    <div class="box-edit-exclude">
                        <ion-icon onclick="editUserQuizz(${quizzId.id},'${quizzId.auth}')" name="create-outline"></ion-icon>
                        <ion-icon onclick="deleteUserQuizz(${quizzId.id},'${quizzId.auth}')" name="trash-outline"></ion-icon>
                    </div>
                    <p>${quizz.title}</p>
                </div>`
                if (index === userQuizzIds.length - 1){
                    removeLoadScreen();
                }
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
            resetHome();
            break;
        case 1:
            pages[2].classList.add("hidden");
            pages[0].classList.add("hidden");
            pages[1].classList.remove("hidden");
            resetQuizzGame(information);
            break;
        case 2:
            pages[0].classList.add("hidden");
            pages[1].classList.add("hidden");
            pages[2].classList.remove("hidden");
            resetAddQuizz(pages[2]);
            break;
        default:
            pages[0].classList.add("hidden");
            pages[1].classList.add("hidden");
            pages[2].classList.add("hidden");
            break;
    }
}

function addLoadScreen() {
    document.querySelector(".loading-screen").classList.remove("hidden");
}

function removeLoadScreen() {
    document.querySelector(".loading-screen").classList.add("hidden");
}

// Forms scripts - Carlos part 
let qtyQuestionsValue;
let qtyLevelsValue;

let formData = {
    title:"",
    image:"",
    questions: [],
    levels: []
}

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
let currentLevel;

let levelTitle;
let minPercentage;
let levelImageUrl;
let levelDescription;
let levelId = 1;

let questionIds= [];
let levelIds = [];

function resetFormGlobalVars() {
    currentQuestion = "";
    questionText = "";
    backgroundColorText = "";

    rightAnswer = "";
    urlImageRight = "";

    wrongAnswer1 = "";
    wrongUrl1 = "";

    wrongAnswer2 = "";
    wrongUrl2 = "";

    wrongAnswer3 = "";
    wrongUrl3 = "";

    questionId = 1;
    currentLevel = "";

    levelTitle = "";
    minPercentage = 0;
    levelImageUrl = "";
    levelDescription = "";
    levelId = 1;

    questionIds= [];
    levelIds = [];

    formData.title = "";
    formData.image = "";
    formData.questions = [];
    formData.levels = [];
}

function resetAddQuizz(page) {
    page.querySelector('.basic-info-form').classList.remove("hidden");;
    page.querySelector('.questions-form').classList.add("hidden");
    page.querySelector('.levels-form').classList.add("hidden");
    page.querySelector('.quizz-ready').classList.add("hidden");
    resetFormGlobalVars()
    basicInfoForm()
}

function basicInfoForm() {
    const firstForm = document.querySelector('.basic-info-form');

    const title = firstForm.querySelector('#title');
    const quizzImage = firstForm.querySelector('#url-quizz-image');
    const qtyQuestions = firstForm.querySelector('#qty-questions');
    const qtyLevels = firstForm.querySelector('#qty-levels');

    firstForm.addEventListener('keyup',validateFirstForm);

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
        firstForm.removeEventListener('keyup',validateFirstForm);
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
            <div class="top-question-bar" >
                <h3>Pergunta ${i+1}</h3>
                <ion-icon onclick="toggleQuestion(this.parentNode.parentNode,${i+1})" name="create-outline"></ion-icon>
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
    currentQuestion.querySelector('ion-icon').classList.add('hidden');
    questionsSection.querySelector('button').setAttribute('onclick', "loadLevelsSection()");
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

    currentQuestion.addEventListener('keyup',validateCurrentQuestion);
}

function toggleQuestion(newSectionForm, questionIdentifier) {
    // antes de mostrar novo form, validar e salvar infos do ultimo preenchido
    if (!hasQuestionErrors()) {
        saveQuestion();
        questionText.removeEventListener('keyup', validateQuestionText);
        backgroundColorText.removeEventListener('keyup', validateBackgroudColorText);
        
        let editIcon = currentQuestion.querySelector('ion-icon');
        editIcon.classList.remove('hidden');
        currentQuestion.classList.remove('show');
        currentQuestion.removeEventListener('keyup',validateCurrentQuestion);

        currentQuestion = newSectionForm;

        editIcon = currentQuestion.querySelector('ion-icon');
        editIcon.classList.add('hidden');
        questionId = questionIdentifier;
        currentQuestion.classList.add('show');
        listenQuestion();
    } 
    else {
        alert('Preencha todos os campos obrigatórios corretamente');
        return;
    }
}

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
    const answer2 = {
        text: "",
        image: "",
        isCorrectAnswer:false
    }
    const answer3 = {
        text: "",
        image: "",
        isCorrectAnswer:false
    }
    
     if (wrongAnswer2 !== null && wrongUrl2 !== null) {
         if (wrongAnswer2.value !== "" && wrongUrl2.value !== "") {
             answer2.text = wrongAnswer2.value;
             answer2.image = wrongUrl2.value;
             question.answers.push(answer2);
         }
     }

     if (wrongAnswer3 !== null && wrongUrl3 !== null) {
         if (wrongAnswer3.value !== "" && wrongUrl3.value !== "") {
             answer3.text = wrongAnswer3.value;
             answer3.image = wrongUrl3.value;
             question.answers.push(answer3);
         }
     }

    indexUpdateQuestion = questionIds.indexOf(questionId);
    
    if (indexUpdateQuestion === -1) {
        questionIds.push(questionId);
        formData.questions.push(question);
    }
    else { formData.questions[indexUpdateQuestion] = question }

    console.log(formData);
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

function loadLevelsSection() {
    //primeiro verificar se todas as perguntas constam preenchidas e salvas
    if (hasQuestionErrors()) { 
        alert('Preencha os campos obrigatórios corretamente');
        return; 
    }
    saveQuestion();
    if (formData.questions.length !== qtyQuestionsValue) {
        alert('Preencha todas as perguntas antes de prosseguir');
        return;
    }
    currentQuestion.removeEventListener('keyup',validateCurrentQuestion);
    const questionsSection = document.querySelector('.questions-form');
    questionsSection.classList.add('hidden');

    const levelsSection = document.querySelector('.levels-form');
    levelsSection.classList.remove('hidden');

    const levelsContainer = levelsSection.querySelector('.levels-form .subforms-container');
    levelsContainer.innerHTML = "";

    for (let i = 0; i < qtyLevelsValue; i++) {
        let levelFormModel = 
        `<form action="" id="level-${i+1}">
        <div class="top-question-bar" >
            <h3>Nível ${i+1}</h3>
            <ion-icon onclick="toggleLevel(this.parentNode.parentNode,${i+1})" name="create-outline"></ion-icon>
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
    currentLevel.querySelector('ion-icon').classList.add('hidden');
    questionsSection.querySelector('button').setAttribute('onclick', "loadFormEnd()");
    listenLevel();
}

function listenLevel() {
    currentLevel.classList.add('show');

    levelTitle = currentLevel.querySelector('#level-title');
    minPercentage = currentLevel.querySelector('#min-percentage');

    levelImageUrl = currentLevel.querySelector('#level-url-image');
    levelDescription = currentLevel.querySelector('#level-description');

    currentLevel.addEventListener('keyup',validateCurrentLevel);
}

function toggleLevel(newSectionForm, levelIdentifier) {
    // antes de mostrar novo form, validar e salvar infos do ultimo preenchido
    if (!hasLevelErrors()) {
        saveLevel();

        let editIcon = currentLevel.querySelector('ion-icon');
        editIcon.classList.remove('hidden');
        currentLevel.classList.remove('show');
        currentLevel.removeEventListener('keyup',validateCurrentLevel);

        currentLevel = newSectionForm;

        editIcon = currentLevel.querySelector('ion-icon');
        editIcon.classList.add('hidden');
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
    indexUpdateLevel = levelIds.indexOf(levelId);

    if (indexUpdateLevel === -1) {
        levelIds.push(levelId);
        formData.levels.push(level);
    }
    else { formData.levels[indexUpdateLevel] = level }

    console.log(formData);

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
    addLoadScreen();
    if (hasLevelErrors()) { 
        alert('Preencha os campos obrigatórios corretamente');
        return; 
    }
    saveLevel();
    //primeiro verificar se todas os niveis constam preenchidos e salvos
    if (!validateLevelSection()) { return; }

    currentLevel.removeEventListener('keyup',validateCurrentLevel);
    const levelsSection = document.querySelector('.levels-form');
    levelsSection.classList.add('hidden');

    const formEndSection = document.querySelector('.quizz-ready');
    formEndSection.classList.remove('hidden');

    const quizzImage = formEndSection.querySelector('.quizz-image img');
    quizzImage.setAttribute('src',formData.image);

    const quizzTitle = formEndSection.querySelector('.quizz-image p');
    quizzTitle.innerHTML = formData.title;

    postQuizz();
}

function postQuizz() {
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes',formData)
    .then(res => {
        // att localStorage
        let userQuizzIds = getUserQuizzes();
        userQuizzIds.push({
            id: res.data.id,
            auth: res.data.key
        });
        userQuizzIds = JSON.stringify(userQuizzIds);
        localStorage.setItem("userQuizzIds", userQuizzIds);
        removeLoadScreen();
    })
    .catch(err => {
        console.log(err.response);
        removeLoadScreen();
    })
}

function startNewQuizz() {
    let userQuizzIds = getUserQuizzes();
    changePage(1,userQuizzIds[userQuizzIds.length-1].id)
}

function deleteUserQuizz(id, auth) {
    
    axios.delete(`https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes/${id}`, {
        headers: {
            'Secret-Key': auth,
        }
    })
    .then(res => {
        let userQuizzIds = getUserQuizzes();
        deletedIdIndex = userQuizzIds.map(idsObj => { return idsObj.id }).indexOf(id);
        //remove 1 item no indice "deleteIdIndex"
        userQuizzIds.splice(deletedIdIndex,1);
        userQuizzIds = JSON.stringify(userQuizzIds);
        localStorage.setItem("userQuizzIds", userQuizzIds);
        changePage(0);
    })
    .catch(err => {
        console.log(err.response);
    });
}

function editUserQuizz(id, auth) {    
    axios(`https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes/${id}`)
    .then(res => {
        updateQuestionsSection(res.data,id,auth);
    })
}

function updateQuestionsSection(quizzToEdit,id,auth) {
    changePage(2);
    formData.title = quizzToEdit.title;
    formData.image = quizzToEdit.image;
    formData.questions = quizzToEdit.questions;
    formData.levels = quizzToEdit.levels

    const questionsSection = document.querySelector('.questions-form');
    const basicForm = document.querySelector('.basic-info-form');
    questionsSection.classList.remove('hidden');
    basicForm.classList.add('hidden');

    const questionsContainer = questionsSection.querySelector('.subforms-container');
    questionsContainer.innerHTML = "";

    for (let i = 0; i < formData.questions.length; i++) {
        if (formData.questions[i].answers.length === 4){
            let questionFormModel = 
            `<form action="" id="question-${i+1}">
                <div class="top-question-bar" >
                    <h3>Pergunta ${i+1}</h3>
                    <ion-icon onclick="toggleQuestion(this.parentNode.parentNode,${i+1})" name="create-outline"></ion-icon>
                </div>
                <div class="question-content">
                    <input required type="text" id="question-text" placeholder="Texto da pergunta" value="${formData.questions[i].title}">
                        <h5 class="question-text-error hidden">Título precisa possuir no mínimo 20 caracteres</h5>
                    <input required type="text" id="background-color-text" placeholder="Cor de fundo da pergunta" value="${formData.questions[i].color}">
                        <h5 class="background-text-error hidden">Insira no formato hexadecimal. Ex: #123ABC</h5>

                    <h3 class="right">Resposta correta</h3>
                    <input required type="text" id="right-answer" placeholder="Resposta correta"  value="${formData.questions[i].answers[0].text}">
                        <h5 class="right-answer-error hidden">Campo obrigatório. Preencha a resposta correta</h5>
                    <input required type="text" id="url-image-right" placeholder="URL da imagem" value="${formData.questions[i].answers[0].image}">
                        <h5 class="image-right-error hidden">Formato URL inválido</h5>
                    
                    <h3 class="wrong">Respostas incorretas</h3>
                    <input required type="text" id="wrong-answer-1" placeholder="Resposta incorreta 1"  value="${formData.questions[i].answers[1].text}">
                        <h5 class="wrong-answer1-error hidden">Campo obrigatório. Preencha 1 resposta incorreta</h5>
                    <input required type="text" id="wrong-url-1" placeholder="URL da imagem 1" value="${formData.questions[i].answers[1].image}">
                        <h5 class="wrong-url1-error hidden">Formato URL inválido</h5>


                    <input type="text" id="wrong-answer-2" placeholder="Resposta incorreta 2" value="${formData.questions[i].answers[2].text}">
                        <h5 class="wrong-answer2-error hidden">Campo não pode permanecer vazio</h5>
                    <input type="text" id="wrong-url-2" placeholder="URL da imagem 2" value="${formData.questions[i].answers[2].image}">
                        <h5 class="wrong-url2-error hidden">Formato URL inválido</h5>


                    <input type="text" id="wrong-answer-3" placeholder="Resposta incorreta 3" value="${formData.questions[i].answers[3].text}">
                        <h5 class="wrong-answer3-error hidden">Campo não pode permanecer vazio</h5>
                    <input type="text" id="wrong-url-3" placeholder="URL da imagem 3" value="${formData.questions[i].answers[3].image}">
                        <h5 class="wrong-url3-error hidden">Formato URL inválido</h5>     
                </div>     
            </form>`;
            questionsContainer.innerHTML += questionFormModel;
        }

        if (formData.questions[i].answers.length === 3){
            let questionFormModel = 
            `<form action="" id="question-${i+1}">
                <div class="top-question-bar" >
                    <h3>Pergunta ${i+1}</h3>
                    <ion-icon onclick="toggleQuestion(this.parentNode.parentNode,${i+1})" name="create-outline"></ion-icon>
                </div>
                <div class="question-content">
                    <input required type="text" id="question-text" placeholder="Texto da pergunta" value="${formData.questions[i].title}">
                        <h5 class="question-text-error hidden">Título precisa possuir no mínimo 20 caracteres</h5>
                    <input required type="text" id="background-color-text" placeholder="Cor de fundo da pergunta" value="${formData.questions[i].color}">
                        <h5 class="background-text-error hidden">Insira no formato hexadecimal. Ex: #123ABC</h5>
    
                    <h3 class="right">Resposta correta</h3>
                    <input required type="text" id="right-answer" placeholder="Resposta correta"  value="${formData.questions[i].answers[0].text}">
                        <h5 class="right-answer-error hidden">Campo obrigatório. Preencha a resposta correta</h5>
                    <input required type="text" id="url-image-right" placeholder="URL da imagem" value="${formData.questions[i].answers[0].image}">
                        <h5 class="image-right-error hidden">Formato URL inválido</h5>
                    
                    <h3 class="wrong">Respostas incorretas</h3>
                    <input required type="text" id="wrong-answer-1" placeholder="Resposta incorreta 1"  value="${formData.questions[i].answers[1].text}">
                        <h5 class="wrong-answer1-error hidden">Campo obrigatório. Preencha 1 resposta incorreta</h5>
                    <input required type="text" id="wrong-url-1" placeholder="URL da imagem 1" value="${formData.questions[i].answers[1].image}">
                        <h5 class="wrong-url1-error hidden">Formato URL inválido</h5>
    
    
                    <input type="text" id="wrong-answer-2" placeholder="Resposta incorreta 2" value="${formData.questions[i].answers[2].text}">
                        <h5 class="wrong-answer2-error hidden">Campo não pode permanecer vazio</h5>
                    <input type="text" id="wrong-url-2" placeholder="URL da imagem 2" value="${formData.questions[i].answers[2].image}">
                        <h5 class="wrong-url2-error hidden">Formato URL inválido</h5>                    
                </div>                
            </form>`;
            questionsContainer.innerHTML += questionFormModel;
        }

        if (formData.questions[i].answers.length === 2){
            let questionFormModel = 
            `<form action="" id="question-${i+1}">
                <div class="top-question-bar" >
                    <h3>Pergunta ${i+1}</h3>
                    <ion-icon onclick="toggleQuestion(this.parentNode.parentNode,${i+1})" name="create-outline"></ion-icon>
                </div>
                <div class="question-content">
                    <input required type="text" id="question-text" placeholder="Texto da pergunta" value="${formData.questions[i].title}">
                        <h5 class="question-text-error hidden">Título precisa possuir no mínimo 20 caracteres</h5>
                    <input required type="text" id="background-color-text" placeholder="Cor de fundo da pergunta" value="${formData.questions[i].color}">
                        <h5 class="background-text-error hidden">Insira no formato hexadecimal. Ex: #123ABC</h5>
    
                    <h3 class="right">Resposta correta</h3>
                    <input required type="text" id="right-answer" placeholder="Resposta correta"  value="${formData.questions[i].answers[0].text}">
                        <h5 class="right-answer-error hidden">Campo obrigatório. Preencha a resposta correta</h5>
                    <input required type="text" id="url-image-right" placeholder="URL da imagem" value="${formData.questions[i].answers[0].image}">
                        <h5 class="image-right-error hidden">Formato URL inválido</h5>
                    
                    <h3 class="wrong">Respostas incorretas</h3>
                    <input required type="text" id="wrong-answer-1" placeholder="Resposta incorreta 1"  value="${formData.questions[i].answers[1].text}">
                        <h5 class="wrong-answer1-error hidden">Campo obrigatório. Preencha 1 resposta incorreta</h5>
                    <input required type="text" id="wrong-url-1" placeholder="URL da imagem 1" value="${formData.questions[i].answers[1].image}">
                        <h5 class="wrong-url1-error hidden">Formato URL inválido</h5>
                </div>     
            </form>`;
            questionsContainer.innerHTML += questionFormModel;
        }
        questionIds.push(i+1);
    }

    currentQuestion = document.querySelector(`#question-1`);
    currentQuestion.querySelector('ion-icon').classList.add('hidden');
    questionsSection.querySelector('button').setAttribute('onclick', `updateLevelsSection(${id},"${auth}")`);
    listenQuestion();
}

function updateLevelsSection(id,auth) {
    //primeiro verificar se todas as perguntas constam preenchidas e salvas
    if (hasQuestionErrors()) { 
        alert('Preencha os campos obrigatórios corretamente');
        return; 
    }
    saveQuestion();
    // if (formData.questions.length !== qtyQuestionsValue) {
    //     alert('Preencha todas as perguntas antes de prosseguir');
    //     return;
    // }
    currentQuestion.removeEventListener('keyup',validateCurrentQuestion);
    const questionsSection = document.querySelector('.questions-form');
    questionsSection.classList.add('hidden');

    const levelsSection = document.querySelector('.levels-form');
    levelsSection.classList.remove('hidden');

    const levelsContainer = levelsSection.querySelector('.levels-form .subforms-container');
    levelsContainer.innerHTML = "";

    for (let i = 0; i < formData.levels.length; i++) {
        let levelFormModel = 
        `<form action="" id="level-${i+1}">
        <div class="top-question-bar" >
            <h3>Nível ${i+1}</h3>
            <ion-icon onclick="toggleLevel(this.parentNode.parentNode,${i+1})" name="create-outline"></ion-icon>
        </div>
        <div class="question-content">
            <input type="text" id="level-title" placeholder="Título do nível" value="${formData.levels[i].title}">
            <h5 class="level-title-error hidden">Título do nível deve ter no mínimo de 10 caracteres</h5>

            <input type="text" id="min-percentage" placeholder="% de acerto mínima" value="${formData.levels[i].minValue}">
            <h5 class="min-percentage-error hidden">Escolha um numero inteiro entre 0 e 100</h5>

            <input type="text" id="level-url-image" placeholder="URL da imagem do nível" value="${formData.levels[i].image}">
            <h5 class="level-image-error hidden">Formato URL inválido</h5>
            
            <input type="text" id="level-description" placeholder="Descrição do nível" value="${formData.levels[i].text}">
            <h5 class="level-description-error hidden">Descrição do nível deve ter no mínimo 30 caracteres</h5>
        </div>
        
    </form>`;
        levelsContainer.innerHTML += levelFormModel;
        levelIds.push(i+1);
    }
    currentLevel = document.querySelector(`#level-1`);
    currentLevel.querySelector('ion-icon').classList.add('hidden');
    levelsSection.querySelector('button').setAttribute('onclick', `updateFormEnd(${id},"${auth}")`);
    listenLevel();
}

function updateFormEnd(id,auth) {
    if (hasLevelErrors()) { 
        alert('Preencha os campos obrigatórios corretamente');
        return; 
    }
    saveLevel();
    //verifica se tem algum nível 0
    const hasZero = formData.levels.map(level => {return level.minValue}).indexOf(0);
    if (hasZero === -1){
        alert('Insira ao menos um nível cuja porcentagem mínima seja 0');
        return;
    }

    updateQuizz(id,auth);

    currentLevel.removeEventListener('keyup',validateCurrentLevel);
    const levelsSection = document.querySelector('.levels-form');
    levelsSection.classList.add('hidden');

    const formEndSection = document.querySelector('.quizz-ready');
    formEndSection.classList.remove('hidden');

    const quizzImage = formEndSection.querySelector('.quizz-image img');
    quizzImage.setAttribute('src',formData.image);

    const quizzTitle = formEndSection.querySelector('.quizz-image p');
    quizzTitle.innerHTML = formData.title;

}

function updateQuizz(id,auth) {
    console.log(formData)
    axios.put(URL_API + `/${id}`,formData,{
        headers: {
            'Secret-Key': auth
        }
    })
    .then(res => {
        console.log(res.data);
    })
    .catch(err => {
        console.log(err.response);
    })
}