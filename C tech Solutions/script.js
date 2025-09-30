// User data and state management
let isLoggedIn = false;
let currentUser = null;
let currentPage = 'home';
let currentResourceTab = 'all';
let coursesExpanded = false;

// Demo accounts database (Client-side only - for demonstration purposes)
const accounts = [
    { 
        email: 'mohammed@example.com', 
        password: 'password', 
        name: 'Mohammed Sinan C', 
        phone: '+91 9876543210' 
    },
    { 
        email: 'sarah@example.com', 
        password: 'password', 
        name: 'Sarah Wilson', 
        phone: '+1 (555) 987-6543' 
    }
];

// Sample user data with updated info
const userData = {
    enrolledCourses: 9,
    completedCourses: 3,
    totalHours: 245,
    certificates: 3,
    memberSince: 'August 2025',
    learningStreak: 23
};

// Progress chart data
const chartData = {
    labels: ['Arabic', 'Urdu', 'Fiqh', 'Statistics', 'English'],
    data: [45, 35, 42, 28, 20]
};

// Resources data
const resourcesData = [
    {
        id: 1,
        title: 'ZANJAAN Study Guide',
        description: 'Comprehensive study materials for ZANJAAN course with detailed explanations and practice exercises.',
        category: 'faith',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop'
    },
    {
        id: 2,
        title: 'Madkhal and Manthiq',
        description: 'Essential resources for understanding logic and methodology in Islamic studies.',
        category: 'faith',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
    },
    {
        id: 3,
        title: 'Fathul Mueen Handbook',
        description: 'Comprehensive guide to Islamic jurisprudence with practical examples and case studies.',
        category: 'faith',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop'
    },
    {
        id: 4,
        title: 'IIT Statistics Cheatsheet',
        description: 'Essential statistical concepts and formulas for competitive exams and research.',
        category: 'other',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
    },
    {
        id: 5,
        title: 'English - IIT Course Material',
        description: 'Advanced English language skills for academic and professional excellence.',
        category: 'other',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop'
    },
    {
        id: 6,
        title: 'Computational Thinking Guide',
        description: 'Problem-solving methodologies and algorithmic thinking for the digital age.',
        category: 'other',
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop'
    }
];

