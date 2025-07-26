// Login page JavaScript functionality

$(function() {
    $("#loginForm").on("submit", function(e) {
        e.preventDefault();
        $(".form-error").text("");

        let email = $("#email").val().trim();
        let password = $("#password").val();

        let valid = true;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $("#emailError").text("Enter a valid email.");
            valid = false;
        }
        if (!password) {
            $("#passwordError").text("Password required.");
            valid = false;
        }
        if (!valid) return;

        // Disable submit button and show loading state
        const submitButton = $("#loginForm button[type='submit']");
        const originalText = submitButton.html();
        submitButton.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Signing In...');

        $.ajax({
            url: "/api/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email, password }),
            success: function() { 
                // Redirect to shop page instead of profile for better UX
                window.location.href = "/"; 
            },
            error: function(xhr) {
                let err = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Login failed.";
                $("#serverError").text(err);
            },
            complete: function() {
                // Restore button state
                submitButton.prop('disabled', false).html(originalText);
            }
        });
    });
    
    // Add enter key support for better UX
    $("#email, #password").on("keypress", function(e) {
        if (e.which === 13) {
            $("#loginForm").submit();
        }
    });
    
    // Clear errors on input
    $("#email").on("input", function() {
        $("#emailError").text("");
        $("#serverError").text("");
    });
    
    $("#password").on("input", function() {
        $("#passwordError").text("");
        $("#serverError").text("");
    });
});
