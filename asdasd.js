const questionBox = document.getElementById(
  "question"
) as HTMLDivElement | null;
const answerBoxes = Array.from(document.getElementsByClassName("answer"));
console.log(answerBoxes);

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions: {}[] = [];

const CORRECT_BONUS = 10;
const MAX_QUESTION = 3;

let questions = [
  {
    question: "aasdasdasdasd",
    choice1: "fdsafgsd",
    choice2: "ghfdhfdgh",
    choice3: "rewtewrt",
    choice4: "aaaaaaa",
    answer: 1,
  },
];

const startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

const getNewQuestion = () => {
  questionCounter++;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  if (questionBox != null) {
    questionBox.innerText = currentQuestion.question;
  }
};
