// Gopak Website JavaScript Functions

// Lazy Loading Implementation
class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.modelObserver = null;
        this.init();
    }

    init() {
        // Check for Intersection Observer support
        if ('IntersectionObserver' in window) {
            this.setupImageObserver();
            this.setupModelObserver();
            this.observeImages();
            this.observeModels();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
            this.loadAllModels();
        }
    }

    setupImageObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, options);
    }

    setupModelObserver() {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        this.modelObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.load3DModel(entry.target);
                    this.modelObserver.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeImages() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    observeModels() {
        const lazyModels = document.querySelectorAll('.lazy-3d-model');
        lazyModels.forEach(model => {
            this.modelObserver.observe(model);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        img.onload = () => {
            img.classList.add('loaded');
        };

        img.onerror = () => {
            img.classList.add('loaded');
            console.warn(`Failed to load image: ${src}`);
        };

        img.src = src;
        img.removeAttribute('data-src');
    }

    load3DModel(model) {
        const src = model.getAttribute('data-src');
        if (!src) return;

        model.addEventListener('load', () => {
            model.classList.add('loaded');
        });

        model.addEventListener('error', () => {
            model.classList.add('loaded');
            console.warn(`Failed to load 3D model: ${src}`);
        });

        model.src = src;
        model.removeAttribute('data-src');
    }

    loadAllImages() {
        // Fallback for browsers without Intersection Observer
        const lazyImages = document.querySelectorAll('.lazy-image');
        lazyImages.forEach(img => this.loadImage(img));
    }

    loadAllModels() {
        // Fallback for browsers without Intersection Observer
        const lazyModels = document.querySelectorAll('.lazy-3d-model');
        lazyModels.forEach(model => this.load3DModel(model));
    }
}

// Initialize Lazy Loading
const lazyLoader = new LazyLoader();

// Optimize slider images (prevent duplicate loading)
function optimizeSliderImages() {
    const sliderImages = document.querySelectorAll('.slider .item img');
    let masterImage = null;
    
    sliderImages.forEach((img, index) => {
        if (index === 0) {
            // First image becomes the master
            masterImage = img;
        } else {
            // Other images will clone from master when it loads
            img.style.display = 'none';
            
            if (masterImage.complete && masterImage.src) {
                // Master already loaded
                img.src = masterImage.src;
                img.style.display = 'block';
                img.classList.add('loaded');
            } else {
                // Wait for master to load
                masterImage.addEventListener('load', () => {
                    img.src = masterImage.src;
                    img.style.display = 'block';
                    img.classList.add('loaded');
                });
            }
        }
    });
}

// Call optimization after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeSliderImages);
} else {
    optimizeSliderImages();
}

// Scroll indicator click - updated to point to sales section
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        document.getElementById('sales').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Contact form submission (check if form exists)
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;
        
        // Send to PHP backend
        fetch('api/contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                contactForm.reset();
            } else {
                alert(data.message || 'Bir hata oluştu. Lütfen tekrar deneyiniz.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyiniz.');
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('.impact-banner, .sales-section, .testimonials-section, .contact-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Sales Functionality
class SalesManager {
    constructor() {
        this.config = {
            type: 'unprinted',
            basePrice: 2.5,
            color: 'white',
            colorName: 'Beyaz',
            size: '30x40',
            sizeMultiplier: 1.0,
            quantity: 100
        };
        this.sizeIndex = 0;
        this.init();
    }

    init() {
        this.setupTypeSelection();
        this.setupColorSelection();
        this.setupSizeSlider();
        this.setupQuantityControls();
        // Initial config update from first card
        this.updateConfigFromActiveCard();
        this.updatePreview();
        this.updatePricing();
    }

    setupTypeSelection() {
        const typeOptions = document.querySelectorAll('.type-option');
        typeOptions.forEach(option => {
            option.addEventListener('click', () => {
                typeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.config.type = option.dataset.type;
                this.config.basePrice = parseFloat(option.dataset.price);
                this.updatePreview();
                this.updatePricing();
            });
        });
    }

    setupColorSelection() {
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.config.color = option.dataset.color;
                this.config.colorName = option.dataset.name;
                this.updatePreview();
                this.updatePricing();
            });
        });
    }

    setupSizeSlider() {
        this.sizeCards = document.querySelectorAll('.size-card');
        this.sizeActive = 0; // Start with first card
        const prevBtn = document.querySelector('.size-prev');
        const nextBtn = document.querySelector('.size-next');

        // Initialize the slider
        this.loadSizeShow();

        // Add click events to cards
        this.sizeCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.sizeActive = index;
                this.loadSizeShow();
                this.updateConfigFromCard(card);
            });
        });

        // Navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.sizeActive = this.sizeActive + 1 < this.sizeCards.length ? this.sizeActive + 1 : this.sizeActive;
                this.loadSizeShow();
                this.updateConfigFromActiveCard();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.sizeActive = this.sizeActive - 1 >= 0 ? this.sizeActive - 1 : this.sizeActive;
                this.loadSizeShow();
                this.updateConfigFromActiveCard();
            });
        }
    }

    loadSizeShow() {
        // Active card styling
        this.sizeCards[this.sizeActive].style.transform = `none`;
        this.sizeCards[this.sizeActive].style.zIndex = 1;
        this.sizeCards[this.sizeActive].style.filter = 'none';
        this.sizeCards[this.sizeActive].style.opacity = 1;
        this.sizeCards[this.sizeActive].classList.add('active');

        // Cards after active
        let stt = 0;
        for(let i = this.sizeActive + 1; i < this.sizeCards.length; i++) {
            stt++;
            this.sizeCards[i].style.transform = `translateX(${120*stt}px) scale(${1 - 0.2*stt}) perspective(16px) rotateY(-1deg)`;
            this.sizeCards[i].style.zIndex = -stt;
            this.sizeCards[i].style.filter = 'blur(5px)';
            this.sizeCards[i].style.opacity = stt > 2 ? 0 : 0.6;
            this.sizeCards[i].classList.remove('active');
        }

        // Cards before active
        stt = 0;
        for(let i = (this.sizeActive - 1); i >= 0; i--) {
            stt++;
            this.sizeCards[i].style.transform = `translateX(${-120*stt}px) scale(${1 - 0.2*stt}) perspective(16px) rotateY(1deg)`;
            this.sizeCards[i].style.zIndex = -stt;
            this.sizeCards[i].style.filter = 'blur(5px)';
            this.sizeCards[i].style.opacity = stt > 2 ? 0 : 0.6;
            this.sizeCards[i].classList.remove('active');
        }
    }

    updateConfigFromActiveCard() {
        const activeCard = this.sizeCards[this.sizeActive];
        this.updateConfigFromCard(activeCard);
    }

    updateConfigFromCard(card) {
        this.config.size = card.dataset.size;
        this.config.sizeMultiplier = parseFloat(card.dataset.multiplier);
        this.updatePreview();
        this.updatePricing();
    }

    setupQuantityControls() {
        const quantityInput = document.getElementById('quantity');
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');
        const presets = document.querySelectorAll('.qty-preset');

        quantityInput.addEventListener('input', () => {
            this.config.quantity = parseInt(quantityInput.value) || 100;
            this.updatePricing();
        });

        minusBtn.addEventListener('click', () => {
            const currentQty = parseInt(quantityInput.value) || 100;
            const newQty = Math.max(50, currentQty - 50);
            quantityInput.value = newQty;
            this.config.quantity = newQty;
            this.updatePricing();
        });

        plusBtn.addEventListener('click', () => {
            const currentQty = parseInt(quantityInput.value) || 100;
            const newQty = Math.min(10000, currentQty + 50);
            quantityInput.value = newQty;
            this.config.quantity = newQty;
            this.updatePricing();
        });

        presets.forEach(preset => {
            preset.addEventListener('click', () => {
                const qty = parseInt(preset.dataset.qty);
                quantityInput.value = qty;
                this.config.quantity = qty;
                this.updatePricing();
            });
        });
    }

    updatePreview() {
        const selectedType = document.getElementById('selectedType');
        const selectedSpecs = document.getElementById('selectedSpecs');

        // Update text only (bag-shape removed)
        selectedType.textContent = this.config.type === 'printed' ? 'Baskılı Çanta' : 'Baskısız Çanta';
        selectedSpecs.textContent = `${this.config.colorName} - ${this.config.size} cm`;
    }

    updatePricing() {
        const unitPrice = this.config.basePrice * this.config.sizeMultiplier;
        const subtotal = unitPrice * this.config.quantity;
        const discount = this.config.quantity >= 500 ? 0.1 : 0;
        const total = subtotal * (1 - discount);

        document.getElementById('unitPrice').textContent = `${unitPrice.toFixed(2)}₺`;
        document.getElementById('totalQty').textContent = this.config.quantity.toString();
        document.getElementById('sizeMultiplier').textContent = `x${this.config.sizeMultiplier}`;
        document.getElementById('totalPrice').textContent = `${total.toFixed(0)}₺`;

        // Update discount info visibility
        const discountInfo = document.querySelector('.discount-info');
        if (this.config.quantity >= 500) {
            discountInfo.style.background = 'rgba(144, 238, 144, 0.2)';
            discountInfo.style.borderColor = 'rgba(144, 238, 144, 0.4)';
        } else {
            discountInfo.style.background = 'rgba(144, 238, 144, 0.1)';
            discountInfo.style.borderColor = 'rgba(144, 238, 144, 0.2)';
        }
    }
}

// Initialize sales manager
document.addEventListener('DOMContentLoaded', () => {
    new SalesManager();
});
