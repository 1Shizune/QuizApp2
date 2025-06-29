fetch('https://opentdb.com/api_category.php')
  .then(res => res.json())
  .then(data => {
    const categorySelect = document.getElementById('category');
    data.trivia_categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  })
  .catch(err => {
    console.error("Failed to load categories:", err);
  });

document.getElementById("startGame").addEventListener("click", () => {
  const category = document.getElementById("category").value;
  const params = new URLSearchParams();
  params.set("numQuestions", 10); // Default
  if (category) params.set("category", category);

  window.location.href = `game.html?${params.toString()}`;
});

document.getElementById("numQuestions").onclick = () => {
  let num = prompt("How many questions do you want? Default is 10.");
  num = parseInt(num);
  if (!num || num <= 0) {
    alert("Please enter a valid positive number.");
    return;
  }

  const category = document.getElementById("category").value;
  const params = new URLSearchParams();
  params.set("numQuestions", num);
  if (category) params.set("category", category);

  window.location.href = `game.html?${params.toString()}`;
};
