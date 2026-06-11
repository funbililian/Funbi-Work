const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Get input values
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Check empty fields
  if (!fullName || !email || !phone || !password || !confirmPassword) {
    console.log("Please fill in all fields.");
    return;
  }

  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const passwordError = document.getElementById("passwordError");
  const form = document.getElementById("signupForm");

  function validatePasswords() {
    if (confirmPassword.value === "") {
      passwordError.textContent = "";
      return;
    }

    if (password.value !== confirmPassword.value) {
      passwordError.textContent = "Passwords do not match!";
      passwordError.style.color = "red";
    } else {
      passwordError.textContent = "Passwords match!";
      passwordError.style.color = "green";
    }
  }

  password.addEventListener("input", validatePasswords);
  confirmPassword.addEventListener("input", validatePasswords);

  form.addEventListener("submit", function (e) {
    if (password.value !== confirmPassword.value) {
      e.preventDefault();
      alert("Passwords do not match!");
    }
  });

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    console.log("Please enter a valid email address.");
    return;
  }

  // Password validation
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordPattern.test(password)) {
    alert(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
    );
    return;
  }

  // Confirm password
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch(
      "https://tax-system-backend.onrender.com/api/auth/sign-in",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
        }),
      },
    );

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Account created successfully!");

      // Store returned user data if needed
      if (data.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      registerForm.reset();

      // Redirect to login page
      window.location.href = "/login/index.html";
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (error) {
    console.error("Registration Error:", error);
    alert("Unable to connect to the server. Please try again later.");
  }
});
