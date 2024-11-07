function initModal() {
  const modal = document.querySelector(".modal");
  const editButton = document.querySelector(".edit-link");
  const closeButton = document.querySelector(".close-modal");

  // Ouvrir la modale
  editButton.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  });

  // Fermer la modale avec le bouton
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  });

  // Fermer la modale en cliquant en dehors
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  });
}

// Initialiser la modale une fois que le DOM est chargé
document.addEventListener("DOMContentLoaded", initModal);
