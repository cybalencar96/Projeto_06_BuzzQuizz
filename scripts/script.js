const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";

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

let formIndex = 0;
function nextForm(formIndex) {
    if (validateInfos(formIndex)) {
        const formArr = document.querySelectorAll('.add-quizz > section');

        formArr[formIndex-1].classList.add('hidden');
        if (formIndex !== formArr.length) {
            formArr[formIndex].classList.remove('hidden');

            if (formIndex === 1) { questionsForm() }
            if (formIndex === 2) { levelsForm() }
        } 
        else {
            formArr[formIndex].classList.add('hidden');
            alert('ultimo form');
        }
    }




}

function validateInfos(formIndex) {
    return true;
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
        nextForm(1);
    }
    
    buttonNextForm.addEventListener('click', verifyErrors);
}

function questionsForm() {
    loadQuestionsHtml();

}

function toggleQuestion(formLoad) {
    //before showing new question form, validate and save last question form
    const questionsContainer = document.querySelector('.add-quizz .questions-container');
    questionsContainer.querySelector('.show');
    if (validateQuestion()) {
        saveQuestion();
    }
}

function loadQuestionsHtml() {
    const qtyQuestions = formData.basicInfoForm.qtyQuestions;
    const questionsContainer = document.querySelector('.add-quizz .subforms-container');
    questionsContainer.innerHTML = "";

    for (let i = 0; i < qtyQuestions; i++) {
        let questionFormModel = 
        `<form action="" id="question-${i+1}">
            <div class="top-question-bar" onclick="toggleQuestion(this.parentNode)">
                <h3>Pergunta ${i+1}</h3>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class="question-content">
                <input type="text" id="question-text" placeholder="Texto da pergunta">
                    <h5 class="question-text-error hidden">Título precisa possuir no mínimo 20 caracteres</h5>
                <input type="text" id="backgroud-color-text" placeholder="Cor de fundo da pergunta">
                    <h5 class="background-text-error hidden">Insira no formato hexadecimal. Ex: #123ABC</h5>

                <h3 class="right">Resposta correta</h3>
                <input type="text" id="right-answer" placeholder="Resposta correta">
                    <h5 class="right-answer-error hidden">Campo obrigatório. Preencha a resposta correta /h5>
                <input type="text" id="url-image-right" placeholder="URL da imagem">
                    <h5 class="image-right-error hidden">Formato URL inválido</h5>
                
                <h3 class="wrong">Respostas incorretas</h3>
                <input type="text" id="wrong-answer-1" placeholder="Resposta incorreta 1">
                    <h5 class="wrong-answer1-error hidden">Campo obrigatório. Preencha 1 resposta incorreta</h5>
                <input type="text" id="wrong-url-1" placeholder="URL da imagem 1">
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

    listenQuestion(1);
}

//variavel para auxiliar nas validações das questions
let qNumber;
function listenQuestion(questionNumber) {
    const questionsContainer = document.querySelector('.add-quizz .subforms-container');
    qNumber = questionNumber;
    const question = questionsContainer.querySelector(`#question-${questionNumber}`);
    question.classList.add('show');

    const questionText = question.querySelector('#question-text');
    const backgroundColorText = question.querySelector('#background-color-text');

    const rightAnswer = question.querySelector('#right-answer');
    const urlImageRight = question.querySelector('#url-image-right');

    const wrongAnswer1 = question.querySelector('#wrong-answer-1');
    const wrongUrl1 = question.querySelector('#wrong-url-1');

    const wrongAnswer2 = question.querySelector('#wrong-answer-2');
    const wrongUrl2 = question.querySelector('#wrong-url-2');

    const wrongAnswer3 = question.querySelector('#wrong-answer-3');
    const wrongUrl3 = question.querySelector('#wrong-url-3');

    questionText.addEventListener('keyup', validateQuestionText);


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
    const questionsContainer = document.querySelector('.add-quizz .subforms-container');

    const question = questionsContainer.querySelector(`#question-${qNumber}`);
    const questionText = question.querySelector('#question-text');
    const questionTextError = question.querySelector('.question-text-error');

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


basicInfoForm();

