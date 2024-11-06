// Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    console.log("Travaux récupérés depuis l'API :", works);
    return works;
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux:", error);
  }
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // On vide la galerie existante

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Initialisation immédiate de la galerie
(async function initGallery() {
  const works = await fetchWorks();
  if (works) {
    displayWorks(works);
  }
})();
