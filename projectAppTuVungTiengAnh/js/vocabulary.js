document.addEventListener("DOMContentLoaded", () => {
    let vocabTableBody = document.querySelector("tbody");
    let prevBtn = document.querySelector(".prev-btn");
    let nextBtn = document.querySelector(".next-btn");
    let pageNumberDisplay = document.querySelector(".page-number");
    let itemsPerPage = 5;
    let currentPage = 1;
    let searchKeyword = "";
    function loadVocabList() {
        let saved = localStorage.getItem("vocabList");
        return saved ? JSON.parse(saved) : [
            { word: "Lion", meaning: "A large wild cat", category: "Animals", example: "The lion roared loudly." },
            { word: "Laptop", meaning: "A portable computer", category: "Technology", example: "She works on her laptop." },
            { word: "Tiger", meaning: "Another big cat", category: "Animals", example: "Tigers are endangered species." },
            { word: "Mouse", meaning: "Computer accessory", category: "Technology", example: "Click with the mouse." },
            { word: "Dog", meaning: "A domestic animal", category: "Animals", example: "Dogs are loyal pets." },
            { word: "Tablet", meaning: "A touch-screen device", category: "Technology", example: "I read books on my tablet." }
        ];
    }
    let vocabList = loadVocabList();
    function saveVocabList() {
        localStorage.setItem("vocabList", JSON.stringify(vocabList));
    }
    document.getElementById("addVocabBtn").addEventListener("click", () => {
        let word = document.getElementById("newWord").value.trim();
        let meaning = document.getElementById("newMeaning").value.trim();
        let category = document.getElementById("newCategory").value.trim();
        let example = document.getElementById("newExample").value.trim();
        if (word && meaning && category) {
            vocabList.push({ word, meaning, category, example });
            saveVocabList();
            currentPage = Math.ceil(vocabList.length / itemsPerPage);
            renderTable();
            document.getElementById("newWord").value = "";
            document.getElementById("newMeaning").value = "";
            document.getElementById("newCategory").value = "";
            document.getElementById("newExample").value = "";
        } else {
            alert("Please fill in at least Word, Meaning, and Category.");
        }
    });
    document.getElementById("searchInput").addEventListener("input", (e) => {
        searchKeyword = e.target.value.trim().toLowerCase();
        currentPage = 1;
        renderTable();
    });
    function renderTable() {
        vocabTableBody.innerHTML = "";
        let filteredList = vocabList.filter(item =>
            item.word.toLowerCase().includes(searchKeyword) ||
            item.meaning.toLowerCase().includes(searchKeyword) ||
            item.category.toLowerCase().includes(searchKeyword) ||
            item.example.toLowerCase().includes(searchKeyword)
        );
        let start = (currentPage - 1) * itemsPerPage;
        let paginated = filteredList.slice(start, start + itemsPerPage);
        if (paginated.length === 0) {
            vocabTableBody.innerHTML = `<tr><td colspan="5">No vocabulary entries found.</td></tr>`;
        } else {
            paginated.forEach((item, index) => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.word}</td>
                    <td>${item.meaning}</td>
                    <td>${item.category}</td>
                    <td>${item.example}</td>
                    <td>
                        <button onclick="editVocab(${vocabList.indexOf(item)})">Edit</button>
                        <button onclick="deleteVocab(${vocabList.indexOf(item)})">Delete</button>
                    </td>
                `;
                vocabTableBody.appendChild(row);
            });
        }
        pageNumberDisplay.textContent = currentPage;
    }
    window.editVocab = (index) => {
        let item = vocabList[index];
        let newWord = prompt("Edit word:", item.word);
        let newMeaning = prompt("Edit meaning:", item.meaning);
        let newCategory = prompt("Edit category:", item.category);
        let newExample = prompt("Edit example (optional):", item.example);
        if (newWord) {
            vocabList[index] = {
                word: newWord,
                meaning: newMeaning,
                category: newCategory,
                example: newExample || ""
            };
            saveVocabList();
            renderTable();
        }
    };
    window.deleteVocab = (index) => {
        if (confirm("Are you sure you want to delete this vocabulary?")) {
            vocabList.splice(index, 1);
            saveVocabList();
            if ((currentPage - 1) * itemsPerPage >= vocabList.length) {
                currentPage = Math.max(1, currentPage - 1);
            }
            renderTable();
        }
    };
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    nextBtn.addEventListener("click", () => {
        let totalPages = Math.ceil(
            vocabList.filter(item =>
                item.word.toLowerCase().includes(searchKeyword) ||
                item.meaning.toLowerCase().includes(searchKeyword) ||
                item.category.toLowerCase().includes(searchKeyword) ||
                item.example.toLowerCase().includes(searchKeyword)
            ).length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    renderTable();
});