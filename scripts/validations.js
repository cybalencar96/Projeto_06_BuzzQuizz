const validateFirstForm = e => {
    e.preventDefault();

    validateTitle();
    validateQuizzImage();
    validateQtyQuestions();
    validateQtyLevels();
}

function checkRule(element, elementError, rule) {
    if (element.value === "") {
            element.style.border = "1px solid #D1D1D1";
            elementError.classList.add("hidden");

    } else {
        if (rule) {
            element.style.border = "2px solid crimson";
            elementError.classList.remove("hidden");
        }
        else {            
            element.style.border = "2px solid green";
            elementError.classList.add("hidden");
        }
    }
    
}


function validateTitle() {
    const title = document.querySelector('.basic-info-form #title');
    const titleError = document.querySelector(".basic-info-form .title-error");
    const condition = title.value.length < 20 || title.value.length > 65;

    checkRule(title,titleError,condition);
}

function validateQuizzImage() {
    const quizzImage = document.querySelector('.basic-info-form #url-quizz-image');
    const quizzImageError = document.querySelector(".basic-info-form .url-error");
    const condition = quizzImage.value.length < 5 || quizzImage.value.substring(0,8) !== "https://";
    checkRule(quizzImage,quizzImageError, condition)
}

function validateQtyQuestions() {
    const qtyQuestions = document.querySelector('.basic-info-form #qty-questions');
    const qtyQuestionsError = document.querySelector(".basic-info-form .qty-questions-error");
    const condition = !Number(qtyQuestions.value) || Number(qtyQuestions.value) < 3 || !Number.isInteger(Number(qtyQuestions.value));    
    checkRule(qtyQuestions,qtyQuestionsError,condition);
}

function validateQtyLevels() {
    const qtyLevels = document.querySelector('.basic-info-form #qty-levels');
    const qtyLevelsError = document.querySelector(".basic-info-form .qty-levels-error");
    const condition = !Number(qtyLevels.value) || Number(qtyLevels.value) < 2 || !Number.isInteger(Number(qtyLevels.value)) ;  
    checkRule(qtyLevels,qtyLevelsError,condition);
}

const validateCurrentQuestion = e => {
    e.preventDefault();
    validateQuestionText();
    validateBackgroudColorText();
    validateAnswers();  
}

function validateQuestionText() {
    const questionText = currentQuestion.querySelector('#question-text');
    const questionTextError = currentQuestion.querySelector('.question-text-error');
    const condition = questionText.value.length < 20;
    checkRule(questionText, questionTextError, condition);
}

function validateBackgroudColorText() {
    const backgroundColorText = currentQuestion.querySelector('#background-color-text');
    const backgroundColorTextError = currentQuestion.querySelector('.background-text-error');
    const inputValue = backgroundColorText.value;
    const hexa = "#0123456789ABCDEF";
    let invalidHexa = false;

     for (let i = 0; i < inputValue.length; i++) {
         if (hexa.indexOf(inputValue[i]) === -1) { invalidHexa = true; }
     }

     const condition = inputValue === "" || inputValue[0] !== "#" || inputValue.length !== 7 || invalidHexa;
     checkRule(backgroundColorText,backgroundColorTextError,condition);
}

function validateAnswers() {
    const rightAnswerError = currentQuestion.querySelector('.right-answer-error');
    const urlImageRightError = currentQuestion.querySelector('.image-right-error');
    const wrongAnswer1Error = currentQuestion.querySelector('.wrong-answer1-error');
    const wrongAnswer2Error = currentQuestion.querySelector('.wrong-answer2-error');
    const wrongAnswer3Error = currentQuestion.querySelector('.wrong-answer3-error');
    const wrongUrl1Error = currentQuestion.querySelector('.wrong-url1-error');
    const wrongUrl2Error = currentQuestion.querySelector('.wrong-url2-error');
    const wrongUrl3Error = currentQuestion.querySelector('.wrong-url3-error');

    const arrAnswers = [rightAnswer,wrongAnswer1,wrongAnswer2,wrongAnswer3];
    const arrAnswersError = [rightAnswerError, wrongAnswer1Error,wrongAnswer2Error,wrongAnswer3Error];
    const arrUrls = [urlImageRight, wrongUrl1, wrongUrl2,wrongUrl3];
    const arrUrlErros = [urlImageRightError, wrongUrl1Error, wrongUrl2Error,wrongUrl3Error];

    for (let i = 0; i < 4; i++) {
        const answerCondition = arrAnswers[i] === "";
        const urlCondition = arrUrls[i].value.length < 5 || arrUrls[i].value.substring(0,8) !== "https://";
        checkRule(arrAnswers[i],arrAnswersError[i],answerCondition);
        checkRule(arrUrls[i],arrUrlErros[i],urlCondition);
    }
}

const validateCurrentLevel = e => {
    e.preventDefault();
    validateLevelTitle();
    validateMinPercentage();
    validateLevelImageUrl();
    validateLevelDescription();
}

function validateLevelTitle() {
    const levelTitleError = currentLevel.querySelector('.level-title-error');
    const condition = levelTitle.value.length < 10;
    checkRule(levelTitle, levelTitleError,condition);
}

function validateMinPercentage() {
    const minPercentageError = currentLevel.querySelector('.min-percentage-error');
    const inputValue = minPercentage.value 
    const condition = (!Number(inputValue) && Number(inputValue) !== 0) || !Number.isInteger(Number(inputValue)) || Number(inputValue) < 0 || Number(inputValue) > 100 || inputValue === "";  
    checkRule(minPercentage,minPercentageError,condition);
}

function validateLevelImageUrl() {
    const levelImageUrlError = currentLevel.querySelector('.level-image-error');
    const condition = levelImageUrl.value.length < 5 || levelImageUrl.value.substring(0,8) !== "https://"
    checkRule(levelImageUrl,levelImageUrlError,condition);
}

function validateLevelDescription() {
    const levelDescriptionError = currentLevel.querySelector('.level-description-error');
    const condition = levelDescription.value.length < 30
    checkRule(levelDescription,levelDescriptionError,condition);
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