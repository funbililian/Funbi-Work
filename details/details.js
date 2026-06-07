const profileType = document.getElementById("profileType");

const employeeFields = document.getElementById("employeeFields");
const freelancerFields = document.getElementById("freelancerFields");
const businessFields = document.getElementById("businessFields");

profileType.addEventListener("change", () => {

    employeeFields.classList.add("hidden");
    freelancerFields.classList.add("hidden");
    businessFields.classList.add("hidden");

    if(profileType.value === "employee"){
        employeeFields.classList.remove("hidden");
    }

    if(profileType.value === "freelancer"){
        freelancerFields.classList.remove("hidden");
    }

    if(profileType.value === "business"){
        businessFields.classList.remove("hidden");
    }

});

document
.getElementById("profileForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    const requiredFields = document.querySelectorAll("[required]");

    for(let field of requiredFields){

        if(!field.value.trim()){

            alert("Please complete all compulsory fields.");

            field.focus();

            return;
        }
    }

    alert("Profile saved successfully!");

    // Redirect to dashboard

    window.location.href = "/dashboard/index.html";

});