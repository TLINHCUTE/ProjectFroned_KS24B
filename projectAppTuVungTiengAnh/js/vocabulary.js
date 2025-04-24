document.addEventListener("DOMContentLoaded", () => {
    let vocabTableBody = document.querySelector("tbody");
    let searchInput = document.querySelector(".search-bar");
    let categoryFilter = document.querySelector(".category-filter");
    let prevBtn = document.querySelector(".prev-btn");
    let nextBtn = document.querySelector(".next-btn");
    let pageNumberDisplay = document.querySelector(".page-number");
    let vocabList = [];
    let currentPage = 1;
    let itemsPerPage = 5;
    // Sample data
    vocabList = [
        { word: "Lion", meaning: "A large wild cat", category: "Animals", example: "The lion roared loudly." },
        { word: "Laptop", meaning: "A portable computer", category: "Technology", example: "She works on her laptop." },
        { word: "Tiger", meaning: "Another big cat", category: "Animals", example: "Tigers are endangered species." },
        { word: "Mouse", meaning: "Computer accessory", category: "Technology", example: "Click with the mouse." },
        { word: "Dog", meaning: "A domestic animal", category: "Animals", example: "Dogs are loyal pets." },
        { word: "Tablet", meaning: "A touch-screen device", category: "Technology", example: "I read books on my tablet." }
    ];
    function renderTable(data) {
        vocabTableBody.innerHTML = "";
        let start = (currentPage - 1) * itemsPerPage;
        let paginated = data.slice(start, start + itemsPerPage);
        paginated.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.word}</td>
                <td>${item.meaning}</td>
                <td>${item.category}</td>
                <td>${item.example}</td>
                <td>
                    <button onclick="editVocab(${index + start})">Edit</button>
                    <button onclick="deleteVocab(${index + start})">Delete</button>
                </td>
            `;
            vocabTableBody.appendChild(row);
        });
        pageNumberDisplay.textContent = currentPage;
    }
    function updateTable() {
        let filtered = vocabList.filter(item =>
            item.word.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        if (categoryFilter.value) {
            filtered = filtered.filter(item => item.category === categoryFilter.value);
        }
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages || 1;
        renderTable(filtered);
    }
    window.editVocab = (index) => {
        const item = vocabList[index];
        const newWord = prompt("Edit word:", item.word);
        const newMeaning = prompt("Edit meaning:", item.meaning);
        const newCategory = prompt("Edit category:", item.category);
        const newExample = prompt("Edit example (optional):", item.example);
        if (newWord) {
            vocabList[index] = {
                word: newWord,
                meaning: newMeaning,
                category: newCategory,
                example: newExample || ""
            };
            updateTable();
        }
    };
    window.deleteVocab = (index) => {
        if (confirm("Are you sure you want to delete this vocabulary?")) {
            vocabList.splice(index, 1);
            updateTable();
        }
    };
    searchInput.addEventListener("input", () => {
        currentPage = 1;
        updateTable();
    });
    categoryFilter.addEventListener("change", () => {
        currentPage = 1;
        updateTable();
    });
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
        }
    });
    nextBtn.addEventListener("click", () => {
        let filtered = vocabList.filter(item =>
            item.word.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchInput.value.toLowerCase())
        ).filter(item => !categoryFilter.value || item.category === categoryFilter.value);
        let totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateTable();
        }
    });
    updateTable();
});
