const Log-inForm = document.getElementById("Log-inForm");

Log-inForm.addEventListener("submit", function(event){

  event.preventDefault();

  const email = document.getElementById("email").value;
 
  const password = document.getElementById("password").value;
  if(

    email === "" ||
    password === "" ||
  ){
    alert("Please fill in all fields.");
    return;
  }

  if(password.length < 6){
    alert("Password must be at least 6 characters.");
    return;
  }
  if(password.incorrect){
    alert("password must be correct");
    return;
  }
 alert("Login Successful!");

Log-inForm.reset();

});
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const rememberMe = document.getElementById("rememberMe");

// Load saved email
window.onload = () => {
    const savedEmail = localStorage.getItem("savedEmail");

    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }
};

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (rememberMe.checked) {
        localStorage.setItem("savedEmail", emailInput.value);
    } else {
        localStorage.removeItem("savedEmail");
    }

    alert("Login successful!");
});
