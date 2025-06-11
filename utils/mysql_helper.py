# FILE: utils/mysql_helper.py

import mysql.connector
from config import MYSQL_CONFIG

def register_user(name, dob, phone, email, hashed_pw):
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(prepared=True)
        cursor.execute(
            "INSERT INTO users (name, dob, phone, email, password) VALUES (%s, %s, %s, %s, %s)",
            (name, dob, phone, email, hashed_pw)
        )
        conn.commit()
        return True, None
    except mysql.connector.errors.IntegrityError:
        return False, "User with this email already exists."
    except Exception as e:
        return False, str(e)
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

def validate_login(email):
    conn = mysql.connector.connect(**MYSQL_CONFIG)
    cursor = conn.cursor(dictionary=True, prepared=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user
