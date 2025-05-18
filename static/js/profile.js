$(document).ready(function() {
    const email = localStorage.getItem("email");
    if (!email) {
        alert("Unauthorized. Please log in.");
        window.location.href = "/";
        return;
    }

    $.ajax({
        url: `/api/profile?email=${email}`,
        method: 'GET',
        success: function(data) {
            $('#name').val(data.name || '');
            $('#age').val(data.age || '');
            $('#dob').val(data.dob || '');
            $('#contact').val(data.contact || '');
        }
    });

    $('#profileForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: `/api/profile?email=${email}`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: $('#name').val(),
                age: $('#age').val(),
                dob: $('#dob').val(),
                contact: $('#contact').val()
            }),
            success: function() {
                alert("Profile updated successfully!");
            },
            error: function() {
                alert("Update failed.");
            }
        });
    });
});