
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



/* Hamburger menu functionality */
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const menuDropdown = document.getElementById("menuDropdown");

    if (!menuToggle || !menuDropdown) return;

    menuToggle.addEventListener("click", function () {
        const isOpen = menuDropdown.classList.toggle("active");

        menuToggle.textContent = isOpen ? "✕" : "☰";
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    document.addEventListener("click", function (event) {
        if (
            !menuToggle.contains(event.target) &&
            !menuDropdown.contains(event.target)
        ) {
            menuDropdown.classList.remove("active");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }
    });
});
