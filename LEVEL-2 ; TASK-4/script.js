const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value;
        clearErrors();

        if (name === "") {
            showError("nameError", "Name required");
            return;
        }
        if (!validateEmail(email)) {
            showError("emailError", "Enter valid email");
            return;
        }
        if (!validatePassword(password)) {
            showError(
                "passwordError",
                "Use 8 characters with uppercase, number and special character"
            );
            return;
        }
        let user = {
            name,
            email,
            password: btoa(password),
            lastLogin: "Not logged in"
        };
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );
        showToast("Account created successfully");
        setTimeout(() => {
            location.href = "index.html";
        }, 1000);
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let email = document.getElementById("loginEmail").value.trim();
        let password = document.getElementById("loginPassword").value;
        let user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            showToast("Create account first");
            return;
        }

        if (email !== user.email) {
            showError("loginEmailError", "Email not found");
            return;
        }

        if (btoa(password) !== user.password) {
            showError("loginPasswordError", "Incorrect password");
            return;
        }

        user.lastLogin = new Date()
            .toLocaleString();
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "loggedIn",
            "true"
        );
        showToast("Login successful");
        setTimeout(() => {
            location.href = "dashboard.html";
        }, 1000);
    });
}

function loadDashboard() {
    let loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
        window.location.href = "index.html";
        return;
    }

    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "register.html";
        return;
    }

    document.getElementById("welcomeName").innerText = user.name;
    document.getElementById("userName").innerText = user.name;
    document.getElementById("userEmail").innerText = user.email;
    document.getElementById("loginTime").innerText = user.lastLogin || "First Login";
}

function logoutUser() {
    localStorage.removeItem("loggedIn");
    location.href = "index.html";
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}

function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/
        .test(password);
}

function checkStrength() {
    let password = document.getElementById("password").value;
    let bar = document.getElementById("strengthBar");
    let text = document.getElementById("strengthText");
    let score = 0;

    if (password.length >= 8)
        score += 25;
    if (/[A-Z]/.test(password))
        score += 25;
    if (/[0-9]/.test(password))
        score += 25;
    if (/[!@#$%^&*]/.test(password))
        score += 25;
    bar.style.width = score + "%";
    if (score < 50)
        text.innerText = "Weak Password";
    else if (score < 100)
        text.innerText = "Medium Password";
    else
        text.innerText = "Strong Password";
}

function togglePassword(id) {
    let field = document.getElementById(id);
    field.type =
        field.type === "password"
            ?
            "text"
            :
            "password";
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );
}

window.onload = function () {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    }
}

function showError(id, message) {
    document.getElementById(id)
        .innerText = message;
}

function clearErrors() {
    document.querySelectorAll(".error")
        .forEach(e => e.innerText = "");
}

function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}