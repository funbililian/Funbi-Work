const loginForm = document.getElementById("Log-inForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");

// Load saved email when page opens
window.addEventListener("load", () => {
    const savedEmail = localStorage.getItem("savedEmail");

    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Check empty fields
    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Strong password validation
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordPattern.test(password)) {
        alert(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return;
    }

    // Remember Me
    if (rememberMe.checked) {
        localStorage.setItem("savedEmail", email);
    } else {
        localStorage.removeItem("savedEmail");
    }


    const validEmail = "user@example.com";
    const validPassword = "Password123!";

    if (email === validEmail && password === validPassword) {
        alert("Login successful!");

        // Redirect to dashboard
        window.location.href ="/dashboard/index.html";
    } else {
        alert("Invalid email or password.");
    }
});