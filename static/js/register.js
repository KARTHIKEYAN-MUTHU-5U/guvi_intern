$('#registerForm').submit(function(e) {
    e.preventDefault();
    $.ajax({
        url: '/api/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: $('#email').val(),
            password: $('#password').val()
        }),
        success: function(response) {
            alert("Registration successful! Please login.");
            window.location.href = '/';
        },
        error: function() {
            alert("Registration failed.");
        }
    });
});