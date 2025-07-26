-- FILE: init_fruits_schema.sql
-- Database schema for fruits selling application

-- Products table for fruits inventory
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(50) DEFAULT 'fruits',
    stock_quantity INT DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'kg',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table for tracking purchases
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Order items table for storing individual products in orders
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample fruits data
INSERT INTO products (name, description, price, image_url, category, stock_quantity, unit) VALUES
('Fresh Apples', 'Crisp and sweet red apples, perfect for snacking or cooking', 3.99, '/static/images/apples.jpg', 'fruits', 100, 'kg'),
('Organic Bananas', 'Naturally ripened organic bananas, rich in potassium', 2.49, '/static/images/bananas.jpg', 'fruits', 150, 'kg'),
('Juicy Oranges', 'Sweet and tangy oranges, packed with vitamin C', 4.99, '/static/images/oranges.jpg', 'fruits', 80, 'kg'),
('Fresh Strawberries', 'Premium quality strawberries, perfect for desserts', 8.99, '/static/images/strawberries.jpg', 'fruits', 50, 'kg'),
('Tropical Mangoes', 'Sweet and succulent mangoes, tropical paradise in every bite', 6.99, '/static/images/mangoes.jpg', 'fruits', 60, 'kg'),
('Green Grapes', 'Fresh seedless green grapes, perfect for snacking', 7.49, '/static/images/grapes.jpg', 'fruits', 40, 'kg'),
('Ripe Pineapple', 'Sweet and juicy pineapple, tropical flavor explosion', 5.99, '/static/images/pineapple.jpg', 'fruits', 30, 'piece'),
('Fresh Watermelon', 'Large sweet watermelon, perfect for summer refreshment', 12.99, '/static/images/watermelon.jpg', 'fruits', 25, 'piece'),
('Exotic Kiwi', 'Tangy and sweet kiwi fruits, packed with nutrients', 9.99, '/static/images/kiwi.jpg', 'fruits', 35, 'kg'),
('Premium Avocados', 'Creamy and nutritious avocados, perfect for healthy meals', 11.99, '/static/images/avocados.jpg', 'fruits', 45, 'kg'),
('Sweet Peaches', 'Juicy and fragrant peaches, summer sweetness at its best', 6.49, '/static/images/peaches.jpg', 'fruits', 55, 'kg'),
('Fresh Blueberries', 'Antioxidant-rich blueberries, superfood for your health', 12.99, '/static/images/blueberries.jpg', 'fruits', 30, 'kg');