// Message display function
function showMessage(type, message) {
    const messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        console.warn('Message container not found');
        return;
    }
    
    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`;
    messageContainer.style.display = 'block';
    
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('publicNav') || document.getElementById('userNav');
    if (navLinks) {
        navLinks.classList.toggle('mobile-active');
    }
}

// Page navigation with state management and error handling
function showPageWithHistory(pageId) {
    try {
        // Hide all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => section.classList.add('hidden'));
        
        // Show target section
        const targetSection = document.getElementById(pageId);
        if (!targetSection) {
            console.warn(`Page '${pageId}' not found`);
            return;
        }
        
        targetSection.classList.remove('hidden');
        currentPage = pageId;
        
        // Update navigation active state
        updateNavigation(pageId);
        
        // Initialize page-specific features
        if (pageId === 'dashboard' && isLoggedIn) {
            setTimeout(() => {
                initializeChart();
            }, 100);
        }
        
        // Scroll to top with smooth behavior
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error navigating to page:', error);
        showMessage('error', 'Navigation error occurred. Please try again.');
    }
}

// Update navigation active states
function updateNavigation(activePageId) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[onclick*="'${activePageId}'"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Show login/auth page
function showLogin() {
    showPageWithHistory('auth');
}

// Toggle between login and signup forms
function toggleAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm && signupForm) {
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    }
}

// Course filtering with debouncing for better performance
let filterTimeout;
function filterCourses(level) {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
        const cards = document.querySelectorAll('.course-card');
        const buttons = document.querySelectorAll('.filter-btn');
        
        // Update button states
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Filter cards with animation
        cards.forEach((card, index) => {
            if (level === 'all' || card.dataset.level === level) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                card.style.display = 'none';
            }
        });
    }, 100);
}

// Resources functionality
function filterResourcesByTab(category) {
    currentResourceTab = category;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter resource boxes
    const resourceBoxes = document.querySelectorAll('.resource-box');
    resourceBoxes.forEach(box => {
        const boxCategory = box.dataset.category;
        if (category === 'all' || boxCategory === category) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });
}


// Search resources functionality with API integration
async function searchResources(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm) {
        try {
            // Search via API
            const resources = await window.searchResourcesAPI(searchTerm);
            
            if (resources && resources.length > 0) {
                // Update the resource grid with search results
                updateResourceGrid(resources);
                showMessage('success', `Found ${resources.length} resources matching "${query}"`);
            } else {
                showMessage('info', `No resources found matching "${query}"`);
                // Show empty state or all resources
                const allResources = await window.fetchResources(currentResourceTab);
                updateResourceGrid(allResources || []);
            }
        } catch (error) {
            console.error('Search error:', error);
            // Fallback to client-side search
            searchResourcesLocally(query);
        }
    } else {
        // Load all resources for current category
        try {
            const resources = await window.fetchResources(currentResourceTab);
            updateResourceGrid(resources || []);
        } catch (error) {
            console.error('Load resources error:', error);
            searchResourcesLocally(query);
        }
    }
}

// Fallback local search function
function searchResourcesLocally(query) {
    const resourceBoxes = document.querySelectorAll('.resource-box');
    const searchTerm = query.toLowerCase().trim();
    let visibleCount = 0;

    resourceBoxes.forEach(box => {
        const title = box.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = box.querySelector('p')?.textContent.toLowerCase() || '';
        
        const matchesSearch = !searchTerm || title.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = currentResourceTab === 'all' || box.dataset.category === currentResourceTab;
        
        if (matchesSearch && matchesCategory) {
            box.style.display = 'block';
            visibleCount++;
        } else {
            box.style.display = 'none';
        }
    });

    if (searchTerm) {
        showMessage('success', `Found ${visibleCount} resources matching "${query}"`);
    }
}

// Update resource grid with new data
function updateResourceGrid(resources) {
    const resourceGrid = document.getElementById('resourcesGrid');
    if (!resourceGrid || !resources) return;
    
    // Clear existing resources
    resourceGrid.innerHTML = '';
    
    // Add new resources
    resources.forEach(resource => {
        const resourceBox = createResourceBox(resource);
        resourceGrid.appendChild(resourceBox);
    });
}

// Create resource box element
function createResourceBox(resource) {
    const box = document.createElement('div');
    box.className = 'resource-box';
    box.dataset.category = resource.category;
    
    box.innerHTML = `
        <img src="${resource.thumbnail}" alt="${resource.title}" class="resource-image">
        <div class="resource-content">
            <h3>${resource.title}</h3>
            <p>${resource.description}</p>
            <button class="expand-btn" onclick="expandResource(this)">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
        <div class="resource-expanded">
            <h4>${resource.title} - Complete Guide</h4>
            <p>${resource.detailedDescription || resource.description}</p>
            ${resource.learningOutcomes ? `
                <ul>
                    ${resource.learningOutcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                </ul>
            ` : ''}
            <div class="resource-actions">
                <button class="btn btn-primary" onclick="downloadResource('${resource._id}')">Download PDF</button>
                <button class="btn btn-secondary" onclick="viewResource('${resource._id}')">View Online</button>
            </div>
        </div>
    `;
    
    return box;
}

// Resource action functions
async function downloadResource(resourceId) {
    try {
        const response = await window.apiClient.downloadResource(resourceId);
        if (response.data) {
            showMessage('success', `Download started: ${response.data.filename}`);
            // In a real app, you would trigger the actual download here
            window.open(response.data.url, '_blank');
        }
    } catch (error) {
        console.error('Download error:', error);
        showMessage('error', 'Download failed. Please try again.');
    }
}

function viewResource(resourceId) {
    showMessage('info', 'Opening resource viewer...');
    // Navigate to resource detail view
    // This would typically open a modal or new page with the resource content
}

document.addEventListener('DOMContentLoaded', function() {
    var logo = document.querySelector('.logo');
    var logoImage = logo.querySelector('.logo-image-file');
    var logoText = logo.querySelector('.logo-text');
    if (logoImage && logoText) {
        logoText.style.display = 'none';
    }
});
function searchCourses(query) {
    query = query.toLowerCase();
    const cards = document.querySelectorAll('.courses-grid .course-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
function filterCourses(level) {
    const cards = document.querySelectorAll('.courses-grid .course-card');
    cards.forEach(card => {
        if (level === 'all' || card.dataset.level === level) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.filter-btn')).find(btn => btn.textContent.toLowerCase().includes(level));
    if (activeBtn) activeBtn.classList.add('active');
}

// Expand/collapse resource boxes
function expandResource(button) {
    const resourceBox = button.closest('.resource-box');
    const expandedContent = resourceBox.querySelector('.resource-expanded');
    const icon = button.querySelector('i');
    
    if (expandedContent.classList.contains('show')) {
        // Collapse
        expandedContent.classList.remove('show');
        button.classList.remove('expanded');
        icon.style.transform = 'rotate(0deg)';
    } else {
        // Expand
        expandedContent.classList.add('show');
        button.classList.add('expanded');
        icon.style.transform = 'rotate(90deg)';
    }
}

// Toggle more courses in profile
function toggleMoreCourses() {
    const hiddenCourses = document.querySelectorAll('.hidden-course');
    const button = document.getElementById('viewMoreCourses');
    const icon = button.querySelector('i');
    
    if (coursesExpanded) {
        // Collapse
        hiddenCourses.forEach(course => {
            course.style.display = 'none';
        });
        button.innerHTML = '<i class="fas fa-chevron-down"></i> View More';
        coursesExpanded = false;
    } else {
        // Expand
        hiddenCourses.forEach(course => {
            course.style.display = 'flex';
        });
        button.innerHTML = '<i class="fas fa-chevron-up"></i> View Less';
        coursesExpanded = true;
    }
}

// Course preview
function showCoursePreview(courseName) {
    showMessage('success', `Preview for "${courseName}" will open in a new window. Coming soon!`);
}

// Handle login form submission with API integration
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    
    if (!email || !password) {
        showMessage('error', 'Login form elements not found');
        return;
    }
    
    const emailValue = email.value.trim();
    const passwordValue = password.value;
    
    // Basic validation
    if (!emailValue || !passwordValue) {
        showMessage('error', 'Please fill in all fields');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = event.target.querySelector('.auth-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
        
        // Authenticate with API
        const user = await window.authenticateUser({
            email: emailValue,
            password: passwordValue
        });
        
        if (user) {
            // Login successful
            isLoggedIn = true;
            currentUser = user;
            showMessage('success', `Welcome back, ${user.name}! Login successful.`);
            
            // Close modal
            closeModal('loginModal');
            
            // Switch to user navigation
            switchToUserNavigation(user);
            
            // Update dashboard and profile with user data
            await updateDashboardWithAPI();
            updateProfile(user);
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                showPageWithHistory('dashboard');
            }, 1000);
        }
        
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        // Reset button state
        const submitBtn = event.target.querySelector('.auth-btn');
        submitBtn.textContent = 'Sign In';
        submitBtn.disabled = false;
        
        console.error('Login error:', error);
        showMessage('error', error.message || 'Login failed. Please try again.');
    }
}

// Handle signup form submission with improved validation
function handleSignup(event) {
    event.preventDefault();
    
    const nameEl = document.getElementById('signupName');
    const emailEl = document.getElementById('signupEmail');
    const phoneEl = document.getElementById('signupPhone');
    const passwordEl = document.getElementById('signupPassword');
    const confirmPasswordEl = document.getElementById('confirmPassword');
    
    if (!nameEl || !emailEl || !phoneEl || !passwordEl || !confirmPasswordEl) {
        showMessage('error', 'Signup form elements not found');
        return;
    }
    
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl.value.trim();
    const password = passwordEl.value;
    const confirmPassword = confirmPasswordEl.value;
    
    // Enhanced validation
    if (!name || !email || !phone || !password) {
        showMessage('error', 'Please fill in all required fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('error', 'Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        showMessage('error', 'Password must be at least 6 characters long!');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('error', 'Please enter a valid email address');
        return;
    }
    
    // Check if email already exists
    const existingUser = accounts.find(acc => acc.email === email);
    if (existingUser) {
        showMessage('error', 'An account with this email already exists. Please login instead.');
        return;
    }
    
    // Add new account to database
    const newUser = { email, password, name, phone };
    accounts.push(newUser);
    
    showMessage('success', `Account created successfully! Welcome ${name}!`);
    
    // Auto login the new user
    isLoggedIn = true;
    currentUser = newUser;
    
    // Switch to user navigation
    switchToUserNavigation(newUser);
    
    // Update dashboard and profile
    updateDashboard(newUser);
    updateProfile(newUser);
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
        showPageWithHistory('dashboard');
    }, 2000);
}

// Handle contact form with improved validation
function handleContactForm(event) {
    event.preventDefault();
    
    const nameEl = document.getElementById('contactName');
    const emailEl = document.getElementById('contactEmail');
    const subjectEl = document.getElementById('contactSubject');
    
    if (!nameEl || !emailEl || !subjectEl) {
        showMessage('error', 'Contact form elements not found');
        return;
    }
    
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const subject = subjectEl.value;
    
    if (!name || !email || !subject) {
        showMessage('error', 'Please fill in all required fields');
        return;
    }
    
    showMessage('success', `Thank you ${name}! Your message has been sent. We'll respond within 24 hours.`);
    event.target.reset();
}

