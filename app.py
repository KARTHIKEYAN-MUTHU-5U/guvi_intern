from flask import Flask, request, jsonify, render_template, redirect
from utils.mysql_helper import register_user, validate_login
from utils.mongo_helper import get_profile, update_profile
from utils.redis_helper import set_session, get_session
import os

app = Flask(__name__)

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
    data = request.get_json()
    success = register_user(data["email"], data["password"])
    if success:
        return jsonify({"message": "Registered successfully"})
    else:
        return jsonify({"error": "User already exists"}), 400

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json()
    if validate_login(data["email"], data["password"]):
        set_session(data["email"])
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/api/profile", methods=["GET", "POST"])
def api_profile():
    email = request.args.get("email")
    if request.method == "GET":
        profile = get_profile(email)
        return jsonify(profile or {})
    else:
        data = request.get_json()
        update_profile(email, data)
        return jsonify({"message": "Profile updated"})

if __name__ == "__main__":
    app.run(debug=True)