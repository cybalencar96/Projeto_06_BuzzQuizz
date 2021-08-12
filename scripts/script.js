const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";

// Forms scripts - Carlos part 
let formIndex = 0;
function nextForm(formIndex) {
    if (validateInfos(formIndex)) {
        const formArr = document.querySelectorAll('.add-quizz > section');

        formArr[formIndex].classList.add('hidden');
        if (formIndex + 1 !== formArr.length) {
            formArr[formIndex + 1].classList.remove('hidden');
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

function newQuizz() {
    const firstForm = document.querySelector('.basic-info-form');

    firstForm.classList.remove('hidden');

    const title = firstForm.querySelector('#title');
    const quizzImage = firstForm.querySelector('#url-quizz-image');
    const qtyQuestions = firstForm.querySelector('#qty-questions');
    const qtyLevels = firstForm.querySelector('#qty-levels');

    const titleError = firstForm.querySelector(".title-error");
    const quizzImageError = firstForm.querySelector(".url-error");
    const qtyQuestionsError = firstForm.querySelector(".qty-questions-error");
    const qtyLevelsError = firstForm.querySelector(".qty-levels-error");

    title.addEventListener('keyup', function(e){
        e.preventDefault();

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
    });
    quizzImage.addEventListener('keyup', function(e){
        e.preventDefault();

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
    });
    qtyQuestions.addEventListener('keyup', function(e){
        e.preventDefault();

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
    });
    qtyLevels.addEventListener('keyup', function(e){
        e.preventDefault();

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
    });
    
    const buttonNextForm = firstForm.querySelector('button')
    buttonNextForm.addEventListener('click', e => {
        e.preventDefault();
        const errors = firstForm.querySelectorAll('h5');
        for (let i = 0; i < errors.length; i++){
            if (!errors[i].classList.contains('hidden')) {
                alert('Preencha os campos corretamente');
                return;
            }
        }
        nextForm(formIndex);
    });
}

newQuizz();