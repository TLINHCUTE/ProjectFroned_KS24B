document.addEventListener('DOMContentLoaded', () => {
    const vocabList = JSON.parse(localStorage.getItem('vocabList')) || [];
    const quizContainer = document.getElementById('quizContainer');
    const progressBar = document.getElementById('progressBar');
    const resultDisplay = document.getElementById('result');
    const totalQuestions = Math.min(10, vocabList.length);
    let currentQuestion = 0;
    let score = 0;

    if (vocabList.length < 4) {
        quizContainer.innerHTML = "Không đủ từ vựng để tạo bài kiểm tra.";
        return;
    }

    const shuffled = vocabList.sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
    const quizData = shuffled.map(item => ({
        question: `Từ nào có nghĩa là: "${item.meaning}"`,
        correct: item.word,
        options: generateOptions(item.word, vocabList)
    }));

    function generateOptions(correct, list) {
        const options = new Set();
        options.add(correct);
        while (options.size < 4) {
            const rand = list[Math.floor(Math.random() * list.length)].word;
            options.add(rand);
        }
        return Array.from(options).sort(() => 0.5 - Math.random());
    }

    function renderQuestion(index) {
        const data = quizData[index];
        quizContainer.innerHTML = `
            <div class="question">${index + 1}. ${data.question}</div>
            <div class="options">
                ${data.options.map(opt => `<button class="option-btn">${opt}</button>`).join('')}
            </div>
        `;
        progressBar.style.width = `${((index + 1) / totalQuestions) * 100}%`;

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.textContent === data.correct) {
                    btn.classList.add('correct');
                    score++;
                } else {
                    btn.classList.add('incorrect');
                    document.querySelectorAll('.option-btn').forEach(b => {
                        if (b.textContent === data.correct) b.classList.add('correct');
                    });
                }
                setTimeout(() => {
                    currentQuestion++;
                    if (currentQuestion < totalQuestions) {
                        renderQuestion(currentQuestion);
                    } else {
                        showResult();
                    }
                }, 800);
            });
        });
    }

    function showResult() {
        quizContainer.innerHTML = '';
        resultDisplay.innerHTML = `Hoàn thành! Bạn đúng ${score}/${totalQuestions}`;
        saveResult(score, totalQuestions);
        showCongratsModal();  // 👉 Hiển thị modal chúc mừng
    }

    function saveResult(score, total) {
        let quizResults = JSON.parse(localStorage.getItem('quizResults')) || [];
        quizResults.push({ date: new Date().toLocaleString(), score, total });
        localStorage.setItem('quizResults', JSON.stringify(quizResults));
    }

    function showCongratsModal() {
        const modal = document.getElementById("congratsModal");
        if (modal) {
            modal.style.display = "flex";
        }
    }

    renderQuestion(currentQuestion);
});

// Hàm đóng modal chúc mừng (nên nằm trong cùng file hoặc trong thẻ script)
function closeCongratsModal() {
    const modal = document.getElementById("congratsModal");
    if (modal) {
        modal.style.display = "none";
    }
}
