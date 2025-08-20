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

// Scroll indicator click
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        document.getElementById('about').scrollIntoView({
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
document.querySelectorAll('.about-section, .products-section, .testimonials-section, .contact-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Card Slider Functionality
let cardItems = document.querySelectorAll('.card-slider .card-item');
let cardActive = 4;

function loadCardShow(){
    cardItems[cardActive].style.transform = `translate(-50%, -50%)`;
    cardItems[cardActive].style.zIndex = 1;
    cardItems[cardActive].style.filter = 'none';
    cardItems[cardActive].style.opacity = 1;
    
    // show after
    let stt = 0;
    for(var i = cardActive + 1; i < cardItems.length; i++){
        stt++;
        cardItems[i].style.transform = `translate(-50%, -50%) translateX(${120*stt}px) scale(${1 - 0.2*stt}) perspective(16px) rotateY(-1deg)`;
        cardItems[i].style.zIndex = -stt;
        cardItems[i].style.filter = 'blur(5px)';
        cardItems[i].style.opacity = stt > 2 ? 0 : 0.6;
    }
    
    stt = 0;
    for(var i = (cardActive - 1); i >= 0; i--){
        stt++;
        cardItems[i].style.transform = `translate(-50%, -50%) translateX(${-120*stt}px) scale(${1 - 0.2*stt}) perspective(16px) rotateY(1deg)`;
        cardItems[i].style.zIndex = -stt;
        cardItems[i].style.filter = 'blur(5px)';
        cardItems[i].style.opacity = stt > 2 ? 0 : 0.6;
    }
}

// Initialize card slider
if(cardItems.length > 0) {
    loadCardShow();
    
    let cardNext = document.getElementById('card-next');
    let cardPrev = document.getElementById('card-prev');
    
    if(cardNext) {
        cardNext.onclick = function(){
            cardActive = cardActive + 1 < cardItems.length ? cardActive + 1 : cardActive;
            loadCardShow();
        }
    }
    
    if(cardPrev) {
        cardPrev.onclick = function(){
            cardActive = cardActive - 1 >= 0 ? cardActive - 1 : cardActive;
            loadCardShow();
        }
    }
}
