const historyList = document.getElementById('history-list');
const token = localStorage.getItem("token");


if (!token) {
  window.location.href = "login.html";
}


fetch('/api/profile', {
  headers: {
    Authorization: token
  }
})
  .then(res => res.json())
  .then(data => {
    const scores = data.scores || [];

    if (scores.length === 0) {
      historyList.textContent = "No past quizzes available to view.";
      return;
    }

    scores.reverse().forEach((entry, index) => {
      const div = document.createElement('div');
      div.className = 'history-entry';

      const time = new Date(entry.date).toLocaleString();
      const correct = entry.score;
      const total = entry.details ? entry.details.length : '?';
      const id = entry._id || `quiz${index}`;

      div.innerHTML = `
        <p><strong>${time}</strong></p>
        <p>Questions: ${total} • Score: ${correct}/${total}</p>
      `;

div.onclick = () => {
  
  localStorage.setItem("selectedQuiz", JSON.stringify(entry));


  window.location.href = `results.html`;
};


      div.style.cursor = 'pointer';
      div.style.borderBottom = '1px solid #ccc';
      div.style.padding = '10px 0';

      historyList.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Failed to load history:", err);
    historyList.textContent = "Error loading quiz history.";
  });



document.getElementById('reset-history').onclick = () => {
  if (confirm("Are you sure you want to delete your quiz history?")) {
    fetch('/api/reset-history', {
      method: 'POST',
      headers: {
        Authorization: token
      }
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          alert("Quiz History Has Been Cleared!");
          window.location.reload();
        } else {
          alert("Failed to clear history.");
        }
      });
  }
};
