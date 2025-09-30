// Application State
let currentTab = 'home';
let selectedCourse = null;
let userRole = 'student';

// Sample Data
const courses = [
    {
        id: 1,
        title: 'Tafseer al-Quran',
        instructor: 'Ustadh Ahmad Hassan',
        students: 45,
        lessons: 24,
        progress: 65,
        description: 'Comprehensive study of Quranic interpretation',
        category: 'Quran Studies',
        level: 'Intermediate'
    },
    {
        id: 2,
        title: 'Hadith Sciences',
        instructor: 'Ustadh Omar Farooq',
        students: 32,
        lessons: 18,
        progress: 40,
        description: 'Study of Prophetic traditions and their authenticity',
        category: 'Hadith Studies',
        level: 'Advanced'
    },
    {
        id: 3,
        title: 'Arabic Grammar (Nahw)',
        instructor: 'Ustadha Fatima Ali',
        students: 28,
        lessons: 30,
        progress: 80,
        description: 'Classical Arabic grammar fundamentals',
        category: 'Arabic Language',
        level: 'Beginner'
    },
    {
        id: 4,
        title: 'Islamic Jurisprudence (Fiqh)',
        instructor: 'Ustadh Muhammad Yusuf',
        students: 38,
        lessons: 22,
        progress: 55,
        description: 'Understanding Islamic law and its applications',
        category: 'Fiqh Studies',
        level: 'Intermediate'
    }
];

const assignments = [
    {
        id: 1,
        title: 'Tafseer Analysis - Surah Al-Baqarah',
        course: 'Tafseer al-Quran',
        dueDate: '2025-09-10',
        status: 'pending',
        type: 'essay'
    },
    {
        id: 2,
        title: 'Hadith Memorization Test',
        course: 'Hadith Sciences',
        dueDate: '2025-09-08',
        status: 'submitted',
        type: 'oral'
    },
    {
        id: 3,
        title: 'Arabic Grammar Exercises',
        course: 'Arabic Grammar (Nahw)',
        dueDate: '2025-09-12',
        status: 'graded',
        grade: 92,
        type: 'practice'
    },
    {
        id: 4,
        title: 'Fiqh Case Study',
        course: 'Islamic Jurisprudence (Fiqh)',
        dueDate: '2025-09-15',
        status: 'pending',
        type: 'research'
    }
];

const notifications = [
    {
        id: 1,
        title: 'Assignment Graded',
        message: 'Your Arabic Grammar assignment has been graded. Score: 92%',
        time: '2 hours ago',
        type: 'grade',
        read: false
    },
    {
        id: 2,
        title: 'New Course Material',
        message: 'New materials uploaded for Tafseer al-Quran course',
        time: '1 day ago',
        type: 'course',
        read: false
    },
    {
        id: 3,
        title: 'Upcoming Class',
        message: 'Hadith Sciences class starts in 30 minutes',
        time: '3 days ago',
        type: 'reminder',
        read: true
    }
];

const students = [
    { name: 'Ahmed Abdullah', course: 'Tafseer al-Quran', progress: 85, status: 'active' },
    { name: 'Fatima Hassan', course: 'Arabic Grammar', progress: 92, status: 'active' },
    { name: 'Omar Malik', course: 'Hadith Sciences', progress: 76, status: 'active' },
    { name: 'Aisha Rahman', course: 'Islamic Jurisprudence', progress: 88, status: 'active' },
    { name: 'Yusuf Ahmad', course: 'Tafseer al-Quran', progress: 65, status: 'inactive' }
];

