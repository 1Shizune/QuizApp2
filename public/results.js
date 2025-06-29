const quiz2 = JSON.parse(localStorage.getItem("selectedQuiz"));
console.log("Loaded quiz data from localStorage:", quiz2);

const container = document.getElementById("results-container");



const quiz = JSON.parse(localStorage.getItem("selectedQuiz"));

if (!quiz || !quiz.details) {
  container.innerHTML = "<p>No quiz data available.</p>";
} else {
  quiz.details.forEach((q, index) => {
    const resultDiv = document.createElement("div");
    resultDiv.className = "question-result";
    resultDiv.style.borderBottom = "1px solid #ccc";
    resultDiv.style.padding = "10px 0";

    const question = document.createElement("p");
    question.innerHTML = `<strong>Q${index + 1}:</strong> ${q.question}`;

    const yourAnswer = document.createElement("p");
    yourAnswer.innerHTML = `<strong>Your Answer:</strong> ${q.user_answer}`;

    const correctAnswer = document.createElement("p");
    correctAnswer.innerHTML = `<strong>Correct Answer:</strong> ${q.correct_answer}`;

    const verdict = document.createElement("p");
    verdict.style.color = q.isCorrect ? "lightgreen" : "tomato";
    verdict.textContent = q.isCorrect ? "✅ Correct" : "❌ Incorrect";

    resultDiv.appendChild(question);
    resultDiv.appendChild(yourAnswer);
    resultDiv.appendChild(correctAnswer);
    resultDiv.appendChild(verdict);

    container.appendChild(resultDiv);
  });


  const summary = document.createElement("h3");
  summary.textContent = `Final Score: ${quiz.score}/${quiz.details.length}`;
  container.insertBefore(summary, container.firstChild);
}
