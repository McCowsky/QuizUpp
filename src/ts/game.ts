type Question = {
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  answer: number;
};

const questionBox = document.getElementById(
  "question"
) as HTMLDivElement | null;
const answerBoxes = Array.from(
  document.getElementsByClassName("answer") as HTMLCollectionOf<HTMLElement>
);
const questionCounterBox = document.getElementById(
  "questionCounterBox"
) as HTMLDivElement | null;
const scoreBox = document.getElementById("scoreBox") as HTMLDivElement | null;

const progressBarBox = document.getElementById(
  "progressBarBox"
) as HTMLDivElement | null;

const gameBox = document.getElementById("game") as HTMLDivElement | null;
const loaderBox = document.getElementById("loader") as HTMLDivElement | null;

let currentQuestion: any = {};
let acceptingAnswers: boolean = false;
let score: number = 0;
let questionCounter: number = 0;
let availableQuestions: Question[] = [];

const CORRECT_BONUS: number = 10;
const MAX_QUESTION: number = 10;

let questions: Question[] = [];

fetch("https://opentdb.com/api.php?amount=10&category=11")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion: any) => {
      const formattedQuestion: any = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );
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
  gameBox?.classList.remove("hidden");
  loaderBox?.classList.add("hidden");
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
    answerBox.parentElement!.classList.remove("hidden");
    let answerBoxNumber = answerBox.dataset["number"];
    if (currentQuestion["choice" + answerBoxNumber] === undefined)
      answerBox.parentElement!.classList.add("hidden");
    answerBox.innerHTML = currentQuestion["choice" + answerBoxNumber];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

answerBoxes.forEach((answerBox) => {
  answerBox.addEventListener("click", (button) => {
    if (!acceptingAnswers) return;
    const selectedChoice = (button.target as HTMLInputElement).dataset[
      "number"
    ];
    acceptingAnswers = false;
    const classToApply =
      selectedChoice == currentQuestion.answer ? "bg-green-400" : "bg-red-400";

    if (classToApply === "bg-green-400") scoreAdd(CORRECT_BONUS);

    (button.target as HTMLTextAreaElement).classList.add(classToApply);
    setTimeout(() => {
      (button.target as HTMLTextAreaElement).classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

const scoreAdd = (bonus: number) => {
  score += bonus;
  if (scoreBox != null) {
    scoreBox.innerText = score.toString();
  }
};
