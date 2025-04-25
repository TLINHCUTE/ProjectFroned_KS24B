document.addEventListener("DOMContentLoaded", function () {
    // Ensure modal is hidden on page load
    const addVocabModal = document.getElementById("addVocabModal");
    addVocabModal.style.display = "none";

    const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    const isLoginPage = window.location.pathname.includes("login.html");

    // Redirect logged-in users away from login page
    if (currentUser && isLoginPage) {
        if (currentUser.role === "admin") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "home.html";
        }
        return;
    }

    // Auto-fill email for pending login, if available
    const pendingEmail = localStorage.getItem("pendingLoginEmail");
    const loginInput = document.getElementById("loginUsername");
    if (pendingEmail && loginInput) {
        loginInput.value = pendingEmail;
        localStorage.removeItem("pendingLoginEmail");
    }

    // Toggle password visibility
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const passwordInput = document.getElementById("password");
            if (passwordInput) {
                if (passwordInput.type === "password") {
                    passwordInput.type = "text";
                    this.textContent = "Ẩn mật khẩu";
                } else {
                    passwordInput.type = "password";
                    this.textContent = "Hiện mật khẩu";
                }
            }
        });
    }

    // Add event listener to logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            const confirmLogout = confirm("Bạn có chắc chắn muốn đăng xuất?");
            if (confirmLogout) {
                localStorage.removeItem("loggedInUser");
                window.location.href = "login.html";
            }
        });
    }
});

// Functionality to ensure the modal opens only when triggered
function openAddVocabularyModal() {
    const addVocabModal = document.getElementById("addVocabModal");
    addVocabModal.style.display = "flex"; // Show modal when explicitly called
    document.body.classList.add("body-no-scroll"); // Prevent scrolling on the background
}

function closeAddVocabularyModal() {
    const addVocabModal = document.getElementById("addVocabModal");
    addVocabModal.style.display = "none"; // Hide modal explicitly
    document.body.classList.remove("body-no-scroll"); // Re-enable background scrolling
}

// Example function to trigger opening the modal
document.getElementById("openAddVocabModalBtn").addEventListener("click", function () {
    openAddVocabularyModal();
});

window.addEventListener("click", function (event) {
    const addVocabModal = document.getElementById("addVocabModal");
    if (event.target === addVocabModal) {
        closeAddVocabularyModal();
    }
});
