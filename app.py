from flask import Flask, request, jsonify, render_template, redirect, send_from_directory, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from utils.mysql_helper import register_user, validate_login
from utils.mongo_helper import get_profile, update_profile, set_profile_pic, get_profile_pic_path
from utils.redis_helper import create_session, get_session_email, delete_session
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, MAX_CONTENT_LENGTH, SESSION_COOKIE_NAME, SESSION_EXPIRE_SECONDS
import os
import re
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def require_session(func):
    def wrapper(*args, **kwargs):
        session_token = request.cookies.get(SESSION_COOKIE_NAME)
        if not session_token:
            return jsonify({"error": "Session expired. Please log in again."}), 401
        email = get_session_email(session_token)
        if not email:
            resp = make_response(jsonify({"error": "Session expired. Please log in again."}), 401)
            resp.set_cookie(SESSION_COOKIE_NAME, '', expires=0)
            return resp
        return func(email, *args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

@app.route("/")
def login_page():
    return render_template("login.html")

@app.route("/register")
def register_page():
    return render_template("register.html")

@app.route("/profile")
def profile_page():
    return render_template("profile.html")

@app.route("/api/register", methods=["POST"])
def api_register():
    try:
        data = request.get_json()
        name = data.get("name", "").strip()
        dob = data.get("dob", "").strip()
        phone = data.get("phone", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        # Validation
        if not all([name, dob, phone, email, password]):
            return jsonify({"error": "All fields are required."}), 400
        if not re.match(r"^[0-9]{10}$", phone):
            return jsonify({"error": "Invalid phone number."}), 400
        if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
            return jsonify({"error": "Invalid email."}), 400
        if len(password) < 6:
            return jsonify({"error": "Password too short."}), 400

        hashed_pw = generate_password_hash(password)
        success, err = register_user(name, dob, phone, email, hashed_pw)
        if not success:
            return jsonify({"error": err or "Registration failed."}), 400

        # Create Mongo profile
        update_profile(email, {"name": name, "dob": dob, "phone": phone, "profile_pic": ""})

        return jsonify({"message": "Registered successfully"})
    except Exception as e:
        print("Registration error:", e)
        return jsonify({"error": "Server error, please try again."}), 500

@app.route("/api/login", methods=["POST"])
def api_login():
    try:
        data = request.get_json()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        user = validate_login(email)
        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid credentials."}), 401

        session_token = create_session(email)
        resp = jsonify({"message": "Login successful"})
        resp.set_cookie(SESSION_COOKIE_NAME, session_token, max_age=SESSION_EXPIRE_SECONDS, httponly=True, samesite="Lax")
        return resp
    except Exception as e:
        print("Login error:", e)
        return jsonify({"error": "Server error, please try again."}), 500

@app.route("/api/logout", methods=["POST"])
@require_session
def api_logout(email):
    try:
        session_token = request.cookies.get(SESSION_COOKIE_NAME)
        delete_session(session_token)
        resp = jsonify({"message": "Logged out successfully"})
        resp.set_cookie(SESSION_COOKIE_NAME, '', expires=0)
        return resp
    except Exception as e:
        print("Logout error:", e)
        return jsonify({"error": "Logout failed"}), 500

@app.route("/api/profile", methods=["GET"])
@require_session
def api_get_profile(email):
    try:
        profile = get_profile(email)
        if not profile:
            return jsonify({"error": "Profile not found."}), 404
        profile['email'] = email
        return jsonify(profile)
    except Exception as e:
        print("Profile get error:", e)
        return jsonify({"error": "Failed to fetch profile."}), 500

@app.route("/api/profile", methods=["POST"])
@require_session
def api_update_profile(email):
    try:
        data = request.get_json()
        # Only allow editing certain fields
        update_data = {}
        for field in ("name", "dob", "phone"):
            if field in data:
                update_data[field] = data[field]
        if not update_data:
            return jsonify({"error": "No update fields provided."}), 400
        update_profile(email, update_data)
        return jsonify({"message": "Profile updated successfully"})
    except Exception as e:
        print("Profile update error:", e)
        return jsonify({"error": "Failed to update profile."}), 500

@app.route("/api/upload_profile_pic", methods=["POST"])
@require_session
def api_upload_profile_pic(email):
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part."}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file."}), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(f"{email}_{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}")
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            file.save(save_path)
            set_profile_pic(email, filename)
            return jsonify({"message": "Profile picture uploaded.", "filename": filename})
        return jsonify({"error": "Invalid file type."}), 400
    except Exception as e:
        print("Profile pic upload error:", e)
        return jsonify({"error": "Failed to upload profile picture."}), 500

@app.route("/static/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
