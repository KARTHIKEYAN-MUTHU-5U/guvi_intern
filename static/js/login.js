$('#loginForm').submit(function(e) {
    e.preventDefault();
    $.ajax({
        url: '/api/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: $('#email').val(),
            password: $('#password').val()
        }),
        success: function(response) {
            localStorage.setItem("email", $('#email').val());
            alert("Login successful!");
            window.location.href = '/profile';
        },
        error: function() {
            alert("Login failed.");
        }
    });
});