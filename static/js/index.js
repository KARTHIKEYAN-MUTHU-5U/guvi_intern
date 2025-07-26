// Homepage JavaScript functionality

$(document).ready(function() {
    loadFeaturedProducts();
});

// Load featured products for homepage
function loadFeaturedProducts() {
    $.ajax({
        url: '/api/products',
        method: 'GET',
        success: function(products) {
            // Show only first 6 products as featured
            const featuredProducts = products.slice(0, 6);
            displayFeaturedProducts(featuredProducts);
        },
        error: function() {
            $('#featuredProducts').html(`
                <div class="col-12 text-center">
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Unable to load featured products. Please try again later.
                    </div>
                </div>
            `);
        }
    });
}

// Display featured products
function displayFeaturedProducts(products) {
    const container = $('#featuredProducts');
    
    if (products.length === 0) {
        container.html(`
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No featured products available at the moment.
                </div>
            </div>
        `);
        return;
    }
    
    let html = '';
    products.forEach(product => {
        html += createProductCard(product);
    });
    
    container.html(html);
    
    // Add fade-in animation
    container.find('.product-card').each(function(index) {
        $(this).delay(index * 100).animate({
            opacity: 1
        }, 600);
    });
}

// Initialize hero section animations
$(document).ready(function() {
    // Parallax effect for hero section
    $(window).scroll(function() {
        const scrolled = $(this).scrollTop();
        const rate = scrolled * -0.5;
        $('.hero-section').css('transform', `translateY(${rate}px)`);
    });
    
    // Counter animation for features (if you want to add numbers)
    function animateCounters() {
        $('.counter').each(function() {
            const $this = $(this);
            const countTo = $this.attr('data-count');
            
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'linear',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    }
    
    // Trigger counter animation when section comes into view
    $(window).scroll(function() {
        const featuresSection = $('#features');
        const sectionTop = featuresSection.offset().top;
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        if (scrollTop + windowHeight > sectionTop + 100) {
            animateCounters();
            $(window).off('scroll'); // Run only once
        }
    });
});