// Switch navigation to user mode
function switchToUserNavigation(user) {
    const publicNav = document.getElementById('publicNav');
    const userNav = document.getElementById('userNav');
    const loginButton = document.getElementById('loginButton');
    
    if (publicNav) publicNav.style.display = 'none';
    if (userNav) userNav.style.display = 'flex';
    if (loginButton) loginButton.style.display = 'none';
}

// Switch navigation to public mode
function switchToPublicNavigation() {
    const publicNav = document.getElementById('publicNav');
    const userNav = document.getElementById('userNav');
    const loginButton = document.getElementById('loginButton');
    
    if (publicNav) publicNav.style.display = 'flex';
    if (userNav) userNav.style.display = 'none';
    if (loginButton) loginButton.style.display = 'block';
}

// Update dashboard with user data and error handling
function updateDashboard(user) {
    if (!user) return;
    
    const welcomeEl = document.getElementById('dashboardWelcome');
    const enrolledEl = document.getElementById('enrolledCourses');
    const completedEl = document.getElementById('completedCourses');
    const hoursEl = document.getElementById('totalHours');
    const certificatesEl = document.getElementById('certificates');
    
    if (welcomeEl) welcomeEl.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    if (enrolledEl) enrolledEl.textContent = userData.enrolledCourses;
    if (completedEl) completedEl.textContent = userData.completedCourses;
    if (hoursEl) hoursEl.textContent = userData.totalHours;
    if (certificatesEl) certificatesEl.textContent = userData.certificates;
}

