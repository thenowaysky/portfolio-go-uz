// Navbar scroll effect
const navbar = document.getElementById('navbar');
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navbarToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
    const icon = navbarToggle.querySelector('i');
    if (navbarMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking on a link
navbarMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
        const icon = navbarToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Typing effect
const typingText = document.getElementById('typingText');
const texts = [
    'Java Backend Developer',
    'Golang Developer',
    'WordPress Expert',
    'Microservices Architect',
    'Full-Stack Backend Dev'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentText = texts[textIndex];

    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500; // Pause before typing next text
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Contact form validation and submission
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate individual field
function validateField(input, validator) {
    const formGroup = input.parentElement;

    if (validator(input.value)) {
        formGroup.classList.remove('error');
        return true;
    } else {
        formGroup.classList.add('error');
        return false;
    }
}

// Validators
const validators = {
    name: (value) => value.trim().length >= 2,
    email: (value) => emailRegex.test(value.trim()),
    message: (value) => value.trim().length >= 10
};

// Real-time validation
nameInput.addEventListener('blur', () => validateField(nameInput, validators.name));
emailInput.addEventListener('blur', () => validateField(emailInput, validators.email));
messageInput.addEventListener('blur', () => validateField(messageInput, validators.message));

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField(nameInput, validators.name);
    const isEmailValid = validateField(emailInput, validators.email);
    const isMessageValid = validateField(messageInput, validators.message);

    if (isNameValid && isEmailValid && isMessageValid) {
        // Get form data
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };

        // Send to backend
        sendToBackend(formData);
    } else {
        showNotification('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring', 'error');
    }
});

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
        font-weight: 500;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect removed to prevent overlap issues

// Backend integration function
async function sendToBackend(formData) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            showNotification(data.message || 'Xabaringiz muvaffaqiyatli yuborildi!', 'success');
            // Reset form only on success
            contactForm.reset();
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', 'error');
    }
}
