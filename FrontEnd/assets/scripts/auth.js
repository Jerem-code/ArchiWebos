function checkAuth() {
  const token = localStorage.getItem("token");
  const loginLink = document.querySelector('nav li a[href*="login"]');

  if (token) {
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "./index.html";
    });
  }
}

// Exécuter la vérification au chargement de la page
checkAuth();
