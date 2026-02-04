// Common JavaScript functionality for FreshFruit application

// Global variables
let currentUser = null;

// Initialize common functionality
$(document).ready(function() {
    checkAuthStatus();
    updateCartBadge();
});

// Check if user is authenticated
function checkAuthStatus() {
    $.ajax({
        url: '/api/profile',
        method: 'GET',
        success: function(data) {
            currentUser = data;
            showUserDropdown();
        },
        error: function() {
            currentUser = null;
            showLoginNav();
        }
    });
}

// Show user dropdown when logged in
function showUserDropdown() {
    $('#userDropdown').show();
    $('#loginNav').hide();
}

// Show login nav when not logged in
function showLoginNav() {
    $('#userDropdown').hide();
    $('#loginNav').show();
}

// Update cart badge count
function updateCartBadge() {
    if (!currentUser) {
        $('#cartBadge').text('0');
        return;
    }
    
    $.ajax({
        url: '/api/cart',
        method: 'GET',
        success: function(data) {
            const itemCount = data.items.reduce((total, item) => total + item.quantity, 0);
            $('#cartBadge').text(itemCount);
        },
        error: function() {
            $('#cartBadge').text('0');
        }
    });
}

// Logout function
function logout() {
    $.ajax({
        url: '/api/logout',
        method: 'POST',
        success: function() {
            currentUser = null;
            showLoginNav();
            updateCartBadge();
            showToast('success', 'Logged out successfully');
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        },
        error: function() {
            showToast('error', 'Logout failed');
        }
    });
}

// Show toast notification
function showToast(type, message) {
    const toastId = type === 'success' ? 'successToast' : 'errorToast';
    const bodyId = type === 'success' ? 'successToastBody' : 'errorToastBody';
    
    $(`#${bodyId}`).text(message);
    const toast = new bootstrap.Toast(document.getElementById(toastId));
    toast.show();
}

// Format price for display
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

// Add to cart function (used across multiple pages)
function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        showToast('error', 'Please login to add items to cart');
        return;
    }
    
    $.ajax({
        url: '/api/cart/add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            product_id: productId,
            quantity: quantity
        }),
        success: function(data) {
            showToast('success', 'Item added to cart successfully!');
            updateCartBadge();
        },
        error: function(xhr) {
            const error = xhr.responseJSON?.error || 'Failed to add item to cart';
            showToast('error', error);
        }
    });
}

// Utility function to create product card HTML
function createProductCard(product) {
    const isLowStock = product.stock_quantity < 10;
    const stockBadge = isLowStock ? '<div class="product-badge">Low Stock</div>' : '';
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image_url}" alt="${product.name}" 
                         onerror="this.src='https://via.placeholder.com/300x200/28a745/ffffff?text=Fresh+Fruit'">
                    ${stockBadge}
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="text-muted small mb-2">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <span class="product-price">$${formatPrice(product.price)}</span>
                            <span class="product-unit">/ ${product.unit}</span>
                        </div>
                        <small class="text-muted">
                            <i class="fas fa-box"></i> ${product.stock_quantity} available
                        </small>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-success flex-fill" 
                                onclick="addToCart(${product.id})"
                                ${product.stock_quantity === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus me-1"></i>
                            ${product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button class="btn btn-outline-success" 
                                onclick="showProductModal(${product.id})"
                                data-bs-toggle="modal" data-bs-target="#productModal">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show product in modal
function showProductModal(productId) {
    $.ajax({
        url: `/api/products/${productId}`,
        method: 'GET',
        success: function(product) {
            $('#productModalTitle').text(product.name);
            $('#productModalName').text(product.name);
            $('#productModalDescription').text(product.description);
            $('#productModalPrice').text(formatPrice(product.price));
            $('#productModalUnit').text(product.unit);
            $('#productModalStock').text(product.stock_quantity);
            $('#productModalImage').attr('src', product.image_url)
                                   .attr('alt', product.name);
            
            // Store product ID for adding to cart
            $('#productModal').data('product-id', productId);
            $('#quantityInput').val(1).attr('max', product.stock_quantity);
            
            // Disable add to cart if out of stock
            const addButton = $('#productModal').find('.btn-success');
            if (product.stock_quantity === 0) {
                addButton.prop('disabled', true).text('Out of Stock');
            } else {
                addButton.prop('disabled', false).html('<i class="fas fa-cart-plus me-2"></i>Add to Cart');
            }
        },
        error: function() {
            showToast('error', 'Failed to load product details');
        }
    });
}

// Change quantity in product modal
function changeQuantity(delta) {
    const input = $('#quantityInput');
    const currentValue = parseInt(input.val()) || 1;
    const maxValue = parseInt(input.attr('max')) || 1;
    const newValue = Math.max(1, Math.min(maxValue, currentValue + delta));
    input.val(newValue);
}

// Add to cart from modal
function addToCartFromModal() {
    const productId = $('#productModal').data('product-id');
    const quantity = parseInt($('#quantityInput').val()) || 1;
    
    addToCart(productId, quantity);
    
    // Close modal after adding
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
}

// Initialize tooltips and other Bootstrap components
$(document).ready(function() {
    // Initialize tooltips if any
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if( target.length ) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });
});