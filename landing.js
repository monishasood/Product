// ===== Landing Page & Navigation JavaScript =====

// Show landing page on load
document.addEventListener('DOMContentLoaded', () => {
    // Hide splash after 2 seconds
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
    }, 2000);
});

// ===== Navigation =====
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

function handleNavClick(section) {
    // Close mobile menu
    document.getElementById('nav-menu').classList.remove('active');
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function switchToApp() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    document.getElementById('top-nav').style.display = 'none';
    window.scrollTo(0, 0);
    
    // Initialize app if not already done
    if (!window.appInitialized) {
        initializeApp();
        window.appInitialized = true;
    }
}

function backToLanding() {
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('app-section').style.display = 'none';
    document.getElementById('top-nav').style.display = 'block';
    window.scrollTo(0, 0);
}

// ===== FAQ Accordion =====
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked FAQ if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ===== Social Sharing =====
function shareOn(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out FreshPlate - Save $1,600/year by reducing food waste! 🍽️');
    
    let shareUrl;
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyLink() {
    const url = window.location.href;
    
    // Try using Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopy(url);
        });
    } else {
        fallbackCopy(url);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        alert('Could not copy link. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textarea);
}

function showCopySuccess() {
    const button = event.target.closest('.share-btn');
    const originalHTML = button.innerHTML;
    
    button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        Copied!
    `;
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 2000);
}

// ===== Tooltips =====
document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('tooltip');
    const cardsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    cardsWithTooltips.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const text = card.getAttribute('data-tooltip');
            tooltip.textContent = text;
            tooltip.classList.add('active');
            positionTooltip(e);
        });
        
        card.addEventListener('mousemove', (e) => {
            positionTooltip(e);
        });
        
        card.addEventListener('mouseleave', () => {
            tooltip.classList.remove('active');
        });
    });
    
    function positionTooltip(e) {
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        
        let left = e.pageX - tooltipWidth / 2;
        let top = e.pageY - tooltipHeight - 10;
        
        // Keep tooltip on screen
        if (left < 10) left = 10;
        if (left + tooltipWidth > window.innerWidth - 10) {
            left = window.innerWidth - tooltipWidth - 10;
        }
        if (top < 10) top = e.pageY + 10;
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }
});

// ===== Sticky Navigation =====
let lastScroll = 0;
const nav = document.getElementById('top-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.classList.add('scrolled');
        
        if (currentScroll > lastScroll) {
            // Scrolling down - hide nav
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show nav
            nav.style.transform = 'translateY(0)';
        }
    } else {
        nav.classList.remove('scrolled');
        nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ===== Smooth Scroll for All Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .faq-item, .help-card, .hero-stat');
    animatedElements.forEach(el => observer.observe(el));
});

// ===== Initialize App Function =====
function initializeApp() {
    // This function will trigger your existing app initialization
    // Load data, set up views, etc.
    console.log('App initialized');
    
    // You can call your existing init functions here
    if (typeof loadData === 'function') loadData();
    if (typeof setDefaultDate === 'function') setDefaultDate();
    if (typeof updateAllViews === 'function') updateAllViews();
}

// ===== Mobile Menu Close on Resize =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('nav-menu').classList.remove('active');
    }
});

// ===== Feature Card Hover Effects (Mobile Touch) =====
if ('ontouchstart' in window) {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        });
    });
}
