let editingIndex = null; // Declare globally

// Wait for the DOM to be fully loaded before executing any JavaScript
document.addEventListener("DOMContentLoaded", () => {
    let categoryTableBody = document.querySelector("tbody");
    let addCategoryBtn = document.getElementById("openAddCategoryModalBtn");
    let searchInput = document.querySelector(".search-bar");
    let prevBtn = document.querySelector(".prev-btn");
    let nextBtn = document.querySelector(".next-btn");
    let pageNumberDisplay = document.querySelector(".page-number");

    let addCategoryModal = document.getElementById("addCategoryModal");
    let deleteCategoryModal = document.getElementById("deleteCategoryModal");
    let confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    let cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    let saveBtn = document.getElementById("saveCategoryBtn");
    let deleteBtn = document.getElementById("deleteCategoryBtn");

    let itemsPerPage = 5;
    let currentPage = 1;
    let searchKeyword = "";

    function loadCategoryList() {
        const saved = localStorage.getItem("categoryList");
        if (saved) {
            return JSON.parse(saved);
        } else {
            const defaultCategories = [
                { name: "Animals", description: "Vocabulary related to animals and wildlife." },
                { name: "Foods", description: "Vocabulary related to food, dishes, and ingredients." },
                { name: "Languages", description: "Vocabulary related to different languages and linguistic terms." },
                { name: "Science", description: "Vocabulary related to science, research, and experiments." },
                { name: "Arts", description: "Vocabulary related to visual arts, music, and literature." },
                { name: "Sports", description: "Vocabulary related to sports and activities." },
                { name: "Music", description: "Vocabulary related to music genres and instruments." },
                { name: "Literature", description: "Vocabulary related to literature, books, and writing." },
                { name: "Technology", description: "Vocabulary related to technology, gadgets, and IT." },
                { name: "History", description: "Vocabulary related to historical events and periods." }
            ];
            localStorage.setItem("categoryList", JSON.stringify(defaultCategories));
            return defaultCategories;
        }
    }

    let categoryList = loadCategoryList();

    function saveCategoryList() {
        localStorage.setItem("categoryList", JSON.stringify(categoryList));
    }

    function openModal() {
        addCategoryModal.style.display = "flex";
        addCategoryModal.removeAttribute("inert");
        document.body.classList.add("body-no-scroll");
        document.getElementById("newCategoryName").focus();
    }

    function closeModal() {
        addCategoryModal.style.display = "none";
        addCategoryModal.setAttribute("inert", "true");
        document.body.classList.remove("body-no-scroll");
    }

    // ⭐ Sửa đây: đưa openDeleteModal ra global
    window.openDeleteModal = function(index) {
        deleteCategoryModal.style.display = "flex";
        deleteCategoryModal.setAttribute("aria-hidden", "false");
        editingIndex = index;
    };

    function closeDeleteModal() {
        deleteCategoryModal.style.display = "none";
        deleteCategoryModal.setAttribute("aria-hidden", "true");
        editingIndex = null;
    }

    function resetModal() {
        document.getElementById("newCategoryName").value = "";
        document.getElementById("newCategoryDesc").value = "";
        saveBtn.textContent = "Save Category";
        deleteBtn.style.display = "none";
    }

    function filterCategories() {
        return categoryList.filter(cat =>
            cat.name.toLowerCase().includes(searchKeyword) ||
            cat.description.toLowerCase().includes(searchKeyword)
        );
    }

    function renderTable() {
        const filteredList = filterCategories();
        categoryTableBody.innerHTML = "";

        const start = (currentPage - 1) * itemsPerPage;
        const paginated = filteredList.slice(start, start + itemsPerPage);

        if (paginated.length === 0) {
            categoryTableBody.innerHTML = `<tr><td colspan="3">No categories found.</td></tr>`;
        } else {
            paginated.forEach((cat, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>
                        <a href="#" class="category-link" data-category="${cat.name}">
                            ${cat.name}
                        </a>
                    </td>
                    <td>${cat.description}</td>
                    <td>
                        <button class="edit-btn" onclick="editCategory(${index})">Edit</button>
                        <button class="delete-btn" onclick="openDeleteModal(${index})">Delete</button>
                    </td>
                `;
                categoryTableBody.appendChild(row);
            });
        }

        if (pageNumberDisplay) {
            pageNumberDisplay.textContent = currentPage;
        }

        const totalPages = Math.ceil(filteredList.length / itemsPerPage);
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // ⭐ editCategory cũng đưa ra global
    window.editCategory = function(index) {
        const cat = categoryList[index];
        document.getElementById("newCategoryName").value = cat.name;
        document.getElementById("newCategoryDesc").value = cat.description;

        openModal();
        saveBtn.textContent = "Update Category";
        deleteBtn.style.display = "inline-block";
    };

    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            const name = document.getElementById("newCategoryName").value.trim();
            const description = document.getElementById("newCategoryDesc").value.trim();

            if (!name || !description) {
                alert("Please fill in all fields.");
                return;
            }

            const newEntry = { name, description };

            if (editingIndex !== null) {
                categoryList[editingIndex] = newEntry;
            } else {
                categoryList.push(newEntry);
            }

            saveCategoryList();
            closeModal();
            resetModal();
            renderTable();
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (editingIndex !== null) {
                categoryList.splice(editingIndex, 1);
                saveCategoryList();
                renderTable();
                closeDeleteModal();
            }
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", () => {
            closeDeleteModal();
        });
    }

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener("click", () => {
            resetModal();
            openModal();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchKeyword = e.target.value.toLowerCase();
            currentPage = 1;
            renderTable();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(filterCategories().length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
    }

    window.addEventListener("click", function(event) {
        if (event.target === addCategoryModal) {
            closeModal();
        }
    });

    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("category-link")) {
            const selectedCategory = e.target.getAttribute("data-category");
            localStorage.setItem("selectedCategory", selectedCategory);
            window.location.href = "vocabulary.html";
        }
    });

    renderTable();
});
