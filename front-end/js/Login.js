document.querySelector(".loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    // Clear previous error messages
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

    // Validate inputs
    if (!email || !password) {
        if (!email) document.querySelector(".username-error").textContent = "Email is required.";
        if (!password) document.querySelector(".password-error").textContent = "Password is required.";
        return;
    }

    try {
        // Call the login API
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.status === 200) {
            // Save only the username in session storage
            sessionStorage.setItem("username", result.username);

            // Show the custom loading screen
            document.body.innerHTML = `
                <div class="content">
                    <h1>Resource Guide</h1>
                    <div class="progress-bar">
                        <div class="progress"></div>
                    </div>
                </div>
            `;

            // Include CSS dynamically
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "css/style.css";
            document.head.appendChild(link);

            // Animate the progress bar and redirect
            const progress = document.querySelector(".progress");
            setTimeout(() => {
                progress.style.width = '100%';
            }, 100); // Trigger animation

            setTimeout(() => {
                // Redirect based on user role
                const role = result.username; // Fetch role from API response
                switch (role) {
                    case "super-admin":
                        window.location.href = "/supperadminhome";
                        break;
                    case "admin":
                        window.location.href = "/adminhome";
                        break;
                    case "user":
                        window.location.href = "/userhome";
                        break;
                }
            }, 3000);
        } else {
            // Display error message if user is not found or credentials are incorrect
            document.querySelector("#form-error").textContent = "Incorrect Username/Email or Password";
            document.querySelector("#form-error").style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        document.querySelector("#form-error").textContent = "An unexpected error occurred. Please try again.";
        document.querySelector("#form-error").style.display = "block";
    }
});
