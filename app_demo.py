from flask import Flask, request, jsonify, render_template, redirect, send_from_directory, make_response
import os
import json

app = Flask(__name__)

# Mock data for testing
mock_products = [
    {
        "id": 1,
        "name": "Fresh Apples",
        "description": "Crisp and sweet red apples, perfect for snacking or cooking",
        "price": 3.99,
        "image_url": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
        "category": "fruits",
        "stock_quantity": 100,
        "unit": "kg",
        "is_active": True
    },
    {
        "id": 2,
        "name": "Organic Bananas",
        "description": "Naturally ripened organic bananas, rich in potassium",
        "price": 2.49,
        "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
        "category": "fruits",
        "stock_quantity": 150,
        "unit": "kg",
        "is_active": True
    },
    {
        "id": 3,
        "name": "Juicy Oranges",
        "description": "Sweet and tangy oranges, packed with vitamin C",
        "price": 4.99,
        "image_url": "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
        "category": "fruits",
        "stock_quantity": 80,
        "unit": "kg",
        "is_active": True
    },
    {
        "id": 4,
        "name": "Fresh Strawberries",
        "description": "Premium quality strawberries, perfect for desserts",
        "price": 8.99,
        "image_url": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
        "category": "fruits",
        "stock_quantity": 50,
        "unit": "kg",
        "is_active": True
    },
    {
        "id": 5,
        "name": "Tropical Mangoes",
        "description": "Sweet and succulent mangoes, tropical paradise in every bite",
        "price": 6.99,
        "image_url": "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
        "category": "fruits",
        "stock_quantity": 60,
        "unit": "kg",
        "is_active": True
    },
    {
        "id": 6,
        "name": "Green Grapes",
        "description": "Fresh seedless green grapes, perfect for snacking",
        "price": 7.49,
        "image_url": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
        "category": "fruits",
        "stock_quantity": 40,
        "unit": "kg",
        "is_active": True
    }
]

# Routes
@app.route("/")
def home_page():
    return render_template("index_standalone.html")

@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/register")
def register_page():
    return render_template("register.html")

@app.route("/profile")
def profile_page():
    return render_template("profile.html")

@app.route("/shop")
def shop_page():
    return render_template("shop_standalone.html")

@app.route("/cart")
def cart_page():
    return render_template("cart.html")

@app.route("/checkout")
def checkout_page():
    return render_template("checkout.html")

# API endpoints with mock data
@app.route("/api/products", methods=["GET"])
def api_get_products():
    search_query = request.args.get('search', '')
    if search_query:
        filtered_products = [p for p in mock_products 
                           if search_query.lower() in p['name'].lower() 
                           or search_query.lower() in p['description'].lower()]
        return jsonify(filtered_products)
    return jsonify(mock_products)

@app.route("/api/products/<int:product_id>", methods=["GET"])
def api_get_product(product_id):
    product = next((p for p in mock_products if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found."}), 404

# Mock authentication - always return success for demo
@app.route("/api/login", methods=["POST"])
def api_login():
    return jsonify({"message": "Login successful"})

@app.route("/api/profile", methods=["GET"])
def api_get_profile():
    return jsonify({
        "name": "Demo User",
        "email": "demo@freshfruit.com",
        "phone": "555-0123"
    })

# Mock cart - simple in-memory storage
mock_cart = {"items": [], "total": 0}

@app.route("/api/cart", methods=["GET"])
def api_get_cart():
    return jsonify(mock_cart)

@app.route("/api/cart/add", methods=["POST"])
def api_add_to_cart():
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)
    
    product = next((p for p in mock_products if p['id'] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found."}), 404
    
    # Check if item already exists
    for item in mock_cart["items"]:
        if item["product_id"] == product_id:
            item["quantity"] += quantity
            item["total_price"] = item["quantity"] * item["unit_price"]
            break
    else:
        # Add new item
        mock_cart["items"].append({
            "product_id": product_id,
            "name": product["name"],
            "image_url": product["image_url"],
            "unit_price": product["price"],
            "unit": product["unit"],
            "quantity": quantity,
            "total_price": quantity * product["price"]
        })
    
    # Recalculate total
    mock_cart["total"] = sum(item["total_price"] for item in mock_cart["items"])
    
    return jsonify({"message": "Item added to cart", "cart": mock_cart})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)