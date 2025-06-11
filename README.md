# GUVI User Profile App (Dockerized)

A secure, production-ready Flask app with user registration, login, session management, profile updates, and profile picture upload.

---

## **Quick Start (Docker Compose)**

1. **Clone/Create this project structure on your machine.**

2. **(Optional but recommended) Create the MySQL user and DB (if not auto-created):**
   - The Docker Compose file creates a `guvi` database with root user by default.

3. **Build and Start all services:**

   ```sh
   docker-compose up --build
