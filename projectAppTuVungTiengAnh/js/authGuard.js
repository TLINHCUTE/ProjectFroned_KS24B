(function checkAuth() {
    const userData = localStorage.getItem("loggedInUser") || sessionStorage.getItem("loggedInUser");
    if (!userData) {
        window.location.href = "login.html";
    }
})();
