// Khởi tạo admin mặc định nếu chưa có
let predefinedAdmin = {
    firstName: "Admin",
    lastName: "Account",
    email: "admin@example.com",
    password: "Admin1234",
    role: "admin"
};
let users = JSON.parse(localStorage.getItem("users") || "[]");
if (!users.some(user => (user.role || "").toLowerCase() === "admin")) {
    users.push(predefinedAdmin);
    localStorage.setItem("users", JSON.stringify(users));
}
// Hàm đăng ký
function register() {
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let message = document.getElementById("registerMessage");
    message.textContent = "";
    if (!firstName || !lastName) {
        message.textContent = "Họ và tên không được để trống.";
        return;
    }
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        message.textContent = "Email không hợp lệ.";
        return;
    }
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
        message.textContent = "Mật khẩu phải chứa chữ hoa, chữ thường và số, có ít nhất 8 ký tự.";
        return;
    }
    if (password !== confirmPassword) {
        message.textContent = "Xác nhận mật khẩu không khớp.";
        return;
    }
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let emailNormalized = email.toLowerCase();
    if (users.some(user => user.email.trim().toLowerCase() === emailNormalized)) {
        message.textContent = "Email đã tồn tại.";
        return;
    }
    users.push({ firstName, lastName, email, password, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("pendingLoginEmail", email);
    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", function () {
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
});
// Hàm đăng nhập
function login() {
    let username = document.getElementById("loginUsername").value.trim().toLowerCase();
    let password = document.getElementById("loginPassword").value;
    let rememberMe = document.getElementById("rememberMe")?.checked || false;
    let message = document.getElementById("loginMessage");
    if (message) message.textContent = "";
    if (!username || !password) {
        message.textContent = "Vui lòng nhập đầy đủ email và mật khẩu.";
        return;
    }
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let user = users.find(u => u.email.toLowerCase() === username && u.password === password);
    if (!user) {
        message.textContent = "Sai thông tin đăng nhập.";
        return;
    }
    if (rememberMe) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
    }
    // Điều hướng theo vai trò
    if (user.role === "admin") {
        window.location.href = "admin-dashboard.html";
    } else {
        window.location.href = "home.html";
    }
}
// Tự động điền email chờ login
document.addEventListener("DOMContentLoaded", function () {
    // Tự động điền email đăng ký
    const pendingEmail = localStorage.getItem("pendingLoginEmail");
    const loginInput = document.getElementById("loginUsername");
    if (pendingEmail && loginInput) {
        loginInput.value = pendingEmail;
        localStorage.removeItem("pendingLoginEmail");
    }
    // Gán sự kiện cho nút đăng xuất nếu tồn tại
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