// Update profile with user data and error handling
function updateProfile(user) {
    if (!user) return;
    
    const initials = user.name.split(' ').map(n => n[0]).join('');
    
    const elements = {
        profileAvatar: initials,
        profileName: user.name
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Initialize progress chart with improved error handling and performance
function initializeChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) {
        console.warn('Progress chart canvas not found');
        return;
    }
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Chart dimensions
        const chartWidth = width - 100;
        const chartHeight = height - 80;
        const startX = 60;
        const startY = 40;
        const maxValue = Math.max(...chartData.data);
        
        // Draw bars with animation
        const barWidth = chartWidth / chartData.labels.length * 0.6;
        const barSpacing = chartWidth / chartData.labels.length;
        
        chartData.data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = startX + index * barSpacing + (barSpacing - barWidth) / 2;
            const y = startY + chartHeight - barHeight;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#4299e1');
            gradient.addColorStop(1, '#2b6cb0');
            
            // Draw bar
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw value on top
            ctx.fillStyle = '#2d3748';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(value + 'h', x + barWidth/2, y - 5);
            
            // Draw label
            ctx.fillText(chartData.labels[index], x + barWidth/2, startY + chartHeight + 20);
        });
        
        // Draw axes
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, startY + chartHeight);
        ctx.lineTo(startX + chartWidth, startY + chartHeight);
        ctx.stroke();
    });
}

