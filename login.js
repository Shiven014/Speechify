document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents the form from submitting the usual way

    // Get the username and password field values
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    // Simple validation for empty fields
    if (username === "" || password === "") {
        alert("Please enter both username and password!");
        return;
    }

    // Hardcoded credentials check (replace this with actual server-side authentication)
    if (username === "admin" && password === "admin123") {
        alert("Login successful!");
        window.location.href = "Text-to-speech.html"; // Redirect to Text-to-Speech page after successful login
    } else {
        alert("Invalid username or password!");
    }
});
