document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents the default form submission

    // Get form field values
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    // Basic validation
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // For demo purposes, we'll assume success.
    alert("Sign-up successful for " + username + " with email " + email);
    
    // Redirect to Text-to-Speech page after successful sign-up
    window.location.href = "./Text-to-speech.html";
});