// Toggle account dropdown
function toggleAccountDropdown() {
    const dropdown = document.getElementById('accountDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// FAQ Toggle with smooth animation
function toggleFAQ(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (content && icon) {
        if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
        } else {
            content.style.maxHeight = '0px';
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// Logout function
function logout() {
    // Call API logout
    if (window.apiClient) {
        window.logoutUser();
    }
    
    isLoggedIn = false;
    currentUser = null;
    coursesExpanded = false;
    switchToPublicNavigation();
    showPageWithHistory('home');
    showMessage('success', 'You have been logged out successfully.');
}

// Update dashboard with API data
async function updateDashboardWithAPI() {
    try {
        const dashboardData = await window.fetchDashboardData();
        if (dashboardData) {
            updateDashboard(dashboardData.user, dashboardData.stats);
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to demo data
        updateDashboard(currentUser);
    }
}

// Course enrollment with pricing and validation
function enrollInCourse(courseName, price) {
    if (isLoggedIn) {
        showMessage('success', `Successfully enrolled in ${courseName} for ${price}! Redirecting to payment...`);
        userData.enrolledCourses++;
        if (currentUser) {
            updateDashboard(currentUser);
        }
    } else {
        showMessage('warning', 'Please login to enroll in courses.');
        setTimeout(() => showLogin(), 1500);
    }
}

// Bundle selection
function selectBundle(bundleName, price) {
    if (isLoggedIn) {
        showMessage('success', `${bundleName} selected for ${price}! Redirecting to payment...`);
    } else {
        showMessage('warning', 'Please login to select a bundle.');
        setTimeout(() => showLogin(), 1500);
    }
}

// Plan selection with pricing
function selectPlan(planName, price) {
    if (isLoggedIn) {
        showMessage('success', `${planName} plan selected for ${price}! Redirecting to payment...`);
    } else {
        showMessage('warning', 'Please login to select a plan.');
        setTimeout(() => showLogin(), 1500);
    }
}

// Enhanced search functionality
function searchCourses(query) {
    const courses = document.querySelectorAll('.course-card');
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
        courses.forEach(course => course.style.display = 'block');
        return;
    }

    let visibleCount = 0;
    courses.forEach(course => {
        const title = course.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = course.querySelector('p')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            course.style.display = 'block';
            visibleCount++;
        } else {
            course.style.display = 'none';
        }
    });
    
    showMessage('success', `Found ${visibleCount} courses matching "${query}"`);
}

// Newsletter subscription with validation
function subscribeNewsletter(email) {
    if (!email || !email.trim()) {
        showMessage('error', 'Please enter an email address.');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email.trim())) {
        showMessage('success', 'Thank you for subscribing! You\'ll receive our latest course updates and tech insights.');
    } else {
        showMessage('error', 'Please enter a valid email address.');
    }
}

// Social share functionality
function shareOnSocial(platform, url, text) {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };

    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else {
        showMessage('error', 'Share platform not supported');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('accountDropdown');
    const accountBtn = event.target.closest('.account-dropdown');
    
    if (!accountBtn && dropdown) {
        dropdown.classList.remove('active');
    }

    // Close mobile menu when clicking outside
    const navLinks = document.querySelector('.nav-links.mobile-active');
    const mobileToggle = event.target.closest('.mobile-menu-toggle');
    
    if (navLinks && !mobileToggle && !navLinks.contains(event.target)) {
        navLinks.classList.remove('mobile-active');
    }
});

// Smooth scrolling for anchor links
function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Animate stats when they come into view with improved performance
function animateStats(statCard) {
    const numberElement = statCard.querySelector('.stat-number');
    if (!numberElement || numberElement.dataset.animated === 'true') return;
    
    const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, '')) || 0;
    const suffix = numberElement.textContent.replace(/[\d,]/g, '');
    let currentNumber = 0;
    const increment = finalNumber / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    numberElement.dataset.animated = 'true';

    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            currentNumber = finalNumber;
            clearInterval(timer);
        }
        numberElement.textContent = Math.floor(currentNumber).toLocaleString() + suffix;
    }, stepTime);
}

