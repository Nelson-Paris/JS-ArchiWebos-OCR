/**
 * Comments
 */

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
    document
        .querySelectorAll('.filter-buttons button')
        .forEach(btn => btn.classList.remove('active'));

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

// ---------- 3. affiche de la function delete ----------
function deleteWork(workId, elementToRemove) {
    const confirmDelete = confirm("Voulez vous supprimer définitivement le projet ?");
    if (!confirmDelete) return;

    fetch(`${serverAPI}/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(res => {
            if (res.ok) {
                elementToRemove.remove();
                alert("Projet supprimé avec succès.");
            } else {
                alert("Échec de la suppression.");
            }

            fetchWorksAndCategories();
            fetch(`${serverAPI}/api/works`)
                .then(res => res.json())
                .then(data => openModalWorks(data));
        });
}

// ---------- 3. créer le form ----------
const addPhotoBtn = document.querySelector(".addPhotoBtn");
const modalTitle = document.querySelector(".modalTitle")
addPhotoBtn.addEventListener("click", () => {
    openAddPhotoForm();
});

function openAddPhotoForm() {
    addPhotoBtn.classList.add("hidden");
    modalTitle.classList.add("hidden");
    modalGallery.innerHTML = `
    <form id="add-photo-form" class="add-photo-form">
        <label for="image">Image</label>
        <input type="file" name="image" id="image" accept="image/*" required>
        <div id="image-preview" class="image-preview"></div>

        <label for="title">Titre</label>
        <input type="text" name="title" id="title" required>

        <label for="category">Catégorie</label>
        <select name="category" id="category" required></select>

        <div class="form-buttons">
            <button type="submit">Valider</button>
            <button type="button" id="backToGallery">x</button>
        </div>
    </form>
`;


    fetch(`${serverAPI}/api/categories`)
        .then(res => res.json())
        .then(categories => {
            const select = document.getElementById("category");
            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        });


    document.getElementById("backToGallery").addEventListener("click", () => {
        fetch(`${serverAPI}/api/works`)
            .then(res => res.json())
            .then(data => openModalWorks(data));
    });


    const form = document.getElementById("add-photo-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        submitNewPhoto();
    });
}


// ---------- 3. affiche de la modale ajout projet ----------
function submitNewPhoto() {
    const form = document.getElementById("add-photo-form");
    const formData = new FormData();

    const image = document.getElementById("image").files[0];
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;

    if (!image || !title || !category) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    fetch(`${serverAPI}/api/works`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error("Erreur lors de l'envoi.");
        })
        .then(() => {

            fetchWorksAndCategories();
            fetch(`${serverAPI}/api/works`)
                .then(res => res.json())
                .then(data => openModalWorks(data));
        })
        .catch(err => {
            alert(err.message);
        });
    form.reset();
}

// ---------- 5. événements du DOM ----------
openModalBtn.addEventListener("click", (event) => {
    event.preventDefault();
    fetch(`${serverAPI}/api/works`)
        .then(res => res.json())
        .then(data => openModalWorks(data));
});

document.addEventListener('DOMContentLoaded', () => fetchWorksAndCategories());
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.add("hidden");
});

document.addEventListener("")