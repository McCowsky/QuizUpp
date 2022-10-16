const username = document.getElementById("username") as HTMLInputElement | null;
const finalScoreBox = document.getElementById(
  "finalScoreBox"
) as HTMLDivElement | null;
const errorBox = document.getElementById("errorBox") as HTMLDivElement | null;

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

  if (checkInput()) {
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
    window.location.assign("../../index.html");
  }
};

const isRequired = (value: string) => (value === "" ? false : true);

const isBetween = (length: number, min: number, max: number) =>
  length < min || length > max ? false : true;

const showError = (error: string) => {
  errorBox?.classList.remove("hidden");
  errorBox!.innerText = error;
};

const showSuccess = () => {
  errorBox?.classList.add("hidden");
  errorBox!.innerText = "";
};

const checkInput = () => {
  //let valid: boolean = false;
  const MIN: number = 3;
  const MAX: number = 20;
  const inputValue: string = username!.value.trim();

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
