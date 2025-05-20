// Selection de la gallery dans le DOM
const gallery = document.querySelector('.gallery'); 
const filterContainer = document.querySelector('.filter-buttons');

let allWorks = [];
let categories = [];

// Fonction pour récupérer les projets depuis le backend
async function fetchWorks() {
    await fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            console.log('1')

            allWorks = data;
            displayWorks(allWorks); //  tous les projets
        });
    console.log('1')
}

// Fonction pour récupérer les catégories depuis le backend
function fetchCategories() {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(data => {
            categories = data;
            createFilterButtons(categories); //  boutons filtres
        });
}

// Affiche dynamiquement les projets dans la galerie à modifier
function displayWorks(works) {
    gallery.innerHTML = ""; // Vide la galerie

    const bWorks = document.createDocumentFragment();

    for (const project of works) {
        const figure = document.createElement('figure');git 

        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = project.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        bWorks.appendChild(figure);
    }

    gallery.appendChild(bWorks); // Une seule opération DOM
}





// Création des boutons de filtres dynamiquement
function createFilterButtons(categories) {
    //  bouton "Tous"
    const allBtn = document.createElement('button');
    allBtn.textContent = 'Tous';
    allBtn.classList.add('active');
    allBtn.addEventListener('click', () => {
        setActiveButton(allBtn);
        displayWorks(allWorks);
    });
    filterContainer.appendChild(allBtn);

    //  chaque catégorie
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category.name;
        btn.addEventListener('click', () => {
            setActiveButton(btn);
            const filtered = allWorks.filter(work => work.categoryId === category.id);
            displayWorks(filtered);
        });
        filterContainer.appendChild(btn);
    });
}

// change le style quand il est actif
function setActiveButton(activeBtn) {
    document.querySelectorAll('.filter-buttons button').forEach(btn =>
        btn.classList.remove('active')
    );
    activeBtn.classList.add('active');
}

// attends que le dom soit chargé
document.addEventListener('DOMContentLoaded', () => {
    fetchWorks();
    console.log('coucou')
    fetchCategories();
});

// préparation pour les étapes 2.1 et 2.2