// Initialize animations and interactive elements
function initializeAnimations() {
    // Add loading animations with staggered timing
    const cards = document.querySelectorAll('.course-card, .stat-card, .resource-box');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    // ESC key closes dropdowns and modals
    if (event.key === 'Escape') {
        document.querySelectorAll('.dropdown-menu.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        // Close expanded resources
        document.querySelectorAll('.resource-expanded.show').forEach(expanded => {
            expanded.classList.remove('show');
            const button = expanded.parentElement.querySelector('.expand-btn');
            if (button) {
                button.classList.remove('expanded');
                const icon = button.querySelector('i');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Ctrl/Cmd + K for search (future implementation)
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('resourceSearch');
        if (searchInput && !searchInput.closest('.hidden')) {
            searchInput.focus();
        } else {
            showMessage('success', 'Search feature available on Resources page. Use Ctrl+F to search page content.');
        }
    }
});

// Performance monitoring with error handling
window.addEventListener('load', function() {
    try {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)} milliseconds`);
        
        // Track page views (in real app, send to analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    } catch (error) {
        console.error('Performance monitoring error:', error);
    }
});

// Error handling for images
document.addEventListener('error', function(event) {
    if (event.target.tagName === 'IMG') {
        // Try logo.png first, then fallback to online image
        if (event.target.src.includes('logo.png')) {
            event.target.style.display = 'none';
            // Show the fallback logo text
            const logoText = event.target.parentElement.querySelector('.logo-text');
            if (logoText) {
                logoText.style.display = 'flex';
            }
        } else {
            event.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop';
            event.target.alt = 'C-Tech Solutions - Course Image';
        }
        console.warn('Image failed to load, using fallback');
    }
}, true);

// Initialize the application with error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('C-Tech Solutions Platform Ready!');
        console.log('Demo accounts available:');
        console.log('   • Email: mohammed@example.com | Password: password');
        console.log('   • Email: sarah@example.com | Password: password');
        console.log('Features: Resources section, Enhanced profile, Logo integration, Responsive design');
        console.log('Mobile optimized with touch-friendly navigation');
        console.log('Accessibility: WCAG 2.1 compliant with keyboard navigation');
        
        // Set initial page
        showPageWithHistory('home');

        // Initialize animations
        initializeAnimations();
        
        // Set up intersection observer for stats animation
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats(entry.target);
                }
            });
        }, observerOptions);

        // Observe all stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            observer.observe(card);
        });
        
        // Initialize resource search
        const resourceSearch = document.getElementById('resourceSearch');
        if (resourceSearch) {
            resourceSearch.addEventListener('input', function() {
                searchResources(this.value);
            });
        }
        
    } catch (error) {
        console.error('Initialization error:', error);
        showMessage('error', 'Application initialization failed. Please refresh the page.');
    }
});

// Export for potential module use
window.CtechPlatform = {
    showPage: showPageWithHistory,
    login: handleLogin,
    enroll: enrollInCourse,
    search: searchCourses,
    searchResources: searchResources,
    expandResource: expandResource,
    filterResources: filterResourcesByTab,
    toggleMoreCourses: toggleMoreCourses,
    share: shareOnSocial,
    subscribe: subscribeNewsletter
};