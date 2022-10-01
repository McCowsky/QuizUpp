"use strict";
const questionBox = document.getElementById("question");
const answerBoxes = Array.from(document.getElementsByClassName("answer"));
const questionCounterBox = document.getElementById("questionCounterBox");
const scoreBox = document.getElementById("scoreBox");
console.log(answerBoxes);
const progressBarBox = document.getElementById("progressBarBox");
const gameBox = document.getElementById("game");
const loaderBox = document.getElementById("loader");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
const CORRECT_BONUS = 10;
const MAX_QUESTION = 10;
let questions = [];
fetch("https://opentdb.com/api.php?amount=10&category=11")
    .then((res) => {
    return res.json();
})
    .then((loadedQuestions) => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };
        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
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
        console.log(progress);
        progressBarBox.style.width = `${(questionCounter / MAX_QUESTION) * 100}%`;
    }
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    if (questionBox != null) {
        questionBox.innerHTML = currentQuestion.question;
    }
    answerBoxes.forEach((answerBox) => {
        let answerBoxNumber = answerBox.dataset["number"];
        answerBox.innerText = currentQuestion["choice" + answerBoxNumber];
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
        const classToApply = selectedChoice == currentQuestion.answer ? "bg-green-400" : "bg-red-400";
        if (classToApply === "bg-green-400")
            scoreAdd(CORRECT_BONUS);
        button.target.classList.add(classToApply);
        setTimeout(() => {
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
