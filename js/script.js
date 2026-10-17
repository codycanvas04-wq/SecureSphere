/* SecureSphere - Shared Website Interactions */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Welcome to SecureSphere!");

    // Show a friendly message when a feature is not ready yet.
    const comingSoonButtons = document.querySelectorAll("[data-coming-soon]");

    comingSoonButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            alert("This feature is coming soon! Stay tuned, Cyber Star!");
        });
    });
});
