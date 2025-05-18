import mysql.connector
from config import MYSQL_CONFIG

def register_user(email, password):
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(prepared=True)
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
        conn.commit()
        return True
    except mysql.connector.errors.IntegrityError:
        return False
    finally:
        cursor.close()
        conn.close()

def validate_login(email, password):
    conn = mysql.connector.connect(**MYSQL_CONFIG)
    cursor = conn.cursor(prepared=True)
    cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return bool(result)