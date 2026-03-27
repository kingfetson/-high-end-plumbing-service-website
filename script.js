/**
 * NAIROBI PRO PLUMBING - Premium JavaScript Functionality
 * Smooth interactions, form validation, animations & conversions
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM ELEMENTS =====
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose = document.getElementById('mobile-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    const loadingSpinner = document.getElementById('loading-spinner');
    const floatingWhatsapp = document.querySelector('.floating-whatsapp');
    const yearEl = document.getElementById('year');
    
    // ===== INITIAL SETUP =====
    // Set current year in footer
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    // Hide loading spinner after page load
    setTimeout(() => {
        loadingSpinner.classList.add('hidden');
    }, 800);
    
    // ===== STICKY HEADER =====
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Initial check
    
    // ===== MOBILE MENU TOGGLE =====
    const toggleMobileMenu = (show) => {
        if (show) {
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            hamburger.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    };
    
    hamburger.addEventListener('click', () => toggleMobileMenu(true));
    mobileClose.addEventListener('click', () => toggleMobileMenu(false));
    mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));
    
    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMobileMenu(false);
        }
    });
    
    // ===== SMOOTH SCROLLING FOR NAVIGATION =====
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (!element) return;
        
        const headerHeight = header.offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };
    
    // Desktop nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            smoothScroll(target);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Mobile nav links already close menu, add smooth scroll
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            setTimeout(() => smoothScroll(target), 300);
        });
    });
    
    // Scroll indicator in hero
    const scrollIndicator = document.querySelector('.scroll-down');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScroll('#services');
        });
    }
    
    // ===== SCROLL REVEAL ANIMATIONS (Intersection Observer) =====
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // ===== FORM VALIDATION & SUBMISSION =====
    if (contactForm) {
        const formFields = {
            name: document.getElementById('name'),
            phone: document.getElementById('phone'),
            service: document.getElementById('service'),
            message: document.getElementById('message')
        };
        
        const errorMessages = {
            name: 'Please enter your full name',
            phone: 'Please enter a valid Kenyan phone number (e.g., +254712345678)',
            service: 'Please select a service',
            message: 'Please describe your plumbing issue'
        };
        
        // Real-time validation
        Object.entries(formFields).forEach(([field, element]) => {
            if (!element) return;
            
            // Validate on blur
            element.addEventListener('blur', () => validateField(field, element));
            
            // Clear error on input
            element.addEventListener('input', () => {
                if (element.classList.contains('error')) {
                    element.classList.remove('error');
                    document.getElementById(`${field}-error`).classList.remove('show');
                }
            });
        });
        
        // Validate individual field
        const validateField = (fieldName, element) => {
            const errorEl = document.getElementById(`${fieldName}-error`);
            let isValid = true;
            
            // Remove previous error state
            element.classList.remove('error');
            errorEl.classList.remove('show');
            
            // Validation rules
            switch(fieldName) {
                case 'name':
                    if (element.value.trim().length < 2) {
                        isValid = false;
                    }
                    break;
                    
                case 'phone':
                    // Kenyan phone format: +2547XXXXXXXX or 07XXXXXXXX
                    const phoneRegex = /^(\+254|0)[71]\d{8}$/;
                    if (!phoneRegex.test(element.value.trim())) {
                        isValid = false;
                    }
                    break;
                    
                case 'service':
                    if (!element.value) {
                        isValid = false;
                    }
                    break;
                    
                case 'message':
                    if (element.value.trim().length < 10) {
                        isValid = false;
                    }
                    break;
            }
            
            // Show error if invalid
            if (!isValid) {
                element.classList.add('error');
                errorEl.textContent = errorMessages[fieldName];
                errorEl.classList.add('show');
            }
            
            return isValid;
        };
        
        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            const fields = Object.entries(formFields);
            let isFormValid = true;
            
            fields.forEach(([fieldName, element]) => {
                if (!validateField(fieldName, element)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                // Focus first invalid field
                const firstError = contactForm.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            formMessage.className = 'form-message';
            formMessage.style.display = 'none';
            
            // Simulate form submission (replace with actual API call)
            try {
                // In production, replace this with fetch() to your backend
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success handling
                formMessage.textContent = '✅ Thank you! We\'ll contact you within 15 minutes.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Optional: Send to WhatsApp as backup
                // sendToWhatsApp(formFields);
                
            } catch (error) {
                // Error handling
                formMessage.textContent = '❌ Something went wrong. Please call us directly: +254 700 123 456';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
                console.error('Form submission error:', error);
            } finally {
                // Hide loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Auto-hide success message after 10 seconds
                if (formMessage.classList.contains('success')) {
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 10000);
                }
            }
        });
        
        // Optional: Fallback - send form data to WhatsApp
        const sendToWhatsApp = (fields) => {
            const name = fields.name.value.trim();
            const phone = fields.phone.value.trim();
            const service = fields.service.options[fields.service.selectedIndex].text;
            const message = fields.message.value.trim();
            
            const whatsappText = `*New Plumbing Inquiry*%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Service:* ${service}%0A*Message:* ${message}`;
            const whatsappUrl = `https://wa.me/254700123456?text=${whatsappText}`;
            
            // Open WhatsApp in new tab (user must confirm)
            window.open(whatsappUrl, '_blank');
        };
    }
    
    // ===== FLOATING WHATSAPP BUTTON ENHANCEMENTS =====
    if (floatingWhatsapp) {
        // Add click tracking (optional analytics)
        floatingWhatsapp.addEventListener('click', () => {
            // Could send event to Google Analytics here
            console.log('WhatsApp button clicked');
        });
        
        // Hide on contact section to avoid redundancy
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        floatingWhatsapp.style.opacity = '0';
                        floatingWhatsapp.style.pointerEvents = 'none';
                    } else {
                        floatingWhatsapp.style.opacity = '1';
                        floatingWhatsapp.style.pointerEvents = 'auto';
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(contactSection);
        }
    }
    
    // ===== PERFORMANCE: LAZY LOAD IMAGES (if needed) =====
    // Modern browsers support native lazy loading via HTML attribute
    // This is already set in the img tag: loading="lazy"
    
    // ===== UTILITY: Debounce function for scroll events =====
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveNav = debounce(() => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100);
    
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    
    // ===== KEYBOARD NAVIGATION SUPPORT =====
    // Improve accessibility for hamburger button
    if (hamburger) {
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu(true);
            }
        });
    }
    
    // ===== CONVERSION OPTIMIZATION: CLICK-TO-CALL TRACKING =====
    // Track call button clicks (optional analytics)
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            console.log('Call button clicked:', link.href);
            // Could send to analytics: gtag('event', 'click', { 'event_category': 'phone', 'event_label': 'header_cta' });
        });
    });
    
    // ===== ERROR HANDLING: GLOBAL =====
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        // Could send to error tracking service
    });
    
    // ===== CONSOLE WELCOME MESSAGE =====
    console.log('%c🚰 Nairobi Pro Plumbing', 'color: #ff6b35; font-size: 16px; font-weight: bold;');
    console.log('%cPremium plumbing services in Nairobi. Need help? Call +254 700 123 456', 'color: #0066ff; font-size: 12px;');
});
