function checkAuth() {
  const token = localStorage.getItem("token");
  const loginLink = document.querySelector('nav li a[href*="login"]');
  const portfolioTitle = document.querySelector("#portfolio h2");

  if (token) {
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      document.body.classList.remove("edit-mode");
      window.location.href = "./index.html";
    });

    const editButton = document.createElement("a");
    editButton.href = "#";
    editButton.className = "edit-link";
    editButton.innerHTML =
      '<i class="fa-regular fa-pen-to-square"></i> modifier';

    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";

    portfolioTitle.parentNode.insertBefore(titleContainer, portfolioTitle);
    titleContainer.appendChild(portfolioTitle);
    titleContainer.appendChild(editButton);

    const editBanner = document.createElement("div");
    editBanner.className = "edit-banner";
    editBanner.style.display = "flex";

    const bannerText = document.createElement("p");
    bannerText.innerHTML =
      '<i class="fa-regular fa-pen-to-square" style="margin-right: 10px;"></i>Mode édition';

    editBanner.appendChild(bannerText);
    document.body.insertBefore(editBanner, document.body.firstChild);

    document.body.classList.add("edit-mode");
  }
}

checkAuth();
