// Tab click event
document.querySelectorAll(".tab-link").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active class from all tab buttons
        document.querySelectorAll(".tab-link").forEach(btn => btn.classList.remove("active"));

        // Add active class to clicked tab
        this.classList.add("active");

        // Hide all tab contents
        document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

        // Show selected tab content
        const target = this.getAttribute("data-tab");
        document.getElementById(target).classList.add("active");
    });
});
