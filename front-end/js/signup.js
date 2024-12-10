document.querySelector(".signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("role").value;
    const password = document.getElementById("password").value.trim();

    // Clear previous error messages
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

    // Basic validation
    if (!email || !username || !password) {
        if (!email) document.querySelector(".email-error").textContent = "Email is required.";
        if (!username) document.querySelector(".role-error").textContent = "Role is required.";
        if (!password) document.querySelector(".password-error").textContent = "Password is required.";
        return;
    }

    if (password.length < 2) {
        document.querySelector(".password-error").textContent = "Password must be at least 8 characters long.";
        return;
    }

    const userData = { email, username, password };

    // Show loading modal with circular progress indicator
    const loadingModal = document.getElementById("loadingModal");
    loadingModal.classList.add("active");

    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        // Hide loading modal
        loadingModal.classList.remove("active");

        if (response.status === 201) {
            // Show success modal
            const successModal = document.getElementById("successModal");
            successModal.classList.add("active");

            setTimeout(() => {
                window.location.href = "/"; // Redirect to the desired screen
            }, 3000);
        } else {
            // Display specific error messages
            if (result.error) {
                if (result.error.includes("Email")) {
                    document.querySelector(".email-error").textContent = result.error;
                } else {
                    document.querySelector(".password-error").textContent = result.error;
                }
            } else {
                document.querySelector(".password-error").textContent = "Failed to create account. Try again.";
            }
        }
    } catch (error) {
        console.error("Error:", error);

        // Hide loading modal
        loadingModal.classList.remove("active");

        document.querySelector(".password-error").textContent = "An unexpected error occurred. Please try again.";
    }
});

// Close modal function
function closeModal() {
    const successModal = document.getElementById("successModal");
    successModal.classList.remove("active");
}