const books = [
    {
        title: 'Sahih al-Bukhari',
        author: 'Imam al-Bukhari',
        category: 'Hadith',
        pages: 2000,
        type: 'PDF',
        available: true
    },
    {
        title: 'Tafseer Ibn Kathir',
        author: 'Ibn Kathir',
        category: 'Tafseer',
        pages: 3200,
        type: 'PDF',
        available: true
    },
    {
        title: 'Al-Hidayah',
        author: 'Al-Marghinani',
        category: 'Fiqh',
        pages: 1500,
        type: 'PDF',
        available: false
    },
    {
        title: 'Riyadh as-Saliheen',
        author: 'Imam an-Nawawi',
        category: 'Hadith',
        pages: 800,
        type: 'PDF',
        available: true
    },
    {
        title: 'The Noble Quran',
        author: 'Translation',
        category: 'Quran',
        pages: 600,
        type: 'PDF',
        available: true
    },
    {
        title: 'Fiqh us-Sunnah',
        author: 'Sayyid Sabiq',
        category: 'Fiqh',
        pages: 1200,
        type: 'PDF',
        available: true
    }
];

// Utility Functions
function createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to selected nav item
    const navItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    currentTab = tabName;
    loadTabContent(tabName);
}

function loadTabContent(tabName) {
    switch (tabName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'courses':
            renderCourses();
            break;
        case 'assignments':
            renderAssignments();
            break;
        case 'quran':
            renderQuranStudy();
            break;
        case 'library':
            renderLibrary();
            break;
        case 'calendar':
            renderCalendar();
            break;
        case 'students':
            renderStudents();
            break;
        case 'notifications':
            renderNotifications();
            break;
        case 'settings':
            renderSettings();
            break;
    }
}

