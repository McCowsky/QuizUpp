"use strict";
const questionBox = document.getElementById("question");
const answerBoxes = Array.from(document.getElementsByClassName("answer"));
const questionCounterBox = document.getElementById("questionCounterBox");
const scoreBox = document.getElementById("scoreBox");
const progressBarBox = document.getElementById("progressBarBox");
const gameBox = document.getElementById("game");
const loaderBox = document.getElementById("loader");
let currentQuestion = null;
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
const CORRECT_BONUS = 10;
const MAX_QUESTION = 10;
let questions = [];
function isObjKey(key, obj) {
    return key in obj;
}
fetch("https://opentdb.com/api.php?amount=10&category=11")
    .then((res) => {
    return res.json();
})
    .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
            choice1: "",
            choice2: "",
            choice3: "",
            choice4: "",
            answer: 0,
        };
        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
        answerChoices.forEach((choice, index) => {
            const key = `choice${index + 1}`;
            if (isObjKey(key, formattedQuestion)) {
                formattedQuestion[key] = choice;
            }
        });
        return formattedQuestion;
    });
    startGame();
})
    .catch((err) => {
    console.error(err);
});
const startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    gameBox === null || gameBox === void 0 ? void 0 : gameBox.classList.remove("hidden");
    loaderBox === null || loaderBox === void 0 ? void 0 : loaderBox.classList.add("hidden");
};
const getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTION) {
        localStorage.setItem("savedScore", score.toString());
        return window.location.assign("./end.html");
    }
    questionCounter++;
    if (questionCounterBox != null) {
        questionCounterBox.innerText = questionCounter + " / " + MAX_QUESTION;
    }
    if (progressBarBox != null) {
        let progress = (questionCounter / MAX_QUESTION) * 100;
        progressBarBox.style.width = `${(questionCounter / MAX_QUESTION) * 100}%`;
    }
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    if (questionBox != null) {
        questionBox.innerHTML = currentQuestion.question;
    }
    answerBoxes.forEach((answerBox) => {
        answerBox.parentElement.classList.remove("hidden");
        let answerBoxNumber = answerBox.dataset["number"];
        const key = `choice${answerBoxNumber}`;
        if (currentQuestion && isObjKey(key, currentQuestion)) {
            if (currentQuestion[key] === undefined || currentQuestion[key] === "") {
                answerBox.parentElement.classList.add("hidden");
            }
        }
        if (currentQuestion && isObjKey(key, currentQuestion))
            answerBox.innerHTML = currentQuestion[key];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};
answerBoxes.forEach((answerBox) => {
    answerBox.addEventListener("click", (button) => {
        if (!acceptingAnswers)
            return;
        const selectedChoice = button.target.dataset["number"];
        acceptingAnswers = false;
        const classToApply = selectedChoice == (currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.answer) ? "bg-green-400" : "bg-red-400";
        if (classToApply === "bg-green-400") {
            scoreAdd(CORRECT_BONUS);
        }
        else {
            if ((currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.choice3) != "") {
                console.log(currentQuestion);
                console.log((currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.answer) - 1);
                answerBoxes[(currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.answer) - 1].classList.add("bg-yellow-400");
            }
        }
        button.target.classList.add(classToApply);
        setTimeout(() => {
            if ((currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.choice3) != "") {
                answerBoxes[(currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.answer) - 1].classList.remove("bg-yellow-400");
            }
            button.target.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});
const scoreAdd = (bonus) => {
    score += bonus;
    if (scoreBox != null) {
        scoreBox.innerText = score.toString();
    }
};
