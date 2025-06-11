// FILE: static/js/register.js

$(function() {
    $("#registerForm").on("submit", function(e) {
        e.preventDefault();
        $(".form-error").text("");

        let name = $("#name").val().trim();
        let dob = $("#dob").val().trim();
        let phone = $("#phone").val().trim();
        let email = $("#email").val().trim();
        let password = $("#password").val();

        let valid = true;

        if (!name) { $("#nameError").text("Name is required."); valid = false; }
        if (!dob) { $("#dobError").text("Date of Birth is required."); valid = false; }
        if (!/^[0-9]{10}$/.test(phone)) { $("#phoneError").text("Valid 10-digit phone required."); valid = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $("#emailError").text("Enter a valid email."); valid = false; }
        if (!password || password.length < 6) { $("#passwordError").text("Min 6 chars."); valid = false; }

        if (!valid) return;

        $.ajax({
            url: "/api/register",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, dob, phone, email, password }),
            success: function() { window.location.href = "/"; },
            error: function(xhr) {
                let err = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Registration failed.";
                $("#serverError").text(err);
            }
        });
    });
});
