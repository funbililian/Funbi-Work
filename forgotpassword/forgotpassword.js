const form = document.getElementById("resetForm");
const message = document.getElementById("message");

const API_BASE = "https://tax-system-backend.onrender.com/api/auth";

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    message.style.color = "red";
    message.textContent = "Please enter your email address.";
    return;
  }

  message.style.color = "#555";
  message.textContent = "Sending reset link...";

  try {
    const res = await fetch(`${API_BASE}/forgot_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    // IMPORTANT: security best practice message
    message.style.color = "#00a300";
    message.textContent = "If this email exists, a reset link has been sent.";

    form.reset();
  } catch (error) {
    message.style.color = "red";
    message.textContent = error.message;
  }
});
