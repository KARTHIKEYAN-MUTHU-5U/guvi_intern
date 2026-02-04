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

# Products management functions
def get_all_products():
    """Get all active products"""
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products WHERE is_active = TRUE ORDER BY name")
        products = cursor.fetchall()
        return products
    except Exception as e:
        print(f"Error fetching products: {e}")
        return []
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

def get_product_by_id(product_id):
    """Get a specific product by ID"""
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(dictionary=True, prepared=True)
        cursor.execute("SELECT * FROM products WHERE id = %s AND is_active = TRUE", (product_id,))
        product = cursor.fetchone()
        return product
    except Exception as e:
        print(f"Error fetching product: {e}")
        return None
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

def search_products(query):
    """Search products by name or description"""
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(dictionary=True, prepared=True)
        search_term = f"%{query}%"
        cursor.execute(
            "SELECT * FROM products WHERE (name LIKE %s OR description LIKE %s) AND is_active = TRUE ORDER BY name",
            (search_term, search_term)
        )
        products = cursor.fetchall()
        return products
    except Exception as e:
        print(f"Error searching products: {e}")
        return []
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

# Order management functions
def create_order(user_email, total_amount, shipping_address, phone, notes=""):
    """Create a new order"""
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(prepared=True)
        cursor.execute(
            "INSERT INTO orders (user_email, total_amount, shipping_address, phone, notes) VALUES (%s, %s, %s, %s, %s)",
            (user_email, total_amount, shipping_address, phone, notes)
        )
        order_id = cursor.lastrowid
        conn.commit()
        return order_id
    except Exception as e:
        print(f"Error creating order: {e}")
        return None
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

def add_order_item(order_id, product_id, quantity, unit_price):
    """Add an item to an order"""
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(prepared=True)
        total_price = quantity * unit_price
        cursor.execute(
            "INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (%s, %s, %s, %s, %s)",
            (order_id, product_id, quantity, unit_price, total_price)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error adding order item: {e}")
        return False
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

def get_user_orders(user_email):
    """Get all orders for a user"""
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(dictionary=True, prepared=True)
        cursor.execute(
            "SELECT * FROM orders WHERE user_email = %s ORDER BY created_at DESC",
            (user_email,)
        )
        orders = cursor.fetchall()
        return orders
    except Exception as e:
        print(f"Error fetching user orders: {e}")
        return []
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

def get_order_items(order_id):
    """Get all items for a specific order"""
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(dictionary=True, prepared=True)
        cursor.execute(
            """SELECT oi.*, p.name as product_name, p.image_url, p.unit 
               FROM order_items oi 
               JOIN products p ON oi.product_id = p.id 
               WHERE oi.order_id = %s""",
            (order_id,)
        )
        items = cursor.fetchall()
        return items
    except Exception as e:
        print(f"Error fetching order items: {e}")
        return []
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

def update_product_stock(product_id, quantity_sold):
    """Update product stock after purchase"""
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        cursor = conn.cursor(prepared=True)
        cursor.execute(
            "UPDATE products SET stock_quantity = stock_quantity - %s WHERE id = %s",
            (quantity_sold, product_id)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating product stock: {e}")
        return False
    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass
