// ---------- 0. déclare les variables ----------
const serverAPI = 'http://localhost:5678'; // URL de l'API

const gallery = document.querySelector('.gallery');
const filterContainer = document.querySelector('.filter-buttons');
const modal = document.getElementById("modal");
const modalGallery = document.querySelector(".modal-gallery");
const closeModalBtn = document.querySelector(".close-btn");
const openModalBtn = document.getElementById("openModal");

// ---------- 1. récupére et affiche les projets ----------
function fetchWorksAndCategories() {
    Promise.all([
        fetch(`${serverAPI}/api/works`).then(res => res.json()),
        fetch(`${serverAPI}/api/categories`).then(res => res.json())
    ]).then(([works, categories]) => {
        displayWorks(works);
        createFilterButtons(categories, works);
    });
}

function displayWorks(works) {
    gallery.innerHTML = "";
    const fragment = document.createDocumentFragment();

    for (const project of works) {
        const figure = document.createElement('figure');

        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = project.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        fragment.appendChild(figure);
    }

    gallery.appendChild(fragment);
}

// ---------- 2. boutons de filtre ----------
function createFilterButtons(categories, allWorks) {
    filterContainer.innerHTML = "";
    const allBtn = document.createElement('button');
    allBtn.textContent = 'Tous';
    allBtn.classList.add('active');
    allBtn.addEventListener('click', () => {
        setActiveButton(allBtn);
        displayWorks(allWorks);
    });
    filterContainer.appendChild(allBtn);

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

function setActiveButton(activeBtn) {
    document.querySelectorAll('.filter-buttons button').forEach(btn =>
        btn.classList.remove('active')
    );
    activeBtn.classList.add('active');
}

// ---------- 3. affiche de la modale ----------

function openModalWorks(works) {
    modalGallery.innerHTML = "";
    works.forEach(work => {
        const container = document.createElement("div");
        container.classList.add("modal-item");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteBtn.classList.add("delete-button");
        deleteBtn.addEventListener("click", () => deleteWork(work.id, container));

        container.appendChild(img);
        container.appendChild(deleteBtn);
        modalGallery.appendChild(container);
    });

    modal.classList.remove("hidden");
}
// ---------- 5. événements du DOM ----------
openModalBtn.addEventListener("click", (event) => {
    event.preventDefault();
    fetch(`${serverAPI}/api/works`)
        .then(res => res.json())
        .then(data => {
            openModalWorks(data);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    fetchWorksAndCategories();
});

closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});
