const urlParameters = new URLSearchParams(window.location.search);
const numQuestions = parseInt(urlParameters.get('numQuestions')) || 10;
const category = urlParameters.get('category');

let quizQuestions = [];
let results = [];
let currentQuestion = 0;


let apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&type=multiple`;
if (category) {
  apiUrl += `&category=${category}`;
}


fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const decoded = data.results.map((item) => {
      const choices = [...item.incorrect_answers, item.correct_answer];
      const shuffled = choices
        .map(choice => ({ choice, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ choice }) => decodeHTML(choice));

      return {
        question: decodeHTML(item.question),
        A: shuffled[0],
        B: shuffled[1],
        C: shuffled[2],
        D: shuffled[3],
        answer: decodeHTML(item.correct_answer)
      };
    });

    quizQuestions = decoded;
    loadQuestion(currentQuestion);
  })
  .catch(error => {
    console.error("Failed to load questions:", error);
    document.getElementById("question-text").textContent = "Failed to load questions.";
  });


function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}


function loadQuestion(index) {
  const q = quizQuestions[index];
  if (!q) return;

  document.getElementById("question-text").textContent = q.question;

  ["A", "B", "C", "D"].forEach(letter => {
    const box = document.getElementById(letter);
    box.textContent = q[letter];
    box.style.backgroundColor = "";

    const correctLetter = Object.entries(q).find(([key, val]) =>
      val === q.answer && ["A", "B", "C", "D"].includes(key)
    )?.[0];

    box.onclick = () => handleAnswerClick(letter, correctLetter);
  });
}

function handleAnswerClick(selected, correct) {
  const q = quizQuestions[currentQuestion];

  results.push({
    question: q.question,
    selected,
    correct,
    answers: { A: q.A, B: q.B, C: q.C, D: q.D }
  });

  ["A", "B", "C", "D"].forEach(letter => {
    const box = document.getElementById(letter);
    if (letter === correct) {
      box.style.backgroundColor = "green";
    } else if (letter === selected) {
      box.style.backgroundColor = "red";
    } else {
      box.style.backgroundColor = "";
    }
  });

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      loadQuestion(currentQuestion);
    } else {
const correctCount = results.filter(r => r.selected === r.correct).length;
const token = localStorage.getItem("token");

const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
const quizId = Date.now();

history.push({
  id: quizId,
  details: results.map(r => ({
    question: r.question,
    user_answer: r.answers[r.selected],
    correct_answer: r.answers[r.correct],
    isCorrect: r.selected === r.correct
  })),
  score: correctCount,
  date: new Date().toISOString()
});

localStorage.setItem('quizHistory', JSON.stringify(history));

localStorage.setItem("selectedQuiz", JSON.stringify({
  details: results.map(r => ({
    question: r.question,
    user_answer: r.answers[r.selected],
    correct_answer: r.answers[r.correct],
    isCorrect: r.selected === r.correct
  })),
  score: correctCount,
  date: new Date().toISOString(),
  id: quizId
}));


if (token) {
  fetch("/api/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
body: JSON.stringify({
  score: correctCount,
  details: results.map(r => ({
    question: r.question,
    user_answer: r.answers[r.selected],
    correct_answer: r.answers[r.correct],
    isCorrect: r.selected === r.correct
  }))
})
  }).then(res => res.json())
    .then(data => {
      console.log("Score saved:", data);
    }).catch(err => {
      console.error("Error saving score:", err);
    });
}


window.location.href = `results.html?id=${quizId}`;

    }
  }, 1500);
}
