const username = document.getElementById("username") as HTMLInputElement | null;
const finalScoreBox = document.getElementById(
  "finalScoreBox"
) as HTMLDivElement | null;

type Score = {
  score: string;
  name: string;
};

const highscores: Score[] =
  JSON.parse(localStorage.getItem("highscores") || "[]") || [];

let savedScore = localStorage.getItem("savedScore");
if (finalScoreBox != null && savedScore != null) {
  finalScoreBox.innerText = savedScore;
}

const saveScore = (event: Event) => {
  event.preventDefault();

  if (username != null) {
    const score: Score = {
      score: savedScore!,
      name: username.value,
    };
    highscores.push(score);

    highscores.sort((a: Score, b: Score) => {
      return Number(b.score) - Number(a.score);
    });
  }
  highscores.splice(5);
  localStorage.setItem("highscores", JSON.stringify(highscores));
  window.location.assign("/");
};
