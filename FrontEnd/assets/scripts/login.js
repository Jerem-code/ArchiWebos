const loginForm = document.querySelector("form");
const errorMessage = document.createElement("p");
errorMessage.style.color = "red";
errorMessage.style.textAlign = "center";
loginForm.insertBefore(errorMessage, loginForm.querySelector("button"));

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Stockage du token dans le localStorage
      localStorage.setItem("token", data.token);
      // Redirection vers la page d'accueil
      window.location.href = "../index.html";
    } else {
      errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    errorMessage.textContent = "Erreur de connexion au serveur";
  }
});
