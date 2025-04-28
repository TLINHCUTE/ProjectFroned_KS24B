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

        // Kiểm tra thông tin nhập
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

        // Lưu thông tin người dùng vào localStorage
        const userData = { firstName, lastName, email, password };
        localStorage.setItem("registeredUser", JSON.stringify(userData));

        // Hiển thị thông báo thành công và chuyển hướng đến login.html
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

        // Lấy thông tin người dùng đã đăng ký từ localStorage
        const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

        // Kiểm tra thông tin nhập
        if (!email || !password) {
            message.textContent = "Vui lòng nhập đầy đủ thông tin!";
            return;
        }

        if (!registeredUser || registeredUser.email !== email || registeredUser.password !== password) {
            message.textContent = "Email hoặc mật khẩu không đúng!";
            return;
        }

        // Lưu trạng thái đăng nhập
        localStorage.setItem("loggedInUser", JSON.stringify(registeredUser));

        // Hiển thị thông báo thành công & chuyển hướng
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
            logoutBtn.style.display = "block"; // Hiển thị nút đăng xuất nếu người dùng đã đăng nhập
            logoutBtn.addEventListener("click", function () {
                logout();
            });
        }
    }

    // Đăng xuất tài khoản
    function logout() {
        localStorage.removeItem("loggedInUser"); // Xóa trạng thái đăng nhập
        alert("Bạn đã đăng xuất thành công!");
        window.location.href = "login.html"; // Chuyển hướng về trang đăng nhập
    }

    // Kiểm tra trạng thái đăng nhập mỗi khi trang tải
    checkLoginStatus();
});
