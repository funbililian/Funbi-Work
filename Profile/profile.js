function selectProfile(type){


    // Redirect example

    if(type === "Individual"){

        window.location.href = "/details/index.html";

    }

    if(type === "Business"){

        window.location.href = "details/index.html";

    }

}

function goBack(){

    window.history.back();

}
