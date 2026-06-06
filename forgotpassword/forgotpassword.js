const form = document.getElementById("resetForm");
const message = document.getElementById("message");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("email").value;

    if(email.trim() === ""){
        message.style.color = "red";
        message.textContent = "Please enter your email address.";
        return;
    }

    message.style.color = "#00a300";
    message.textContent =
        "Password reset link has been sent to " + email;

    form.reset();
});