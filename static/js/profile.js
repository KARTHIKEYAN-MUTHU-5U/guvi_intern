// FILE: static/js/profile.js

function showProfile(data) {
    $("#name").val(data.name || "");
    $("#dob").val(data.dob || "");
    $("#phone").val(data.phone || "");
    $("#email").val(data.email || "");
    if (data.profile_pic) {
        $("#profilePicPreview").attr("src", "/static/uploads/" + data.profile_pic);
    } else {
        $("#profilePicPreview").attr("src", "/static/img/default-profile.png");
    }
    $("#profileContainer").show();
    $("#profileLoading").hide();
}

$(function() {
    // Get profile on load
    $.ajax({
        url: "/api/profile",
        method: "GET",
        success: function(resp) { showProfile(resp); },
        error: function(xhr) {
            $("#profileLoading").hide();
            if (xhr.status === 401) {
                window.location.href = "/";
            } else {
                alert("Could not load profile.");
            }
        }
    });

    $("#profileForm").on("submit", function(e) {
        e.preventDefault();
        $("#profileMsg").text("");
        let name = $("#name").val().trim();
        let dob = $("#dob").val().trim();
        let phone = $("#phone").val().trim();

        if (!name || !dob || !/^[0-9]{10}$/.test(phone)) {
            $("#profileMsg").text("Fill out all fields with valid info.");
            return;
        }

        $.ajax({
            url: "/api/profile",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, dob, phone }),
            success: function() {
                $("#profileMsg").text("Profile updated!");
                setTimeout(() => { $("#profileMsg").text(""); }, 2000);
            },
            error: function(xhr) {
                let err = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Update failed.";
                $("#profileMsg").text(err);
            }
        });
    });

    $("#picForm").on("submit", function(e) {
        e.preventDefault();
        $("#picMsg").text("");
        let file = $("#picInput")[0].files[0];
        if (!file) {
            $("#picMsg").text("Choose an image.");
            return;
        }
        let formData = new FormData();
        formData.append("file", file);

        $.ajax({
            url: "/api/upload_profile_pic",
            method: "POST",
            processData: false,
            contentType: false,
            data: formData,
            success: function(resp) {
                $("#picMsg").text(resp.message);
                $("#profilePicPreview").attr("src", "/static/uploads/" + resp.filename);
                setTimeout(() => { $("#picMsg").text(""); }, 2000);
            },
            error: function(xhr) {
                let err = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Upload failed.";
                $("#picMsg").text(err);
            }
        });
    });

    $("#logoutBtn").on("click", function() {
        $.ajax({
            url: "/api/logout",
            method: "POST",
            success: function() { window.location.href = "/"; },
            error: function() { window.location.href = "/"; }
        });
    });
});
