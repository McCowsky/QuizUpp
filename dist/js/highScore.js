"use strict";
const scoreListBox = document.getElementById("scoreListBox");
const highscores1 = JSON.parse(localStorage.getItem("highscores") || "[]");
console.log(highscores1);
if (scoreListBox != null) {
    scoreListBox.innerHTML = highscores1
        .map((element) => {
        return `<li>${element.name}:${element.score}</li>`;
    })
        .join("");
}
