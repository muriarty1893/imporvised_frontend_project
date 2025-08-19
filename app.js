// Gopak Website JavaScript Functions

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
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
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
