let editingIndex = null;
let itemsPerPage = 5;
let currentPage = 1;
let searchKeyword = "";

document.addEventListener("DOMContentLoaded", () => {
    let categoryTableBody = document.querySelector("tbody");
    let addCategoryBtn = document.getElementById("openAddCategoryModalBtn");
    let searchInput = document.querySelector(".search-bar");
    let prevBtn = document.querySelector(".prev-btn");
    let nextBtn = document.querySelector(".next-btn");
    let pageNumbersContainer = document.querySelector(".page-numbers");

    let addCategoryModal = document.getElementById("addCategoryModal");
    let deleteCategoryModal = document.getElementById("deleteCategoryModal");
    let confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    let cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    let saveBtn = document.getElementById("saveCategoryBtn");
    let deleteBtn = document.getElementById("deleteCategoryBtn");

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
            const defaultCategoryNames = defaultCategories.map(cat => cat.name);
            localStorage.setItem("categories", JSON.stringify(defaultCategoryNames));
            return defaultCategories;
        }
    }

    let categoryList = loadCategoryList();

    function saveCategoryList() {
        localStorage.setItem("categoryList", JSON.stringify(categoryList));
        const categories = categoryList.map(cat => cat.name);
        localStorage.setItem("categories", JSON.stringify(categories));
    }

    function openModal() {
        addCategoryModal.style.display = "flex";
        document.body.classList.add("body-no-scroll");
        document.getElementById("newCategoryName").focus();
    }

    function closeModal() {
        addCategoryModal.style.display = "none";
        document.body.classList.remove("body-no-scroll");
    }

    window.openDeleteModal = function(index) {
        deleteCategoryModal.style.display = "flex";
        editingIndex = index;
    };

    function closeDeleteModal() {
        deleteCategoryModal.style.display = "none";
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

    function renderPagination(totalPages) {
        pageNumbersContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className = "page-number-btn";
            if (i === currentPage) {
                btn.classList.add("active");
            }
            btn.addEventListener("click", () => {
                currentPage = i;
                renderTable();
            });
            pageNumbersContainer.appendChild(btn);
        }
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
                const realIndex = start + index;
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><a href="#" class="category-link" data-category="${cat.name}">${cat.name}</a></td>
                    <td>${cat.description}</td>
                    <td>
                        <button class="edit-btn" onclick="editCategory(${realIndex})">Edit</button>
                        <button class="delete-btn" onclick="openDeleteModal(${realIndex})">Delete</button>
                    </td>`;
                categoryTableBody.appendChild(row);
            });
        }

        const totalPages = Math.ceil(filteredList.length / itemsPerPage);
        renderPagination(totalPages);
    }

    window.editCategory = function(index) {
        const cat = categoryList[index];
        editingIndex = index;
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
                return;
            }

            const newEntry = { name, description };

            if (editingIndex !== null) {
                categoryList[editingIndex] = newEntry;
            } else {
                categoryList.push(newEntry);
            }

            saveCategoryList();
            editingIndex = null;
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
                editingIndex = null;
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

    if (prevBtn) prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    if (nextBtn) nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filterCategories().length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    window.addEventListener("click", function(event) {
        if (event.target === addCategoryModal) {
            closeModal();
        }
    });
    document.getElementById("saveCategoryBtn").addEventListener("click", function () {
        const name = document.getElementById("newCategoryName").value.trim();
        const desc = document.getElementById("newCategoryDesc").value.trim();
        const message = document.getElementById("categoryMessage");
    
        if (!name || !desc) {
            message.textContent = "Vui lòng nhập đầy đủ tên và mô tả danh mục!";
            return;
        }
    
        message.textContent = ""; // Xóa thông báo nếu hợp lệ
    
        // Thêm hoặc cập nhật danh mục ở đây...
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
