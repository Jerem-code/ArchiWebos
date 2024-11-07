function initModal() {
  const modal = document.querySelector(".modal");
  const editButton = document.querySelector(".edit-link");
  const closeButton = document.querySelector(".close-modal");

  // Ouvrir la modale
  editButton.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    displayModalGallery();
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

  const addPhotoBtn = document.querySelector(".add-photo-btn");
  const backButton = document.querySelector(".back-button");

  addPhotoBtn.addEventListener("click", showFormView);
  backButton.addEventListener("click", showGalleryView);

  initAddWorkForm();
}

async function displayModalGallery() {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  try {
    const works = await fetchWorks();

    works.forEach((work) => {
      const figure = document.createElement("figure");
      figure.dataset.id = work.id;

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

      deleteBtn.addEventListener("click", async () => {
        await deleteWork(work.id);
      });

      figure.appendChild(img);
      figure.appendChild(deleteBtn);
      modalGallery.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur lors du chargement de la galerie modale:", error);
  }
}

async function deleteWork(id) {
  const token = localStorage.getItem("token");

  // Ajout de la confirmation
  const confirmation = confirm(
    "Êtes-vous sûr de vouloir supprimer ce travail ?"
  );
  if (!confirmation) {
    return; // Si l'utilisateur annule, on arrête la fonction
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const modalFigure = document.querySelector(
        `.modal-gallery figure[data-id="${id}"]`
      );
      const galleryFigure = document.querySelector(
        `.gallery figure[data-id="${id}"]`
      );

      modalFigure?.remove();
      galleryFigure?.remove();
    } else {
      throw new Error("Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

async function initAddWorkForm() {
  const form = document.querySelector(".add-work-form");
  const imageInput = form.querySelector("#image");
  const titleInput = form.querySelector("#title");
  const categorySelect = form.querySelector("#category");
  const validateBtn = form.querySelector(".validate-btn");
  const imagePreview = document.createElement("img");
  imagePreview.style.display = "none";

  // Charger les catégories
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
  }

  // Prévisualisation de l'image
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        imagePreview.style.maxHeight = "170px";
        const uploadContainer = document.querySelector(
          ".image-upload-container"
        );
        uploadContainer.innerHTML = "";
        uploadContainer.appendChild(imagePreview);
      };
      reader.readAsDataURL(file);
    }
  });

  // Fonction pour vérifier si le formulaire est valide
  function checkFormValidity() {
    const isValid =
      imageInput.files.length > 0 &&
      titleInput.value.trim() !== "" &&
      categorySelect.value !== "";

    validateBtn.classList.toggle("active", isValid);
  }

  // Ajouter les écouteurs d'événements pour chaque champ
  imageInput.addEventListener("change", checkFormValidity);
  titleInput.addEventListener("input", checkFormValidity);
  categorySelect.addEventListener("change", checkFormValidity);

  // Validation du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const work = await response.json();
        // Mettre à jour la galerie
        const works = await fetchWorks();
        displayWorks(works);
        displayModalGallery();
        // Réinitialiser le formulaire et la prévisualisation
        resetForm();
        // Revenir à la galerie
        showGalleryView();
      } else {
        throw new Error("Erreur lors de l'ajout du projet");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      alert("Une erreur est survenue lors de l'ajout du projet");
    }
  });
}

function resetForm() {
  const form = document.querySelector(".add-work-form");
  const uploadContainer = document.querySelector(".image-upload-container");

  // Réinitialiser le formulaire
  form.reset();

  // Réinitialiser le conteneur d'upload
  uploadContainer.innerHTML = `
    <div class="upload-default">
      <i class="fa-regular fa-image"></i>
      <label for="image" class="custom-file-upload">+ Ajouter photo</label>
      <input type="file" id="image" name="image" accept="image/*" required />
      <p>jpg, png : 4mo max</p>
    </div>
  `;
}

// Fonctions pour gérer la navigation entre les vues
function showGalleryView() {
  document.querySelector(".modal-gallery-container").style.display = "block";
  document.querySelector(".modal-form-container").style.display = "none";
}

function showFormView() {
  document.querySelector(".modal-gallery-container").style.display = "none";
  document.querySelector(".modal-form-container").style.display = "block";
}

// Initialiser la modale une fois que le DOM est chargé
initModal();
