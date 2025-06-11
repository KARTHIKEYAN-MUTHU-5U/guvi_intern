// FILE: static/js/login.js

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

        $.ajax({
            url: "/api/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email, password }),
            success: function() { window.location.href = "/profile"; },
            error: function(xhr) {
                let err = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Login failed.";
                $("#serverError").text(err);
            }
        });
    });
});
