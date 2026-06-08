/* =========================
   TAXEASE USER GUIDE JS
   FULL FUNCTIONALITY
========================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       1. COLLAPSIBLE SECTIONS
    ========================= */

    const sections = document.querySelectorAll("main section");

    sections.forEach(section => {

        const heading = section.querySelector("h2");

        if (heading) {

            heading.addEventListener("click", function () {

                section.classList.toggle("collapsed");

            });

        }

    });


    /* =========================
       2. FAQ BUTTON REDIRECT
    ========================= */

    const faqBtn = document.getElementById("faqBtn");

    if (faqBtn) {

        faqBtn.addEventListener("click", function () {

            window.location.href = "/faq/index.html";

        });

    }

});