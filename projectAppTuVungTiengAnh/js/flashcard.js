document.addEventListener('DOMContentLoaded', () => {
    let vocabList = JSON.parse(localStorage.getItem('vocabList')) || [];
    const flashcardContainer = document.getElementById('flashcardContainer');
    const filterSelect = document.getElementById('filterStatus');

    // Nếu vocab chưa có trạng thái 'learned', thêm mặc định
    vocabList = vocabList.map(vocab => {
        if (vocab.learned === undefined) vocab.learned = false;
        return vocab;
    });

    function renderFlashcards(filter = 'all') {
        flashcardContainer.innerHTML = '';

        const filteredList = vocabList.filter(vocab => {
            if (filter === 'learned') return vocab.learned;
            if (filter === 'notLearned') return !vocab.learned;
            return true;
        });

        if (filteredList.length === 0) {
            flashcardContainer.innerHTML = '<p>Không có từ nào để hiển thị.</p>';
            return;
        }

        filteredList.forEach((vocab, index) => {
            const card = document.createElement('div');
            card.className = 'flashcard' + (vocab.learned ? ' learned' : '');
        
            const pastelClass = 'pastel-' + ((index % 5) + 1);
            card.classList.add(pastelClass);
        
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">${vocab.word}</div>
                    <div class="card-back">
                        <p><strong>Nghĩa:</strong> ${vocab.meaning}</p>
                        ${vocab.example ? `<p><em>VD:</em> ${vocab.example}</p>` : ''}
                        <p><small><strong>Chủ đề:</strong> ${vocab.category}</small></p>
                    </div>
                </div>
                <button class="mark-btn">${vocab.learned ? '✅ Đã thuộc' : 'Đánh dấu đã thuộc'}</button>
            `;

            const markBtn = card.querySelector('.mark-btn');
            markBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Không làm lật thẻ
                vocab.learned = !vocab.learned;
                vocabList[index] = vocab;
                localStorage.setItem('vocabList', JSON.stringify(vocabList));
                renderFlashcards(filter);
            });

            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('mark-btn')) {
                    card.classList.toggle('flipped');
                }
            });

            flashcardContainer.appendChild(card);
        });
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            renderFlashcards(filterSelect.value);
        });
    }

    renderFlashcards();
});
