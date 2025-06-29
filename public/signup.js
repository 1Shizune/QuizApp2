document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      window.location.href = "main.html";
    } 
    else {
      alert("Signup failed: " + data.message);
    }
  } 
  catch (err) {
    alert("Signup error");
    console.error(err);
  }
});