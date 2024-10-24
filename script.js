const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-button");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
    const response = await fetch('https://the-trivia-api.com/api/questions?categories=general_knowledge,food_and_drink&limit=10&region=IN&difficulty=easy');
    const data = await response.json();
    questions = data.map((questionData) => {
        const formattedQuestion = {
            question: questionData.question,
            answers: []
        };
        const incorrectAnswers = questionData.incorrectAnswers.map(answer => ({ text: answer, correct: false }));
        const correctAnswer = { text: questionData.correctAnswer, correct: true };
        formattedQuestion.answers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);
        return formattedQuestion;
    });
    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButton.firstChild) {
        answerButton.removeChild(answerButton.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButton.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `Your score is ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again?";
    nextButton.style.display = "block";
}

function handleNextBtn() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextBtn();
    } else {
        fetchQuestions();
    }
});

// Fetch questions and start the quiz when the page loads
fetchQuestions();
