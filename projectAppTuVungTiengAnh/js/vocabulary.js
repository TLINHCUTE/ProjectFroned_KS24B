document.addEventListener("DOMContentLoaded", () => {
    let vocabTableBody = document.querySelector("tbody");
    let prevBtn = document.querySelector(".prev-btn");
    let nextBtn = document.querySelector(".next-btn");
    let pageNumberDisplay = document.querySelector(".page-number");
    let vocabList = [
        { word: "Lion", meaning: "A large wild cat", category: "Animals", example: "The lion roared loudly." },
        { word: "Laptop", meaning: "A portable computer", category: "Technology", example: "She works on her laptop." },
        { word: "Tiger", meaning: "Another big cat", category: "Animals", example: "Tigers are endangered species." },
        { word: "Mouse", meaning: "Computer accessory", category: "Technology", example: "Click with the mouse." },
        { word: "Dog", meaning: "A domestic animal", category: "Animals", example: "Dogs are loyal pets." },
        { word: "Tablet", meaning: "A touch-screen device", category: "Technology", example: "I read books on my tablet." }
    ]
    let currentPage = 1;
    const itemsPerPage = 5;
    function renderTable() {
        vocabTableBody.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const paginated = vocabList.slice(start, start + itemsPerPage);
        if (paginated.length === 0) {
            vocabTableBody.innerHTML = `<tr><td colspan="5">No vocabulary entries available.</td></tr>`;
        } else {
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
            renderTable();
        }
    };
    window.deleteVocab = (index) => {
        if (confirm("Are you sure you want to delete this vocabulary?")) {
            vocabList.splice(index, 1);
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
        const totalPages = Math.ceil(vocabList.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    renderTable();
});
