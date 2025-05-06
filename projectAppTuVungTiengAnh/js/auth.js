document.addEventListener("DOMContentLoaded", function () {
    // Toggle password visibility
    const togglePasswordBtn = document.getElementById("togglePassword");
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener("click", function () {
            const passwordInput = document.getElementById("password");
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            this.textContent = passwordInput.type === "password" ? "Hiện mật khẩu" : "Ẩn mật khẩu";
        });
    }

    // Đăng ký tài khoản
    window.register = function () {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const message = document.getElementById("registerMessage");

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            message.textContent = "Vui lòng điền đầy đủ thông tin!";
            return;
        }

        if (password.length < 6) {
            message.textContent = "Mật khẩu phải có ít nhất 6 ký tự!";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Mật khẩu không khớp!";
            return;
        }

        const userData = { firstName, lastName, email, password };
        localStorage.setItem("registeredUser", JSON.stringify(userData));

        message.style.color = "green";
        message.textContent = "Đăng ký thành công! Chuyển đến trang đăng nhập...";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    };

    // Đăng nhập tài khoản
    window.login = function () {
        const email = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const message = document.getElementById("loginMessage");

        const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

        if (!email || !password) {
            message.textContent = "Vui lòng nhập đầy đủ thông tin!";
            return;
        }

        if (!registeredUser || registeredUser.email !== email || registeredUser.password !== password) {
            message.textContent = "Email hoặc mật khẩu không đúng!";
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(registeredUser));

        message.style.color = "green";
        message.textContent = "Đăng nhập thành công! Đang chuyển hướng...";
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1500);
    };

    // Kiểm tra trạng thái đăng nhập
    function checkLoginStatus() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const logoutBtn = document.getElementById("logoutBtn");

        if (loggedInUser && logoutBtn) {
            logoutBtn.style.display = "block";

            logoutBtn.addEventListener("click", function () {
                const modal = document.getElementById("logoutModal");
                if (modal) {
                    modal.style.display = "flex";
                }

                const confirmBtn = document.getElementById("confirmLogout");
                const cancelBtn = document.getElementById("cancelLogout");

                if (confirmBtn && cancelBtn) {
                    confirmBtn.onclick = function () {
                        logout();
                    };
                    cancelBtn.onclick = function () {
                        modal.style.display = "none";
                    };
                }
            });
        }
    }

    // Đăng xuất tài khoản
    function logout() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }

    checkLoginStatus();
});
