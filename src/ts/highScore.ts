const scoreListBox = document.getElementById(
  "scoreListBox"
) as HTMLUListElement | null;

const highscores1: Score[] = JSON.parse(
  localStorage.getItem("highscores") || "[]"
);

if (scoreListBox != null) {
  scoreListBox.innerHTML = highscores1
    .map((element: Score) => {
      return `<li>${element.name}:${element.score}</li>`;
    })
    .join("");
}
