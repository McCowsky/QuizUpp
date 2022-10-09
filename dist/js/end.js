"use strict";
const username = document.getElementById("username");
const finalScoreBox = document.getElementById("finalScoreBox");
const errorBox = document.getElementById("errorBox");
const highscores = JSON.parse(localStorage.getItem("highscores") || "[]") || [];
let savedScore = localStorage.getItem("savedScore");
if (finalScoreBox != null && savedScore != null) {
    finalScoreBox.innerText = savedScore;
}
const saveScore = (event) => {
    event.preventDefault();
    if (checkInput()) {
        if (username != null) {
            const score = {
                score: savedScore,
                name: username.value,
            };
            highscores.push(score);
            highscores.sort((a, b) => {
                return Number(b.score) - Number(a.score);
            });
        }
        highscores.splice(5);
        localStorage.setItem("highscores", JSON.stringify(highscores));
        window.location.assign("/");
    }
};
const isRequired = (value) => (value === "" ? false : true);
const isBetween = (length, min, max) => length < min || length > max ? false : true;
const showError = (error) => {
    errorBox === null || errorBox === void 0 ? void 0 : errorBox.classList.remove("hidden");
    errorBox.innerText = error;
};
const showSuccess = () => {
    errorBox === null || errorBox === void 0 ? void 0 : errorBox.classList.add("hidden");
    errorBox.innerText = "";
};
const checkInput = () => {
    //let valid: boolean = false;
    const MIN = 3;
    const MAX = 20;
    const inputValue = username.value.trim();
    if (!isRequired(inputValue)) {
        showError("Username cannot be empty");
        return false;
    }
    if (!isBetween(inputValue.length, MIN, MAX)) {
        showError("Username must be between 3 and 20 characters");
        return false;
    }
    showSuccess;
    return true;
};
