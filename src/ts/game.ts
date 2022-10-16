type Question = {
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  answer: number;
};

type LoadedQuestion = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
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

let currentQuestion: Question | null = null;
let acceptingAnswers: boolean = false;
let score: number = 0;
let questionCounter: number = 0;
let availableQuestions: Question[] = [];

const CORRECT_BONUS: number = 10;
const MAX_QUESTION: number = 10;

let questions: Question[] = [];

function isObjKey<T>(key: PropertyKey, obj: T): key is keyof T {
  return key in obj;
}

fetch("https://opentdb.com/api.php?amount=10&category=11")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map(
      (loadedQuestion: LoadedQuestion) => {
        const formattedQuestion: Question = {
          question: loadedQuestion.question,
          choice1: "",
          choice2: "",
          choice3: "",
          choice4: "",
          answer: 0,
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(
          formattedQuestion.answer - 1,
          0,
          loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
          const key = `choice${index + 1}`;
          if (isObjKey<Question>(key, formattedQuestion)) {
            (formattedQuestion[key] as string) = choice;
          }
        });
        return formattedQuestion;
      }
    );

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

    const key = `choice${answerBoxNumber}`;
    if (currentQuestion && isObjKey<Question>(key, currentQuestion)) {
      if (currentQuestion[key] === undefined || currentQuestion[key] === "") {
        answerBox.parentElement!.classList.add("hidden");
      }
    }

    if (currentQuestion && isObjKey<Question>(key, currentQuestion))
      answerBox.innerHTML = currentQuestion[key] as string;
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
      selectedChoice == currentQuestion?.answer ? "bg-green-400" : "bg-red-400";

    if (classToApply === "bg-green-400") {
      scoreAdd(CORRECT_BONUS);
    } else {
      if (currentQuestion?.choice3 != "") {
        console.log(currentQuestion);
        console.log(currentQuestion?.answer! - 1);
        answerBoxes[currentQuestion?.answer! - 1].classList.add("bg-[#FFC857]");
      }
    }

    (button.target as HTMLTextAreaElement).classList.add(classToApply);
    setTimeout(() => {
      if (currentQuestion?.choice3 != "") {
        answerBoxes[currentQuestion?.answer! - 1].classList.remove(
          "bg-[#FFC857]"
        );
      }

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
