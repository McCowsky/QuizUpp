"use strict";
const username = document.getElementById("username");
const finalScoreBox = document.getElementById("finalScoreBox");
const highscores = JSON.parse(localStorage.getItem("highscores") || "[]") || [];
let savedScore = localStorage.getItem("savedScore");
if (finalScoreBox != null && savedScore != null) {
    finalScoreBox.innerText = savedScore;
}
const saveScore = (event) => {
    event.preventDefault();
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
};
