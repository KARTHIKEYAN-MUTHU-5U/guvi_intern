# FILE: utils/mongo_helper.py

from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client['guvi_profiles']
collection = db['profiles']
cart_collection = db['shopping_carts']

def get_profile(email):
    profile = collection.find_one({"email": email}, {"_id": 0})
    return profile

def update_profile(email, data):
    collection.update_one({"email": email}, {"$set": data}, upsert=True)

def set_profile_pic(email, filename):
    collection.update_one({"email": email}, {"$set": {"profile_pic": filename}}, upsert=True)

def get_profile_pic_path(email):
    profile = collection.find_one({"email": email}, {"profile_pic": 1})
    return profile.get("profile_pic") if profile else None

# Shopping cart functions
def get_cart(user_email):
    """Get user's shopping cart"""
    cart = cart_collection.find_one({"user_email": user_email}, {"_id": 0})
    return cart if cart else {"user_email": user_email, "items": [], "total": 0}

def add_to_cart(user_email, product_id, quantity, product_data):
    """Add item to shopping cart"""
    cart = get_cart(user_email)
    
    # Check if item already exists in cart
    for item in cart["items"]:
        if item["product_id"] == product_id:
            item["quantity"] += quantity
            item["total_price"] = item["quantity"] * item["unit_price"]
            break
    else:
        # Add new item to cart
        cart["items"].append({
            "product_id": product_id,
            "name": product_data["name"],
            "image_url": product_data["image_url"],
            "unit_price": product_data["price"],
            "unit": product_data["unit"],
            "quantity": quantity,
            "total_price": quantity * product_data["price"]
        })
    
    # Recalculate cart total
    cart["total"] = sum(item["total_price"] for item in cart["items"])
    
    # Update cart in database
    cart_collection.update_one(
        {"user_email": user_email},
        {"$set": cart},
        upsert=True
    )
    return cart

def update_cart_item(user_email, product_id, quantity):
    """Update quantity of item in cart"""
    cart = get_cart(user_email)
    
    for item in cart["items"]:
        if item["product_id"] == product_id:
            if quantity <= 0:
                cart["items"].remove(item)
            else:
                item["quantity"] = quantity
                item["total_price"] = quantity * item["unit_price"]
            break
    
    # Recalculate cart total
    cart["total"] = sum(item["total_price"] for item in cart["items"])
    
    # Update cart in database
    cart_collection.update_one(
        {"user_email": user_email},
        {"$set": cart},
        upsert=True
    )
    return cart

def remove_from_cart(user_email, product_id):
    """Remove item from shopping cart"""
    cart = get_cart(user_email)
    cart["items"] = [item for item in cart["items"] if item["product_id"] != product_id]
    
    # Recalculate cart total
    cart["total"] = sum(item["total_price"] for item in cart["items"])
    
    # Update cart in database
    cart_collection.update_one(
        {"user_email": user_email},
        {"$set": cart},
        upsert=True
    )
    return cart

def clear_cart(user_email):
    """Clear all items from shopping cart"""
    cart_collection.delete_one({"user_email": user_email})
    return {"user_email": user_email, "items": [], "total": 0}

def get_cart_item_count(user_email):
    """Get total number of items in cart"""
    cart = get_cart(user_email)
    return sum(item["quantity"] for item in cart["items"])
