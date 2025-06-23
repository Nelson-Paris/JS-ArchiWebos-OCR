// ---------- 0. Déclaration des variables globales ----------
const serverAPI = 'http://localhost:5678';
const token = localStorage.getItem('token');
const gallery = document.querySelector('.gallery');
const filterContainer = document.querySelector('.filter-buttons');
const modal = document.getElementById("modal");
const modalGallery = document.querySelector(".modal-gallery");
const closeModalBtn = document.querySelector(".close-btn");
const openModalBtns = document.querySelectorAll(".open-modal-btn");
const addPhotoBtn = document.querySelector(".addPhotoBtn");
const addPhotoModal = document.getElementById("modal-add-photo");
const backToGalleryBtn = document.getElementById("backToGallery");
const closeAddPhotoModal = document.getElementById("closeAddPhotoModal");
const form = document.getElementById("add-photo-form");
const imageInput = document.getElementById("image");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const previewContainer = document.getElementById("imagePreview");
const uploadZone = document.querySelector(".image-upload-zone");
const icon = uploadZone.querySelector("i");
const button = uploadZone.querySelector("button");
const infoText = uploadZone.querySelector("span");
const validateBtn = form.querySelector("button[type='submit']");
const fileSizeError = document.getElementById("fileSizeError");
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 Mo pour test

// ---------- 1. Récupération et affichage des projets + catégories ----------
function fetchWorksAndCategories() {
    Promise.all([
        fetch(`${serverAPI}/api/works`).then(res => res.json()),
        fetch(`${serverAPI}/api/categories`).then(res => res.json())
    ])
        .then(([works, categories]) => {
            displayWorks(works);
            createFilterButtons(categories, works);
        })
        .catch(error => {
            console.error("Erreur lors du chargement :", error);
            alert("Erreur lors du chargement des projets.");
        });
}

function displayWorks(works) {
    gallery.innerHTML = "";
    works.forEach(project => {
        const figure = document.createElement('figure');
        figure.innerHTML = `
      <img src="${project.imageUrl}" alt="${project.title}">
      <figcaption>${project.title}</figcaption>`;
        gallery.appendChild(figure);
    });
}

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
    document.querySelectorAll('.filter-buttons button')
        .forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// ---------- 2. Affichage de la modale ----------
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

// ---------- 3. Lien "Ajouter une photo" ----------
if (addPhotoBtn) {
    addPhotoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openAddPhotoForm();
    });
}

document.getElementById("customFileTrigger").addEventListener("click", () => {
    imageInput.click();
});

function openAddPhotoForm() {
    modal.classList.add("hidden");
    addPhotoModal.classList.remove("hidden");

    categorySelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Sélectionner une catégorie";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    categorySelect.appendChild(defaultOption);

    fetch(`${serverAPI}/api/categories`)
        .then(res => res.json())
        .then(categories => {
            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
        });

    backToGalleryBtn.addEventListener("click", () => {
        fetch(`${serverAPI}/api/works`)
            .then(res => res.json())
            .then(data => {
                openModalWorks(data);
                addPhotoModal.classList.add("hidden");
            });
    });

    validateForm();
}

// ---------- 4. Gestion du formulaire + validation + envoi ----------
function validateForm() {
    const file = imageInput.files[0];
    const title = titleInput.value.trim();
    const category = categorySelect.value;

    const isValid = file && file.size <= MAX_FILE_SIZE && title && category;
    validateBtn.disabled = !isValid;
    validateBtn.classList.toggle("disabled", !isValid);
}

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file && file.size > MAX_FILE_SIZE) {
        fileSizeError.classList.remove("hidden");
        resetImagePreview();
        imageInput.value = "";
        validateForm();
        return;
    } else {
        fileSizeError.classList.add("hidden");
    }

    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="Aperçu">`;
            previewContainer.classList.remove("hidden");
            icon.style.display = "none";
            button.style.display = "none";
            infoText.style.display = "none";
        };
        reader.readAsDataURL(file);
    } else {
        resetImagePreview();
    }
    validateForm();
});

titleInput.addEventListener("input", validateForm);
categorySelect.addEventListener("change", validateForm);

function resetImagePreview() {
    previewContainer.innerHTML = "";
    previewContainer.classList.add("hidden");
    icon.style.display = "block";
    button.style.display = "inline-block";
    infoText.style.display = "block";
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = imageInput.files[0];
    const title = titleInput.value.trim();
    const category = categorySelect.value;

    if (!file || !title || !category) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    fetch(`${serverAPI}/api/works`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })
        .then(res => {
            if (!res.ok) throw new Error("Erreur lors de l'envoi");
            return res.json();
        })
        .then(() => {
            fetchWorksAndCategories();
            return fetch(`${serverAPI}/api/works`);
        })
        .then(res => res.json())
        .then(data => openModalWorks(data))
        .catch(err => {
            console.error("Erreur lors de l'ajout de la photo :", err);
            alert("Erreur lors de l’ajout de la photo.");
        });

    form.reset();
    resetImagePreview();
    validateBtn.disabled = true;
    validateBtn.classList.add("disabled");
});

// ---------- 5. DOM Ready ----------
document.addEventListener("DOMContentLoaded", () => {
    fetchWorksAndCategories();

    openModalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            fetch(`${serverAPI}/api/works`)
                .then(res => res.json())
                .then(data => openModalWorks(data));
        });
    });

    if (token) {
        document.querySelectorAll(".edition-ui").forEach(el => {
            el.style.display = el.tagName.toLowerCase() === "div" ? "flex" : "inline-flex";
        });
    }

    closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
});

if (closeAddPhotoModal && addPhotoModal) {
    closeAddPhotoModal.addEventListener("click", () => {
        addPhotoModal.classList.add("hidden");
    });
}