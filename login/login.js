/* =========================
LOGIN FORM ELEMENTS
========================= */

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("remember");

/* =========================
ON PAGE LOAD
========================= */

window.addEventListener("load", () => {
  // Load saved email
  const savedEmail = localStorage.getItem("savedEmail");

  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMe.checked = true;
  }

  // Initialize Google Sign-In
  if (
    typeof google !== "undefined" &&
    document.getElementById("google-signin-button")
  ) {
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: "300",
      }
    );
  }
});

/* =========================
LOGIN FORM SUBMIT
========================= */

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validate empty fields
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Remember me logic
  if (rememberMe.checked) {
    localStorage.setItem("savedEmail", email);
  } else {
    localStorage.removeItem("savedEmail");
  }

  try {
    const response = await fetch(
      "https://tax-system-backend.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem("currentUser", JSON.stringify(data.data));

      alert("Login successful!");

      window.location.href = "../dashboard/index.html";
    } else {
      alert(data.message || "Invalid email or password.");
    }
  } catch (error) {
    console.error("Login Error:", error);

    alert("Unable to connect to the server. Please try again.");
  }
});

/* =========================
GOOGLE LOGIN CALLBACK
========================= */

function handleGoogleResponse(response) {
  console.log("Google Login Success:", response);

  fetch("https://tax-system-backend.onrender.com/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      credential: response.credential,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem("currentUser", JSON.stringify(data.data));

        window.location.href = "../dashboard/index.html";
      } else {
        alert(data.message || "Google login failed.");
      }
    })
    .catch((error) => {
      console.error("Google Login Error:", error);
      alert("Google login failed.");
    });
}
