// Shop page JavaScript functionality

let allProducts = [];
let filteredProducts = [];

$(document).ready(function() {
    loadProducts();
    
    // Search functionality
    $('#searchInput').on('input', debounce(searchProducts, 300));
    
    // Enter key search
    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) {
            searchProducts();
        }
    });
});

// Load all products
function loadProducts() {
    showLoadingSpinner();
    
    $.ajax({
        url: '/api/products',
        method: 'GET',
        success: function(products) {
            allProducts = products;
            filteredProducts = products;
            displayProducts(products);
            hideLoadingSpinner();
        },
        error: function() {
            hideLoadingSpinner();
            showNoProductsMessage('Failed to load products. Please try again later.');
        }
    });
}

// Display products in grid
function displayProducts(products) {
    const container = $('#productsGrid');
    
    if (products.length === 0) {
        showNoProductsMessage();
        return;
    }
    
    hideNoProductsMessage();
    
    let html = '';
    products.forEach(product => {
        html += createProductCard(product);
    });
    
    container.html(html);
    
    // Add stagger animation
    container.find('.product-card').each(function(index) {
        $(this).css('opacity', '0').delay(index * 50).animate({
            opacity: 1
        }, 400);
    });
}

// Search products
function searchProducts() {
    const query = $('#searchInput').val().trim();
    
    if (query === '') {
        filteredProducts = allProducts;
        displayProducts(filteredProducts);
        return;
    }
    
    showLoadingSpinner();
    
    $.ajax({
        url: '/api/products',
        method: 'GET',
        data: { search: query },
        success: function(products) {
            filteredProducts = products;
            displayProducts(products);
            hideLoadingSpinner();
        },
        error: function() {
            hideLoadingSpinner();
            showNoProductsMessage('Search failed. Please try again.');
        }
    });
}

// Sort products
function sortProducts() {
    const sortBy = $('#sortSelect').val();
    let sortedProducts = [...filteredProducts];
    
    switch (sortBy) {
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price_low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
    }
    
    displayProducts(sortedProducts);
}

// Show loading spinner
function showLoadingSpinner() {
    $('#loadingSpinner').show();
    $('#productsGrid').hide();
    $('#noProductsMessage').hide();
}

// Hide loading spinner
function hideLoadingSpinner() {
    $('#loadingSpinner').hide();
    $('#productsGrid').show();
}

// Show no products message
function showNoProductsMessage(message = null) {
    const defaultMessage = 'No fruits found matching your search.';
    $('#noProductsMessage').show();
    $('#productsGrid').hide();
    
    if (message) {
        $('#noProductsMessage h4').text('Error');
        $('#noProductsMessage p').text(message);
        $('#noProductsMessage i').removeClass('fa-search').addClass('fa-exclamation-triangle');
    } else {
        $('#noProductsMessage h4').text('No fruits found');
        $('#noProductsMessage p').text(defaultMessage);
        $('#noProductsMessage i').removeClass('fa-exclamation-triangle').addClass('fa-search');
    }
}

// Hide no products message
function hideNoProductsMessage() {
    $('#noProductsMessage').hide();
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced add to cart with toast notification
function addToCartWithToast(productId, quantity = 1) {
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
            // Show custom toast
            const toast = new bootstrap.Toast(document.getElementById('addToCartToast'));
            toast.show();
            updateCartBadge();
        },
        error: function(xhr) {
            const error = xhr.responseJSON?.error || 'Failed to add item to cart';
            showToast('error', error);
        }
    });
}

// Override the global addToCart function for this page
window.addToCart = addToCartWithToast;