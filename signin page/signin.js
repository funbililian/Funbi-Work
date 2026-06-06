const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(event){

  event.preventDefault();

  // INPUT VALUES

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // VALIDATION

  if(
    fullName === "" ||
    email === "" ||
    phone === "" ||
    password === "" ||
    confirmPassword === ""
  ){
    alert("Please fill in all fields.");
    return;
  }

  if(password.length < 6){
    alert("Password must be at least 6 characters.");
    return;
  }

  if(password !== confirmPassword){
    alert("Passwords do not match.");
    return;
  }

  // SUCCESS

  alert("Registration Successful!");

  registerForm.reset();

});
