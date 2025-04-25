document.addEventListener("DOMContentLoaded", () => {
    const vocabTableBody = document.querySelector("tbody");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const pageNumberDisplay = document.querySelector(".page-number");
    const itemsPerPage = 5;
    let currentPage = 1;
    let searchKeyword = "";
    let editingIndex = null;

    function loadVocabList() {
        const saved = localStorage.getItem("vocabList");
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

    const addVocabModal = document.getElementById("addVocabModal");

    function openModal() {
        addVocabModal.style.display = "flex";
        document.body.classList.add("body-no-scroll");
    }

    function closeModal() {
        addVocabModal.style.display = "none";
        document.body.classList.remove("body-no-scroll");
    }

    window.addEventListener("click", (e) => {
        if (e.target === addVocabModal) closeModal();
    });

    function renderTable() {
        vocabTableBody.innerHTML = "";
        const filteredList = vocabList.filter(item => 
            item.word.toLowerCase().includes(searchKeyword) ||
            item.meaning.toLowerCase().includes(searchKeyword) ||
            item.category.toLowerCase().includes(searchKeyword) ||
            item.example.toLowerCase().includes(searchKeyword)
        );
        const start = (currentPage - 1) * itemsPerPage;
        const paginated = filteredList.slice(start, start + itemsPerPage);

        if (paginated.length === 0) {
            vocabTableBody.innerHTML = `<tr><td colspan="5">No vocabulary entries found.</td></tr>`;
        } else {
            paginated.forEach((item) => {
                const row = document.createElement("tr");
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
        const item = vocabList[index];
        document.getElementById("newWord").value = item.word;
        document.getElementById("newMeaning").value = item.meaning;
        document.getElementById("newCategory").value = item.category;
        document.getElementById("newExample").value = item.example;

        openModal();
        editingIndex = index;
        document.getElementById("saveVocabBtn").textContent = "Update Word";
        document.getElementById("deleteVocabBtn").style.display = "inline-block";
        document.getElementById("deleteVocabBtn").onclick = () => deleteVocab(index);
    };

    function deleteVocab(index) {
        vocabList.splice(index, 1);
        saveVocabList();
        renderTable();
    }

    document.getElementById("saveVocabBtn").onclick = () => {
        const word = document.getElementById("newWord").value.trim();
        const meaning = document.getElementById("newMeaning").value.trim();
        const category = document.getElementById("newCategory").value.trim();
        const example = document.getElementById("newExample").value.trim();

        if (word && meaning && category) {
            if (editingIndex !== null) {
                vocabList[editingIndex] = { word, meaning, category, example };
                editingIndex = null;
            } else {
                vocabList.push({ word, meaning, category, example });
            }
            saveVocabList();
            renderTable();
            closeModal();
        } else {
            alert("Please fill in at least Word, Meaning, and Category.");
        }
    };

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(vocabList.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    renderTable();
});
