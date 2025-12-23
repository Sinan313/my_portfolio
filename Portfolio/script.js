// Theme Toggle (Using in-memory storage instead of localStorage)
let currentTheme = 'light';

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (currentTheme === 'light') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light';
        currentTheme = 'dark';
    } else {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark';
        currentTheme = 'light';
    }
}

// Mobile Menu Toggle
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-menu').classList.remove('active');
        document.querySelector('.hamburger').classList.remove('active');
    });
});

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    
    document.querySelector('.scroll-indicator').style.width = scrollProgress + '%';
});

// Fade in animation on scroll
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

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add active state to navigation links
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect after page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 100);
        }, 1000);
    }
});

// Add particle effect to hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesCount = 50;
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 3 + 2}s ease-in-out infinite`;
        particle.style.zIndex = '0';
        
        hero.appendChild(particle);
    }
}

// Add floating animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Initialize particles
createParticles();

// Add scroll-triggered animations for project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add scroll-triggered animations for certification cards
const certificationCards = document.querySelectorAll('.certification-card');
certificationCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Trigger animations when certification cards come into view
const certCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

certificationCards.forEach(card => certCardObserver.observe(card));

// Preload placeholder images
function preloadImages() {
    const imagesToPreload = [
        'https://via.placeholder.com/400x250?text=E-Commerce+Platform',
        'https://via.placeholder.com/400x250?text=Task+Management+App',
        'https://via.placeholder.com/400x250?text=Analytics+Dashboard',
        'https://via.placeholder.com/400x250?text=Music+Streaming+App',
        'https://via.placeholder.com/400x250?text=Real+Estate+Platform',
        'https://via.placeholder.com/400x250?text=Portfolio+Website'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Add skills animation
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// Add project cards stagger animation
const cards = document.querySelectorAll('.project-card');
cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Trigger animations when cards come into view
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => cardObserver.observe(card));

// Add smooth reveal for sections
const sections = document.querySelectorAll('.section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease';
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => sectionObserver.observe(section));

// Enhanced form validation and feedback
document.getElementById('contactForm').addEventListener('input', function(e) {
    const field = e.target;
    const fieldName = field.name;
    
    // Remove previous error styling
    field.style.borderColor = '';
    
    // Real-time validation
    if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.value && !emailRegex.test(field.value)) {
            field.style.borderColor = '#ef4444';
        } else if (field.value) {
            field.style.borderColor = '#10b981';
        }
    }
    
    if (fieldName === 'name' || fieldName === 'subject' || fieldName === 'message') {
        if (field.value.trim()) {
            field.style.borderColor = '#10b981';
        }
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add counter animation for stats (if you want to add stats later)
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Certificate card hover effects
document.querySelectorAll('.certification-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add cert link click tracking (for analytics if needed)
document.querySelectorAll('.cert-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // You can add analytics tracking here
        console.log('Certificate link clicked:', this.closest('.certification-card').querySelector('.cert-title').textContent);
    });
});

// Certifications section fade-in animation
const certificationSection = document.getElementById('certifications');
if (certificationSection) {
    const certObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.certification-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, index * 150);
                });
            }
        });
    }, { threshold: 0.2 });
    
    certObserver.observe(certificationSection);
}

// Initialize all animations and interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize certification card animations
    const certCards = document.querySelectorAll('.certification-card');
    certCards.forEach((card, index) => {
        // Add staggered entrance animation
        card.style.animationDelay = `${index * 0.15}s`;
        card.classList.add('fade-in-cert');
    });
    
    // Initialize image preloading
    preloadImages();
});

// Add certification-specific animations
const certStyle = document.createElement('style');
certStyle.textContent = `
    .fade-in-cert {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
        animation: fadeInCert 0.8s ease forwards;
    }
    
    @keyframes fadeInCert {
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .certification-card {
        transform-origin: center;
    }
    
    .cert-icon {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(certStyle);

// Add a subtle scroll indicator for long content
function addScrollHint() {
    const scrollHint = document.createElement('div');
    scrollHint.innerHTML = '<i class="fas fa-chevron-down"></i>';
    scrollHint.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--primary-color);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.7;
        transition: all 0.3s ease;
        z-index: 1000;
        animation: bounce 2s infinite;
    `;
    
    scrollHint.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
    
    // Hide scroll hint when user scrolls past hero
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > window.innerHeight * 0.5) {
            scrollHint.style.opacity = '0';
            scrollHint.style.pointerEvents = 'none';
        } else {
            scrollHint.style.opacity = '0.7';
            scrollHint.style.pointerEvents = 'auto';
        }
    });
    
    document.body.appendChild(scrollHint);
}

// Add bounce animation for scroll hint
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(bounceStyle);

// Initialize scroll hint
addScrollHint();

// Enhanced mobile menu functionality
function handleMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }
    });
}

// Initialize mobile menu handling
handleMobileMenu();

// Add loading state for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        // Handle broken images gracefully
        this.style.display = 'none';
        console.warn('Image failed to load:', this.src);
    });
});

// Initialize image preloading
preloadImages();

// Certificate Modal Functions
function openCertificateModal(certificateImageSrc, certificateTitle = 'Certificate', downloadUrl = '', originalUrl = '') {
    const modal = document.getElementById('certificateModal');
    const titleElement = document.getElementById('certificateTitle');
    const imageElement = document.getElementById('certificateFullImage');
    const loaderElement = document.getElementById('certificateLoader');
    const downloadBtn = document.getElementById('certificateDownload');
    const originalBtn = document.getElementById('certificateOriginal');
    
    // Set modal content
    titleElement.textContent = certificateTitle;
    
    // Show loading state
    imageElement.style.display = 'none';
    loaderElement.style.display = 'block';
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Generate certificate image with a small delay for better UX
    setTimeout(() => {
        const certificateUrl = getCertificateImageUrl(certificateImageSrc);
        
        imageElement.onload = () => {
            loaderElement.style.display = 'none';
            imageElement.style.display = 'block';
        };
        
        imageElement.src = certificateUrl;
        imageElement.alt = certificateTitle;
    }, 500); // Small delay to show loading state
    
    // Check if there's a PDF version for download
    const pdfUrl = getCertificatePDFUrl(certificateImageSrc);
    
    // Set download link
    if (pdfUrl) {
        // Use PDF for download if available
        downloadBtn.href = pdfUrl;
        downloadBtn.download = pdfUrl.split('/').pop();
        downloadBtn.style.display = 'inline-flex';
    } else if (downloadUrl) {
        // Use provided download URL
        downloadBtn.href = downloadUrl;
        downloadBtn.style.display = 'inline-flex';
    } else {
        downloadBtn.style.display = 'none';
    }
    
    // Set original/verification link
    if (originalUrl) {
        originalBtn.href = originalUrl;
        originalBtn.innerHTML = '<i class="fas fa-external-link-alt"></i>View Original';
        originalBtn.style.display = 'inline-flex';
    } else if (pdfUrl) {
        // If no original URL but has PDF, use PDF as "View PDF"
        originalBtn.href = pdfUrl;
        originalBtn.target = '_blank';
        originalBtn.innerHTML = '<i class="fas fa-file-pdf"></i>View PDF';
        originalBtn.style.display = 'inline-flex';
    } else {
        originalBtn.style.display = 'none';
    }
}

function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable background scrolling
}

function getCertificateImageUrl(imageName) {
    // For modal display, we'll generate certificate images dynamically
    // This will show actual certificate designs instead of stock photos
    return generateCertificateImage(imageName);
}

function generateCertificateImage(imageName) {
    // Certificate data mapping
    const certificateData = {
        'fullstack-cert': {
            title: 'CERTIFICATE OF COMPLETION',
            course: 'Full Stack Web Development',
            issuer: 'freeCodeCamp',
            date: 'December 2024',
            color: '#2563eb',

        },
        'javascript-cert': {
            title: 'CERTIFICATE OF COMPLETION',
            course: 'JavaScript Algorithms and Data Structures',
            issuer: 'freeCodeCamp', 
            date: 'November 2024',
            color: '#2563eb',
        
        },
        'react-cert': {
            title: 'CERTIFICATE OF COMPLETION',
            course: 'React - The Complete Guide',
            issuer: 'Udemy',
            date: 'October 2024',
            color: '#2563eb',
        
        },
        'nodejs-cert': {
            title: 'CERTIFICATE OF COMPLETION',
            course: 'Node.js Developer Certification',
            issuer: 'MongoDB University',
            date: 'September 2024',
            color: '#2563eb',
            
        },
        'aws-cert': {
            title: 'AWS CERTIFICATION',
            course: 'AWS Cloud Practitioner',
            issuer: 'Amazon Web Services',
            date: 'August 2024',
            color: '#ff9900',
    
        },
        'vls-cert': {
            title: 'VLSI CERTIFICATION', 
            course: 'VLSI Design and Verification',
            issuer: 'VLSI Institute',
            date: 'June 2024',
            color: '#059669',

        }
    };
    
    return createCertificateCanvas(certificateData[imageName] || certificateData['fullstack-cert']);
}

// Get PDF download URLs
function getCertificatePDFUrl(imageName) {
    const pdfUrls = {
        'aws-cert': './AWS Job Simution.pdf',
        'vls-cert': './vlsi 1-499_signed.pdf'
    };
    return pdfUrls[imageName] || null;
}

function createCertificateCanvas(certData) {
    // Create a data URL for the certificate using canvas or return an HTML-based certificate
    // For now, we'll return a placeholder and implement HTML-based certificates in the modal
    return `data:image/svg+xml,${encodeURIComponent(createCertificateSVG(certData))}`;
}

function createCertificateSVG(certData) {
    return `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="800" height="600" fill="url(#grad1)" stroke="${certData.color}" stroke-width="8"/>
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="${certData.color}" stroke-width="2"/>
        
        <!-- Title -->
        <text x="400" y="120" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="${certData.color}">${certData.title}</text>
        
        <!-- Subtitle -->
        <text x="400" y="160" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#64748b">This certifies that</text>
        
        <!-- Recipient -->
        <text x="400" y="220" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#1e293b">Mohammed Sinan C</text>
        
        <!-- Course title -->
        <text x="400" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#64748b">has successfully completed</text>
        <text x="400" y="340" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#1e293b">${certData.course}</text>
        
        <!-- Issuer -->
        <text x="400" y="420" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-weight="bold" fill="${certData.color}">${certData.issuer}</text>
        
        <!-- Date -->
        <text x="400" y="450" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#64748b">${certData.date}</text>
        
        <!-- Seal -->
        <circle cx="680" cy="520" r="40" fill="${certData.color}"/>
        <text x="680" y="530" text-anchor="middle" font-family="Arial" font-size="24">${certData.icon}</text>
        
        <!-- Signature line -->
        <line x1="100" y1="520" x2="300" y2="520" stroke="#64748b" stroke-width="2"/>
        <text x="200" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="#64748b">Authorized Signature</text>
    </svg>`;
}

// Add click event listeners to certificate images
document.addEventListener('DOMContentLoaded', function() {
    const certImageContainers = document.querySelectorAll('.cert-image-container');
    
    certImageContainers.forEach(container => {
        container.addEventListener('click', function() {
            const certCard = this.closest('.certification-card');
            const certTitle = certCard.querySelector('.cert-title').textContent;
            const certLink = certCard.querySelector('.cert-link');
            
            // Map certificate titles to image names
            let imageName = 'fullstack-cert'; // default
            let downloadFileName = 'certificate.jpg';
            
            if (certTitle.includes('JavaScript') || certTitle.includes('Algorithms')) {
                imageName = 'javascript-cert';
                downloadFileName = 'javascript-certificate.jpg';
            } else if (certTitle.includes('React')) {
                imageName = 'react-cert';
                downloadFileName = 'react-certificate.jpg';
            } else if (certTitle.includes('Python')) {
                imageName = 'python-cert';
                downloadFileName = 'python-certificate.jpg';
            } else if (certTitle.includes('Node')) {
                imageName = 'nodejs-cert';
                downloadFileName = 'nodejs-certificate.jpg';
            } else if (certTitle.includes('AWS') || certTitle.includes('Cloud')) {
                imageName = 'aws-cert';
                downloadFileName = 'AWS Job Simution.pdf';
            } else if (certTitle.includes('VLSI') || certTitle.includes('VLS')) {
                imageName = 'vls-cert';
                downloadFileName = 'vlsi 1-499_signed.pdf';
            } else if (certTitle.includes('Full Stack')) {
                imageName = 'fullstack-cert';
                downloadFileName = 'fullstack-certificate.jpg';
            }
            
            const originalUrl = certLink ? certLink.href : '';
            const downloadUrl = getCertificateImageUrl(imageName);
            
            // Open modal with your certificate image
            openCertificateModal(imageName, certTitle, downloadUrl, originalUrl);
        });
    });
    
    // Also add click listeners to "View Certificate" links
    const certLinks = document.querySelectorAll('.cert-link');
    certLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            
            // Trigger the image container click
            const certCard = this.closest('.certification-card');
            const imageContainer = certCard.querySelector('.cert-image-container');
            if (imageContainer) {
                imageContainer.click();
            }
        });
    });
});

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCertificateModal();
    }
});

// Certificate sharing functionality
function shareCertificate() {
    const certificateTitle = document.getElementById('certificateTitle').textContent;
    const shareData = {
        title: `${certificateTitle} - Mohammed Sinan C`,
        text: `Check out my ${certificateTitle} certificate!`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        window.open(shareUrl, '_blank');
    }
}

// Certificate download functionality
async function downloadCertificate(certificateUrl, fileName) {
    try {
        const response = await fetch(certificateUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    }
}