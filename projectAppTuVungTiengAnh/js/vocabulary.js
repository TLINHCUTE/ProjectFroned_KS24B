let vocabList = JSON.parse(localStorage.getItem('vocabList')) || [];
let currentPage = 1;
const itemsPerPage = 5;
let editingIndex = null;
let categories = JSON.parse(localStorage.getItem('categories')) || [];

// Đồng bộ categories từ categoryList nếu có
const storedCategoryList = JSON.parse(localStorage.getItem('categoryList'));
if (storedCategoryList && Array.isArray(storedCategoryList)) {
    categories = storedCategoryList.map(cat => cat.name);
    localStorage.setItem('categories', JSON.stringify(categories));
}

document.addEventListener('DOMContentLoaded', function () {
    let openAddVocabModalBtn = document.getElementById('openAddVocabModalBtn');
    let saveVocabBtn = document.getElementById('saveVocabBtn');
    let searchInput = document.getElementById('searchInput');
    let categoryFilter = document.getElementById('categoryFilter');
    let confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    let cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    if (openAddVocabModalBtn) openAddVocabModalBtn.addEventListener('click', openAddVocabModal);
    if (saveVocabBtn) saveVocabBtn.addEventListener('click', saveVocab);
    if (searchInput) searchInput.addEventListener('input', searchVocabulary);
    if (categoryFilter) categoryFilter.addEventListener('change', filterByCategory);
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', confirmDelete);
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', cancelDelete);

    updateCategoryFilter();
    renderVocabTable();
});

function openAddVocabModal() {
    document.getElementById('addVocabModal').style.display = 'block';
    clearForm();
    document.getElementById('saveVocabBtn').style.display = 'inline-block';
    document.getElementById('deleteVocabBtn').style.display = 'none';
}

function closeVocabModal() {
    document.getElementById('addVocabModal').style.display = 'none';
}

function clearForm() {
    document.getElementById('newWord').value = '';
    document.getElementById('newMeaning').value = '';
    document.getElementById('newCategory').value = '';
    document.getElementById('newExample').value = '';
}

function saveVocab(event) {
    event.preventDefault();
    const word = document.getElementById('newWord').value.trim();
    const meaning = document.getElementById('newMeaning').value.trim();
    const category = document.getElementById('newCategory').value;
    const example = document.getElementById('newExample').value.trim();

    if (word && meaning && category) {
        const newVocab = { word, meaning, category, example };

        if (editingIndex !== null) {
            vocabList[editingIndex] = newVocab;
        } else {
            vocabList.push(newVocab);
        }

        localStorage.setItem('vocabList', JSON.stringify(vocabList));
        renderVocabTable();
        closeVocabModal();
    } else {
        alert("Please fill all fields and select a category.");
    }
}

function updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const newCategorySelect = document.getElementById('newCategory');

    if (categoryFilter) {
        categoryFilter.innerHTML = `<option value="">All Categories</option>`;
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    if (newCategorySelect) {
        newCategorySelect.innerHTML = `<option value="">Select Category</option>`;
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            newCategorySelect.appendChild(option);
        });
    }
}

function renderVocabTable(page = 1) {
    currentPage = page;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedVocab = vocabList.slice(startIndex, startIndex + itemsPerPage);

    const tableBody = document.querySelector('.vocab-table tbody');
    tableBody.innerHTML = '';

    paginatedVocab.forEach((vocab, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vocab.word}</td>
            <td>${vocab.meaning}</td>
            <td>${vocab.category}</td>
            <td>${vocab.example || 'N/A'}</td>
            <td>
                <button onclick="openEditVocabModal(${startIndex + index})">Edit</button>
                <button onclick="openDeleteVocabModal(${startIndex + index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(vocabList.length / itemsPerPage);
    const pageNumberElement = document.querySelector('.page-number');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (!pageNumberElement || !prevBtn || !nextBtn) return;

    pageNumberElement.textContent = currentPage;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    prevBtn.onclick = () => renderVocabTable(currentPage - 1);
    nextBtn.onclick = () => renderVocabTable(currentPage + 1);
}

function searchVocabulary(event) {
    const query = event.target.value.toLowerCase();
    const filteredVocab = vocabList.filter(vocab =>
        vocab.word.toLowerCase().includes(query) ||
        vocab.meaning.toLowerCase().includes(query) ||
        vocab.category.toLowerCase().includes(query) ||
        (vocab.example && vocab.example.toLowerCase().includes(query))
    );
    renderFilteredVocab(filteredVocab);
}

function filterByCategory() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredVocab = selectedCategory
        ? vocabList.filter(vocab => vocab.category === selectedCategory)
        : vocabList;
    renderFilteredVocab(filteredVocab);
}

function renderFilteredVocab(filteredVocab) {
    const tableBody = document.querySelector('.vocab-table tbody');
    tableBody.innerHTML = '';

    filteredVocab.forEach((vocab) => {
        const originalIndex = vocabList.findIndex(item =>
            item.word === vocab.word &&
            item.meaning === vocab.meaning &&
            item.category === vocab.category &&
            item.example === vocab.example
        );

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vocab.word}</td>
            <td>${vocab.meaning}</td>
            <td>${vocab.category}</td>
            <td>${vocab.example || 'N/A'}</td>
            <td>
                <button onclick="openEditVocabModal(${originalIndex})">Edit</button>
                <button onclick="openDeleteVocabModal(${originalIndex})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openEditVocabModal(index) {
    editingIndex = index;
    const vocab = vocabList[index];

    document.getElementById('newWord').value = vocab.word;
    document.getElementById('newMeaning').value = vocab.meaning;
    document.getElementById('newCategory').value = vocab.category;
    document.getElementById('newExample').value = vocab.example || '';

    document.getElementById('addVocabModal').style.display = 'block';
    document.getElementById('saveVocabBtn').style.display = 'inline-block';
    document.getElementById('deleteVocabBtn').style.display = 'inline-block';
}

function openDeleteVocabModal(index) {
    editingIndex = index;
    document.getElementById('deleteVocabModal').style.display = 'block';
}

function confirmDelete() {
    if (editingIndex !== null) {
        vocabList.splice(editingIndex, 1);
        localStorage.setItem('vocabList', JSON.stringify(vocabList));
        renderVocabTable(currentPage);
        document.getElementById('deleteVocabModal').style.display = 'none';
        editingIndex = null;
    }
}

function cancelDelete() {
    document.getElementById('deleteVocabModal').style.display = 'none';
}

// Gán các hàm ra window để HTML gọi được
window.searchVocabulary = searchVocabulary;
window.renderPagination = renderPagination;
window.openEditVocabModal = openEditVocabModal;
window.openDeleteVocabModal = openDeleteVocabModal;
window.confirmDelete = confirmDelete;
window.cancelDelete = cancelDelete;
