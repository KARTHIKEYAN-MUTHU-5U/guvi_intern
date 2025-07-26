// Shopping cart JavaScript functionality

let cart = { items: [], total: 0 };

$(document).ready(function() {
    loadCart();
    
    // Order form submission
    $('#orderForm').on('submit', function(e) {
        e.preventDefault();
        placeOrder();
    });
});

// Load cart data
function loadCart() {
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    
    showLoadingSpinner();
    
    $.ajax({
        url: '/api/cart',
        method: 'GET',
        success: function(data) {
            cart = data;
            displayCart();
            hideLoadingSpinner();
        },
        error: function() {
            hideLoadingSpinner();
            showToast('error', 'Failed to load cart');
        }
    });
}

// Display cart items
function displayCart() {
    const container = $('#cartItems');
    
    if (cart.items.length === 0) {
        showEmptyCart();
        return;
    }
    
    hideEmptyCart();
    showCartSummary();
    
    let html = '';
    cart.items.forEach(item => {
        html += createCartItemHTML(item);
    });
    
    container.html(html);
    updateCartSummary();
}

// Create HTML for cart item
function createCartItemHTML(item) {
    const totalPrice = (item.quantity * item.unit_price).toFixed(2);
    
    return `
        <div class="cart-item" data-product-id="${item.product_id}">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.image_url}" alt="${item.name}" 
                         class="cart-item-image"
                         onerror="this.src='https://via.placeholder.com/80x80/28a745/ffffff?text=Fruit'">
                </div>
                <div class="col-md-4">
                    <h6 class="fw-bold mb-1">${item.name}</h6>
                    <small class="text-muted">$${formatPrice(item.unit_price)} per ${item.unit}</small>
                </div>
                <div class="col-md-3">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.product_id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" 
                               value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${item.product_id}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${item.product_id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="fw-bold text-success">$${totalPrice}</div>
                </div>
                <div class="col-md-1">
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="removeFromCart(${item.product_id})"
                            title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    $.ajax({
        url: '/api/cart/update',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            product_id: productId,
            quantity: newQuantity
        }),
        success: function(data) {
            cart = data.cart;
            displayCart();
            updateCartBadge();
            showToast('success', 'Cart updated');
        },
        error: function(xhr) {
            const error = xhr.responseJSON?.error || 'Failed to update cart';
            showToast('error', error);
        }
    });
}

// Remove item from cart
function removeFromCart(productId) {
    $.ajax({
        url: '/api/cart/remove',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            product_id: productId
        }),
        success: function(data) {
            cart = data.cart;
            displayCart();
            updateCartBadge();
            showToast('success', 'Item removed from cart');
        },
        error: function(xhr) {
            const error = xhr.responseJSON?.error || 'Failed to remove item';
            showToast('error', error);
        }
    });
}

// Clear entire cart
function clearCart() {
    if (!confirm('Are you sure you want to clear your cart?')) {
        return;
    }
    
    $.ajax({
        url: '/api/cart/clear',
        method: 'POST',
        success: function(data) {
            cart = data.cart;
            displayCart();
            updateCartBadge();
            showToast('success', 'Cart cleared');
        },
        error: function(xhr) {
            const error = xhr.responseJSON?.error || 'Failed to clear cart';
            showToast('error', error);
        }
    });
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.total;
    const deliveryFee = 5.99;
    const total = subtotal + deliveryFee;
    
    $('#cartSubtotal').text(formatPrice(subtotal));
    $('#cartTotal').text(formatPrice(total));
}

// Show empty cart state
function showEmptyCart() {
    $('#emptyCart').show();
    $('#cartActions').hide();
    hideCartSummary();
}

// Hide empty cart state
function hideEmptyCart() {
    $('#emptyCart').hide();
    $('#cartActions').show();
}

// Show cart summary
function showCartSummary() {
    $('#cartSummary').show();
    if (currentUser) {
        $('#checkoutForm').show();
        $('#loginRequired').hide();
    } else {
        $('#checkoutForm').hide();
        $('#loginRequired').show();
    }
}

// Hide cart summary
function hideCartSummary() {
    $('#cartSummary').hide();
}

// Show login required message
function showLoginRequired() {
    showEmptyCart();
    $('#emptyCart h4').text('Login Required');
    $('#emptyCart p').text('Please login to view your shopping cart.');
    $('#emptyCart a').attr('href', '/login').html('<i class="fas fa-sign-in-alt me-2"></i>Login');
}

// Place order
function placeOrder() {
    const shippingAddress = $('#shippingAddress').val().trim();
    const phone = $('#phoneNumber').val().trim();
    const notes = $('#orderNotes').val().trim();
    
    if (!shippingAddress || !phone) {
        showToast('error', 'Please fill in all required fields');
        return;
    }
    
    const submitButton = $('#orderForm button[type="submit"]');
    const originalText = submitButton.html();
    submitButton.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Placing Order...');
    
    $.ajax({
        url: '/api/orders',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            shipping_address: shippingAddress,
            phone: phone,
            notes: notes
        }),
        success: function(data) {
            showToast('success', 'Order placed successfully!');
            
            // Clear form and cart
            $('#orderForm')[0].reset();
            cart = { items: [], total: 0 };
            displayCart();
            updateCartBadge();
            
            // Show success message
            setTimeout(() => {
                window.location.href = '/profile';
            }, 2000);
        },
        error: function(xhr) {
            const error = xhr.responseJSON?.error || 'Failed to place order';
            showToast('error', error);
        },
        complete: function() {
            submitButton.prop('disabled', false).html(originalText);
        }
    });
}

// Show loading spinner
function showLoadingSpinner() {
    $('#loadingSpinner').show();
    $('#cartItems').parent().hide();
}

// Hide loading spinner
function hideLoadingSpinner() {
    $('#loadingSpinner').hide();
    $('#cartItems').parent().show();
}