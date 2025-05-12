# GUVI Flask Signup/Login/Profile App

Run `pip install -r requirements.txt` and `python app.py`.

Install and run:
MySQL
MongoDB
redis

do this before running app :

-------MySQL setup:------
1. Start MySQL server
2. Login to MySQL CLI:
Run: 'mysql -u root -p'
3. Create database and table
sql
run:
'CREATE DATABASE guvi_users;
USE guvi_users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);'

-------MongoDB Setup-------
1. Start MongoDB server
Run:
'mongod'
MongoDB will automatically create the database and collection when you insert documents via your app.

------Redis Setup---------
1. Start Redis server
Run:
'redis-server'
Redis will listen on localhost:6379 by default.

------ Configurations------
Edit config.py to match your local database credentials:

python
run
'MYSQL_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_mysql_password',  # Replace this
    'database': 'guvi_users'
}'

MONGO_URI = "mongodb://localhost:27017"
REDIS_HOST = "localhost"
REDIS_PORT = 6379
------Run the App -------
In the terminal:
Run:
python app.py
Visit: http://localhost:5000