// Render Functions
function renderDashboard() {
    const dashboardTab = document.getElementById('dashboard');
    
    const statsHTML = `
        <div class="dashboard-banner">
            <h1>Assalamu Alaikum, Ahmed</h1>
            <p>Continue your Islamic studies journey</p>
        </div>
        
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="font-size: 0.875rem; color: #6b7280;">Enrolled Courses</p>
                        <p style="font-size: 2rem; font-weight: bold; color: #059669;">4</p>
                    </div>
                    <i data-lucide="book-open" style="width: 2rem; height: 2rem; color: #059669;"></i>
                </div>
            </div>
            <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="font-size: 0.875rem; color: #6b7280;">Assignments Due</p>
                        <p style="font-size: 2rem; font-weight: bold; color: #ea580c;">2</p>
                    </div>
                    <i data-lucide="file-text" style="width: 2rem; height: 2rem; color: #ea580c;"></i>
                </div>
            </div>
            <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="font-size: 0.875rem; color: #6b7280;">Hours Studied</p>
                        <p style="font-size: 2rem; font-weight: bold; color: #2563eb;">24</p>
                    </div>
                    <i data-lucide="clock" style="width: 2rem; height: 2rem; color: #2563eb;"></i>
                </div>
            </div>
            <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <p style="font-size: 0.875rem; color: #6b7280;">Certificates</p>
                        <p style="font-size: 2rem; font-weight: bold; color: #7c3aed;">2</p>
                    </div>
                    <i data-lucide="award" style="width: 2rem; height: 2rem; color: #7c3aed;"></i>
                </div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div>
                <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">My Courses</h2>
                <div id="dashboardCourses"></div>
            </div>
            <div>
                <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Recent Activity</h2>
                <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; text-align: center; padding: 2rem 0;">Recent activity will appear here</p>
                </div>
            </div>
        </div>
    `;
    
    dashboardTab.innerHTML = statsHTML;
    
    // Render courses in dashboard
    const dashboardCourses = document.getElementById('dashboardCourses');
    courses.forEach(course => {
        const courseElement = createElement('div', 'course-card');
        courseElement.innerHTML = `
            <div class="course-header"></div>
            <div class="course-title">${course.title}</div>
            <div class="course-instructor">by ${course.instructor}</div>
            <div class="course-description">${course.description}</div>
            <div class="course-tags">
                <span class="course-category">${course.category}</span>
                <span class="course-level">${course.level}</span>
            </div>
            <div class="course-progress">
                <div class="course-progress-header">
                    <span>Progress</span>
                    <span>${course.progress}%</span>
                </div>
                <div class="course-progress-bar">
                    <div class="course-progress-fill" style="width: ${course.progress}%"></div>
                </div>
            </div>
            <button class="course-btn" onclick="selectCourse(${course.id})">Continue Learning</button>
        `;
        dashboardCourses.appendChild(courseElement);
    });
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderCourses() {
    if (selectedCourse) {
        renderCourseDetail();
    } else {
        renderCoursesList();
    }
}

function renderCoursesList() {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = '';
    
    courses.forEach(course => {
        const courseElement = createElement('div', 'course-card');
        courseElement.innerHTML = `
            <div class="course-header"></div>
            <div class="course-title">${course.title}</div>
            <div class="course-instructor">by ${course.instructor}</div>
            <div class="course-description">${course.description}</div>
            <div class="course-tags">
                <span class="course-category">${course.category}</span>
                <span class="course-level">${course.level}</span>
            </div>
            <div class="course-progress">
                <div class="course-progress-header">
                    <span>Progress</span>
                    <span>${course.progress}%</span>
                </div>
                <div class="course-progress-bar">
                    <div class="course-progress-fill" style="width: ${course.progress}%"></div>
                </div>
            </div>
            <button class="course-btn" onclick="selectCourse(${course.id})">Continue Course</button>
        `;
        coursesGrid.appendChild(courseElement);
    });
    
    document.getElementById('coursesList').style.display = 'block';
    document.getElementById('courseDetail').style.display = 'none';
}

function renderCourseDetail() {
    const course = selectedCourse;
    const courseDetail = document.getElementById('courseDetail');
    
    courseDetail.innerHTML = `
        <button onclick="backToCourses()" style="margin-bottom: 1rem; color: #059669; background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
            ← Back to Courses
        </button>
        
        <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 2rem;">
            <div style="margin-bottom: 2rem;">
                <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem;">${course.title}</h1>
                <p style="color: #6b7280;">Instructor: ${course.instructor}</p>
                <p style="margin-top: 0.5rem;">${course.description}</p>
                
                <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem;">
                    <span style="background: #dcfce7; color: #065f46; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">${course.level}</span>
                    <span style="font-size: 0.875rem; color: #6b7280;">${course.lessons} Lessons</span>
                    <span style="font-size: 0.875rem; color: #6b7280;">${course.students} Students</span>
                </div>
                
                <div style="margin-top: 1rem;">
                    <div style="display: flex; align-items: center; justify-between; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; font-weight: 500;">Course Progress</span>
                        <span style="font-size: 0.875rem; color: #6b7280;">${course.progress}%</span>
                    </div>
                    <div style="width: 100%; background: #e5e7eb; border-radius: 9999px; height: 0.5rem;">
                        <div style="background: #059669; height: 0.5rem; border-radius: 9999px; width: ${course.progress}%;"></div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    <h2 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 1rem;">Course Content</h2>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${[
                            { title: 'Introduction to Tafseer Methodology', duration: '45 min', completed: true },
                            { title: 'Historical Context of Revelation', duration: '60 min', completed: true },
                            { title: 'Classical Commentaries Overview', duration: '50 min', completed: false },
                            { title: 'Modern Approaches to Tafseer', duration: '55 min', completed: false },
                            { title: 'Practical Application Exercises', duration: '40 min', completed: false }
                        ].map(lesson => `
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.375rem;">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    ${lesson.completed ? 
                                        '<div style="width: 1.5rem; height: 1.5rem; background: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem;">✓</div>' : 
                                        '<i data-lucide="play" style="width: 1.5rem; height: 1.5rem; color: #9ca3af;"></i>'
                                    }
                                    <div>
                                        <p style="font-weight: 500; font-size: 0.875rem;">${lesson.title}</p>
                                        <p style="font-size: 0.75rem; color: #6b7280;">${lesson.duration}</p>
                                    </div>
                                </div>
                                <button style="color: #059669; background: none; border: none; cursor: pointer;">
                                    <i data-lucide="chevron-right" style="height: 1rem; width: 1rem;"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <h2 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 1rem;">Resources & Materials</h2>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${[
                            { name: 'Course Syllabus', type: 'PDF', size: '245 KB' },
                            { name: 'Required Reading List', type: 'PDF', size: '180 KB' },
                            { name: 'Audio Lectures - Week 1', type: 'ZIP', size: '125 MB' },
                            { name: 'Assignment Templates', type: 'DOCX', size: '95 KB' }
                        ].map(resource => `
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 0.375rem;">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <i data-lucide="file-text" style="width: 1.25rem; height: 1.25rem; color: #6b7280;"></i>
                                    <div>
                                        <p style="font-weight: 500; font-size: 0.875rem;">${resource.name}</p>
                                        <p style="font-size: 0.75rem; color: #6b7280;">${resource.type} • ${resource.size}</p>
                                    </div>
                                </div>
                                <button style="color: #059669; background: none; border: none; cursor: pointer;">
                                    <i data-lucide="download" style="height: 1rem; width: 1rem;"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top: 2rem;">
                        <h3 style="font-weight: 600; margin-bottom: 0.75rem;">Assignment Submission</h3>
                        <div style="border: 2px dashed #d1d5db; border-radius: 0.5rem; padding: 2rem; text-align: center;">
                            <i data-lucide="upload" style="width: 2rem; height: 2rem; color: #9ca3af; margin: 0 auto 0.5rem;"></i>
                            <p style="font-size: 0.875rem; color: #6b7280;">Drop files here or click to upload</p>
                            <button style="margin-top: 0.5rem; background: #059669; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer;">
                                Choose Files
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('coursesList').style.display = 'none';
    document.getElementById('courseDetail').style.display = 'block';
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderAssignments() {
    const pendingAssignments = assignments.filter(a => a.status === 'pending');
    const submittedAssignments = assignments.filter(a => a.status === 'submitted');
    const gradedAssignments = assignments.filter(a => a.status === 'graded');
    
    document.getElementById('pendingCount').textContent = pendingAssignments.length;
    document.getElementById('submittedCount').textContent = submittedAssignments.length;
    document.getElementById('gradedCount').textContent = gradedAssignments.length;
    
    renderAssignmentList('pendingAssignments', pendingAssignments, 'pending');
    renderAssignmentList('submittedAssignments', submittedAssignments, 'submitted');
    renderAssignmentList('gradedAssignments', gradedAssignments, 'graded');
}

function renderAssignmentList(containerId, assignmentList, status) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    assignmentList.forEach(assignment => {
        const assignmentElement = createElement('div', `assignment-item ${status}`);
        
        let buttonHTML = '';
        let statusHTML = '';
        
        if (status === 'pending') {
            buttonHTML = '<button class="assignment-btn orange">Start Assignment</button>';
        } else if (status === 'submitted') {
            statusHTML = '<div class="assignment-status">Awaiting review...</div>';
        } else if (status === 'graded') {
            buttonHTML = '<button class="assignment-btn green">View Feedback</button>';
        }
        
        assignmentElement.innerHTML = `
            <div class="assignment-title">${assignment.title}</div>
            <div class="assignment-course">${assignment.course}</div>
            <div class="assignment-meta">
                <span class="assignment-due ${status === 'pending' ? 'orange' : status === 'submitted' ? 'blue' : 'green'}">
                    ${status === 'graded' ? `Grade: ${assignment.grade}%` : status === 'submitted' ? 'Submitted' : `Due: ${assignment.dueDate}`}
                </span>
                <span class="assignment-type">${assignment.type}</span>
            </div>
            ${statusHTML}
            ${buttonHTML}
        `;
        
        container.appendChild(assignmentElement);
    });
}

function renderQuranStudy() {
    const quranTab = document.getElementById('quran');
    quranTab.innerHTML = `
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 2rem;">Quran Study Center</h1>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 2rem;">
                <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #059669;">Memorization Progress</h2>
                
                <div style="background: #dcfce7; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h3 style="font-weight: 600;">Current Hifz Progress</h3>
                        <span style="color: #059669; font-weight: bold;">Juz 15</span>
                    </div>
                    <div style="width: 100%; background: #e5e7eb; border-radius: 9999px; height: 0.75rem;">
                        <div style="background: #059669; height: 0.75rem; border-radius: 9999px; width: 50%;"></div>
                    </div>
                    <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">15 out of 30 Juz completed</p>
                </div>
                
                <div>
                    <h4 style="font-weight: 500; margin-bottom: 0.75rem;">Tajweed Rules Progress</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${[
                            { rule: 'Nun Sakinah & Tanween', progress: 95 },
                            { rule: 'Meem Sakinah', progress: 88 },
                            { rule: 'Qalqalah', progress: 75 },
                            { rule: 'Madd (Elongation)', progress: 60 },
                            { rule: 'Waqf (Stopping)', progress: 45 }
                        ].map(rule => `
                            <div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem;">
                                    <span>${rule.rule}</span>
                                    <span>${rule.progress}%</span>
                                </div>
                                <div style="width: 100%; background: #e5e7eb; border-radius: 9999px; height: 0.5rem;">
                                    <div style="background: #2563eb; height: 0.5rem; border-radius: 9999px; width: ${rule.progress}%;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 2rem;">
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Daily Quran Study Plan</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                <div>
                    <h3 style="font-weight: 600; color: #059669; margin-bottom: 0.75rem;">Morning Session (Fajr)</h3>
                    <div style="background: #dcfce7; padding: 0.75rem; border-radius: 0.375rem;">
                        <p style="font-weight: 500;">New Memorization</p>
                        <p style="font-size: 0.875rem; color: #6b7280;">30 minutes - New verses</p>
                        <div style="margin-top: 0.5rem;">
                            <span style="background: #dcfce7; color: #065f46; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">In Progress</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 style="font-weight: 600; color: #2563eb; margin-bottom: 0.75rem;">Afternoon Session (Asr)</h3>
                    <div style="background: #dbeafe; padding: 0.75rem; border-radius: 0.375rem;">
                        <p style="font-weight: 500;">Review & Revision</p>
                        <p style="font-size: 0.875rem; color: #6b7280;">45 minutes - Previous lessons</p>
                        <div style="margin-top: 0.5rem;">
                            <span style="background: #dbeafe; color: #1e3a8a; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Scheduled</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 style="font-weight: 600; color: #7c3aed; margin-bottom: 0.75rem;">Evening Session (Maghrib)</h3>
                    <div style="background: #f3e8ff; padding: 0.75rem; border-radius: 0.375rem;">
                        <p style="font-weight: 500;">Tajweed Practice</p>
                        <p style="font-size: 0.875rem; color: #6b7280;">20 minutes - Pronunciation</p>
                        <div style="margin-top: 0.5rem;">
                            <span style="background: #f3e8ff; color: #6b21a8; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Completed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderLibrary() {
    const libraryTab = document.getElementById('library');
    libraryTab.innerHTML = `
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 2rem;">Islamic Library</h1>
        
        <div style="display: grid; grid-template-columns: 1fr 3fr; gap: 2rem;">
            <div>
                <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1rem;">
                    <h2 style="font-weight: 600; margin-bottom: 1rem;">Categories</h2>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${[
                            'Quran & Tafseer',
                            'Hadith Collections',
                            'Islamic Jurisprudence',
                            'Arabic Language',
                            'Islamic History',
                            'Prophetic Biography',
                            'Islamic Ethics',
                            'Contemporary Issues'
                        ].map(category => `
                            <button style="width: 100%; text-align: left; padding: 0.75rem; border-radius: 0.5rem; background: none; border: none; cursor: pointer; transition: background-color 0.2s; font-size: 0.875rem;" 
                                    onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='transparent'">
                                ${category}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div>
                <div style="margin-bottom: 2rem;">
                    <input type="text" placeholder="Search Islamic books, authors, or topics..." 
                           style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none;">
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    ${books.map(book => `
                        <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1rem;">
                            <div style="height: 8rem; background: linear-gradient(to bottom, #dcfce7, #bbf7d0); border-radius: 0.375rem; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="book" style="height: 2rem; width: 2rem; color: #059669;"></i>
                            </div>
                            
                            <h3 style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">${book.title}</h3>
                            <p style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">${book.author}</p>
                            
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                                <span style="font-size: 0.75rem; background: #dcfce7; color: #065f46; padding: 0.25rem 0.5rem; border-radius: 0.25rem;">${book.category}</span>
                                <span style="font-size: 0.75rem; color: #6b7280;">${book.pages} pages</span>
                            </div>
                            
                            <button style="width: 100%; padding: 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; transition: background-color 0.2s; cursor: ${book.available ? 'pointer' : 'not-allowed'}; ${
                                book.available 
                                    ? 'background: #059669; color: white; border: none;' 
                                    : 'background: #d1d5db; color: #6b7280; border: none;'
                            }" ${book.available ? 'onmouseover="this.style.background=\'#047857\'" onmouseout="this.style.background=\'#059669\'"' : ''}>
                                ${book.available ? `<i data-lucide="download" style="display: inline; width: 1rem; height: 1rem; margin-right: 0.25rem;"></i>Download ${book.type}` : 'Currently Unavailable'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderCalendar() {
    const calendarTab = document.getElementById('calendar');
    calendarTab.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
            <h1 style="font-size: 2rem; font-weight: bold;">Schedule</h1>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; background: #e5e7eb; border: none; cursor: pointer;">Day</button>
                <button style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; background: #e5e7eb; border: none; cursor: pointer;">Week</button>
                <button style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; background: #059669; color: white; border: none; cursor: pointer;">Month</button>
            </div>
        </div>

        <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 2rem;">
            <div style="padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                <h2 style="font-size: 1.125rem; font-weight: 600;">September 2025</h2>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(7, 1fr);">
                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `
                    <div style="padding: 0.75rem; background: #f9fafb; text-align: center; font-weight: 500; font-size: 0.875rem; border-bottom: 1px solid #e5e7eb;">
                        ${day}
                    </div>
                `).join('')}
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(7, 1fr);">
                ${Array.from({length: 30}, (_, i) => i + 1).map(day => `
                    <div style="min-height: 6rem; padding: 0.5rem; border-bottom: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; position: relative;">
                        <div style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; ${day === 2 ? 'color: #059669;' : 'color: #111827;'}">${day}</div>
                        ${day === 5 || day === 8 || day === 15 ? `
                            <div style="font-size: 0.75rem; padding: 0.25rem; border-radius: 0.25rem; margin-bottom: 0.25rem; ${
                                day === 5 || day === 8 ? 'background: #dbeafe; color: #1e3a8a;' : 'background: #fef3c7; color: #92400e;'
                            } overflow: hidden; text-overflow: ellipsis;">
                                ${day === 5 ? 'Tafseer Class' : day === 8 ? 'Arabic Grammar' : 'Midterm Exam'}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div>
                <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Upcoming Events</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${[
                        { title: 'Tafseer al-Quran', date: '2025-09-05', time: '09:00 AM', type: 'class', instructor: 'Ustadh Ahmad Hassan' },
                        { title: 'Arabic Grammar', date: '2025-09-05', time: '11:00 AM', type: 'class', instructor: 'Ustadha Fatima Ali' },
                        { title: 'Assignment Due: Hadith Analysis', date: '2025-09-08', time: '11:59 PM', type: 'assignment', course: 'Hadith Sciences' },
                        { title: 'Midterm Exam: Fiqh Studies', date: '2025-09-15', time: '02:00 PM', type: 'exam', instructor: 'Ustadh Muhammad Yusuf' }
                    ].map(event => `
                        <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
                            <h3 style="font-weight: 600;">${event.title}</h3>
                            <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">
                                ${event.instructor ? `Instructor: ${event.instructor}` : event.course ? `Course: ${event.course}` : ''}
                            </p>
                            <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                                <span style="font-size: 0.875rem; color: #6b7280;">${event.date}</span>
                                <span style="font-size: 0.875rem; color: #6b7280;">${event.time}</span>
                                <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; ${
                                    event.type === 'class' ? 'background: #dbeafe; color: #1e3a8a;' :
                                    event.type === 'assignment' ? 'background: #fed7aa; color: #9a3412;' :
                                    'background: #f3e8ff; color: #6b21a8;'
                                }">${event.type}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div>
                <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Today's Schedule</h2>
                <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 1rem;">
                    <div style="text-align: center; padding: 2rem 0; color: #6b7280;">
                        No events scheduled for today
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStudents() {
    const studentsTab = document.getElementById('students');
    studentsTab.innerHTML = `
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 2rem;">Class Directory</h1>
        
        <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; overflow: hidden;">
            <div style="padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                <input type="text" placeholder="Search students..." 
                       style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none;">
            </div>
            
            <div style="divide-y: 1px solid #e5e7eb;">
                ${students.map(student => `
                    <div style="padding: 1rem; display: flex; align-items: center; justify-content: space-between; transition: background-color 0.2s;" 
                         onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 2.5rem; height: 2.5rem; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="user" style="width: 1.25rem; height: 1.25rem; color: #059669;"></i>
                            </div>
                            <div>
                                <h3 style="font-weight: 600;">${student.name}</h3>
                                <p style="font-size: 0.875rem; color: #6b7280;">${student.course}</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="text-align: right;">
                                <p style="font-size: 0.875rem; font-weight: 500;">${student.progress}%</p>
                                <div style="width: 5rem; background: #e5e7eb; border-radius: 9999px; height: 0.25rem; margin-top: 0.25rem;">
                                    <div style="background: #059669; height: 0.25rem; border-radius: 9999px; width: ${student.progress}%;"></div>
                                </div>
                            </div>
                            <span style="padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; ${
                                student.status === 'active' ? 'background: #dcfce7; color: #065f46;' : 'background: #f3f4f6; color: #6b7280;'
                            }">${student.status}</span>
                            <button style="color: #059669; background: none; border: none; cursor: pointer;">
                                <i data-lucide="chevron-right" style="height: 1rem; width: 1rem;"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderNotifications() {
    const notificationsTab = document.getElementById('notifications');
    notificationsTab.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
            <h1 style="font-size: 2rem; font-weight: bold;">Notifications</h1>
            <button style="font-size: 0.875rem; color: #059669; background: none; border: none; cursor: pointer;">
                Mark all as read
            </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
            ${notifications.map(notification => `
                <div style="background: white; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid ${notification.read ? '#d1d5db' : '#059669'};">
                    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                        <div style="display: flex; align-items: flex-start; gap: 0.75rem; flex: 1;">
                            <div style="width: 0.5rem; height: 0.5rem; margin-top: 0.5rem; border-radius: 50%; background: ${notification.read ? '#d1d5db' : '#059669'};"></div>
                            <div style="flex: 1;">
                                <h3 style="font-weight: 600; ${!notification.read ? 'color: #111827;' : 'color: #6b7280;'}">${notification.title}</h3>
                                <p style="color: #6b7280; font-size: 0.875rem; margin-top: 0.25rem;">${notification.message}</p>
                                <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                                    <span style="font-size: 0.75rem; color: #6b7280;">${notification.time}</span>
                                    <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; ${
                                        notification.type === 'grade' ? 'background: #dcfce7; color: #065f46;' :
                                        notification.type === 'course' ? 'background: #dbeafe; color: #1e3a8a;' :
                                        'background: #fed7aa; color: #9a3412;'
                                    }">${notification.type}</span>
                                </div>
                            </div>
                        </div>
                        <i data-lucide="bell" style="width: 1.25rem; height: 1.25rem; ${!notification.read ? 'color: #059669;' : 'color: #9ca3af;'}"></i>
                    </div>
                </div>
            `).join('')}
        </div>

        <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 2rem; text-align: center;">
            <i data-lucide="bell" style="width: 3rem; height: 3rem; color: #9ca3af; margin: 0 auto 1rem;"></i>
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Stay Updated</h3>
            <p style="color: #6b7280; margin-bottom: 1rem;">
                Get notified about new assignments, grades, course materials, and important announcements.
            </p>
            <button style="background: #059669; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">
                Notification Settings
            </button>
        </div>
    `;
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderSettings() {
    const settingsTab = document.getElementById('settings');
    settingsTab.innerHTML = `
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 2rem;">Settings</h1>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- Account Settings -->
                <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 2rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="user" style="width: 1.25rem; height: 1.25rem;"></i>
                        Account Settings
                    </h2>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Full Name</label>
                                <input type="text" value="Ahmed Abdullah" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;" />
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Email Address</label>
                                <input type="email" value="ahmed.abdullah@email.com" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;" />
                            </div>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Phone Number</label>
                            <input type="tel" value="+1 (555) 123-4567" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;" />
                        </div>
                        <button style="background: #059669; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">
                            Update Profile
                        </button>
                    </div>
                </div>

                <!-- Appearance Settings -->
                <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 2rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="eye" style="width: 1.25rem; height: 1.25rem;"></i>
                        Appearance
                    </h2>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <h3 style="font-weight: 500;">Dark Mode</h3>
                                <p style="font-size: 0.875rem; color: #6b7280;">Switch between light and dark theme</p>
                            </div>
                            <button onclick="toggleDarkMode()" style="position: relative; display: inline-flex; height: 1.5rem; width: 2.75rem; align-items: center; border-radius: 9999px; transition: background-color 0.2s; background: #e5e7eb; border: none; cursor: pointer;">
                                <span style="display: inline-block; height: 1rem; width: 1rem; transform: translateX(0.25rem); border-radius: 50%; background: white; transition: transform 0.2s;"></span>
                            </button>
                        </div>
                        <div>
                            <h3 style="font-weight: 500; margin-bottom: 0.5rem;">Language</h3>
                            <select style="padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; outline: none;">
                                <option value="en" selected>English</option>
                                <option value="ar">العربية (Arabic)</option>
                                <option value="ur">اردو (Urdu)</option>
                                <option value="tr">Türkçe (Turkish)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- Notification Preferences -->
                <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 2rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="bell" style="width: 1.25rem; height: 1.25rem;"></i>
                        Notifications
                    </h2>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        ${[
                            'Email Notifications',
                            'Assignment Reminders',
                            'Course Updates',
                            'Prayer Time Alerts'
                        ].map(setting => `
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <h3 style="font-weight: 500; font-size: 0.875rem;">${setting}</h3>
                                <button style="position: relative; display: inline-flex; height: 1.5rem; width: 2.75rem; align-items: center; border-radius: 9999px; background: #059669; border: none; cursor: pointer;">
                                    <span style="display: inline-block; height: 1rem; width: 1rem; transform: translateX(1.5rem); border-radius: 50%; background: white; transition: transform 0.2s;"></span>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Support -->
                <div style="background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 2rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Support</h2>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${[
                            'Help Center',
                            'Contact Support',
                            'Report a Problem',
                            'Terms of Service',
                            'Privacy Policy'
                        ].map(item => `
                            <button style="width: 100%; text-align: left; padding: 0.5rem 0.75rem; border-radius: 0.375rem; background: none; border: none; cursor: pointer; transition: background-color 0.2s;" 
                                    onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='transparent'">
                                ${item}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Event Handlers
function selectCourse(courseId) {
    selectedCourse = courses.find(course => course.id === courseId);
    showTab('courses');
}

function backToCourses() {
    selectedCourse = null;
    renderCourses();
}

function updateUserRole(role) {
    userRole = role;
    const studentsNavItem = document.querySelector('[data-tab="students"]');
    if (studentsNavItem) {
        studentsNavItem.style.display = role === 'student' ? 'none' : 'flex';
    }
}

function toggleDarkMode() {
    // This would implement dark mode toggle
    console.log('Dark mode toggled');
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Set up navigation event listeners
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
    
    // Set up action button event listeners
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            showTab(action);
        });
    });
    
    // Set up user role selector
    const userRoleSelect = document.getElementById('userRoleSelect');
    if (userRoleSelect) {
        userRoleSelect.addEventListener('change', function() {
            updateUserRole(this.value);
        });
    }
    
    // Initialize with default role
    updateUserRole(userRole);
    
    // Load initial content for home tab
    loadTabContent('home');
}); // End of DOMContentLoaded event listener