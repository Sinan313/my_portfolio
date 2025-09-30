import React, { useState, useEffect } from 'react';
import { Book, Users, Calendar, Award, MessageCircle, FileText, User, Home, Settings, BookOpen, Clock, Star, ChevronRight, Play, Download, Upload } from 'lucide-react';

const DarsLMS = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userRole, setUserRole] = useState('student'); // student, teacher, admin

  // Sample data
  const [courses] = useState([
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
  ]);

  const [assignments] = useState([
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
    }
  ]);

  const [announcements] = useState([
    {
      id: 1,
      title: 'Ramadan Schedule Changes',
      content: 'Classes will be shortened during Ramadan. New timings will be announced soon.',
      date: '2025-09-01',
      author: 'Administration'
    },
    {
      id: 2,
      title: 'Library Resources Available',
      content: 'New Islamic books and digital resources have been added to the library.',
      date: '2025-08-30',
      author: 'Librarian'
    }
  ]);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Assalamu Alaikum, Ahmed</h1>
        <p className="opacity-90">Continue your Islamic studies journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-green-600">4</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assignments Due</p>
              <p className="text-2xl font-bold text-orange-600">2</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hours Studied</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Certificates</p>
              <p className="text-2xl font-bold text-purple-600">2</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">My Courses</h2>
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-gray-600 text-sm">by {course.instructor}</p>
                    <p className="text-gray-700 mt-2">{course.description}</p>
                    <div className="flex items-center mt-3 space-x-4">
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{course.category}</span>
                      <span className="text-sm text-gray-500">{course.lessons} lessons</span>
                      <span className="text-sm text-gray-500">{course.students} students</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Progress</div>
                      <div className="text-lg font-bold text-green-600">{course.progress}%</div>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{width: `${course.progress}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCourse(course);
                    setActiveTab('courses');
                  }}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
                >
                  Continue Learning <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Recent Announcements</h2>
          <div className="space-y-4">
            {announcements.map(announcement => (
              <div key={announcement.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold">{announcement.title}</h3>
                <p className="text-gray-700 text-sm mt-2">{announcement.content}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>{announcement.author}</span>
                  <span>{announcement.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Upcoming Assignments</h2>
            <div className="space-y-3">
              {assignments.filter(a => a.status === 'pending').map(assignment => (
                <div key={assignment.id} className="bg-white p-3 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-sm">{assignment.title}</h3>
                  <p className="text-xs text-gray-600">{assignment.course}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Due: {assignment.dueDate}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{assignment.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      {selectedCourse ? (
        <div>
          <button 
            onClick={() => setSelectedCourse(null)}
            className="mb-4 text-green-600 hover:text-green-800 flex items-center"
          >
            ← Back to Courses
          </button>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
              <p className="text-gray-600">Instructor: {selectedCourse.instructor}</p>
              <p className="mt-2">{selectedCourse.description}</p>
              
              <div className="flex items-center space-x-4 mt-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{selectedCourse.level}</span>
                <span className="text-sm text-gray-500">{selectedCourse.lessons} Lessons</span>
                <span className="text-sm text-gray-500">{selectedCourse.students} Students</span>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-gray-500">{selectedCourse.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{width: `${selectedCourse.progress}%`}}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-bold mb-4">Course Content</h2>
                <div className="space-y-3">
                  {[
                    { title: 'Introduction to Tafseer Methodology', duration: '45 min', completed: true },
                    { title: 'Historical Context of Revelation', duration: '60 min', completed: true },
                    { title: 'Classical Commentaries Overview', duration: '50 min', completed: false },
                    { title: 'Modern Approaches to Tafseer', duration: '55 min', completed: false },
                    { title: 'Practical Application Exercises', duration: '40 min', completed: false }
                  ].map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        {lesson.completed ? (
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <Play className="w-6 h-6 text-gray-400" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
                        </div>
                      </div>
                      <button className="text-green-600 hover:text-green-800">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">Resources & Materials</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Course Syllabus', type: 'PDF', size: '245 KB' },
                    { name: 'Required Reading List', type: 'PDF', size: '180 KB' },
                    { name: 'Audio Lectures - Week 1', type: 'ZIP', size: '125 MB' },
                    { name: 'Assignment Templates', type: 'DOCX', size: '95 KB' }
                  ].map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">{resource.name}</p>
                          <p className="text-xs text-gray-500">{resource.type} • {resource.size}</p>
                        </div>
                      </div>
                      <button className="text-green-600 hover:text-green-800">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Assignment Submission</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Drop files here or click to upload</p>
                    <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                      Choose Files
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-6">My Courses</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{course.instructor}</p>
                  <p className="text-gray-700 text-sm mb-3">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{course.category}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{course.level}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{width: `${course.progress}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Continue Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assignments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-orange-600">Pending ({assignments.filter(a => a.status === 'pending').length})</h2>
          <div className="space-y-4">
            {assignments.filter(a => a.status === 'pending').map(assignment => (
              <div key={assignment.id} className="bg-white p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold">{assignment.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{assignment.course}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Due: {assignment.dueDate}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{assignment.type}</span>
                </div>
                <button className="w-full mt-3 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors">
                  Start Assignment
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Submitted ({assignments.filter(a => a.status === 'submitted').length})</h2>
          <div className="space-y-4">
            {assignments.filter(a => a.status === 'submitted').map(assignment => (
              <div key={assignment.id} className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold">{assignment.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{assignment.course}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Submitted
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{assignment.type}</span>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Awaiting review...
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-green-600">Graded ({assignments.filter(a => a.status === 'graded').length})</h2>
          <div className="space-y-4">
            {assignments.filter(a => a.status === 'graded').map(assignment => (
              <div key={assignment.id} className="bg-white p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold">{assignment.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{assignment.course}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Grade: {assignment.grade}%
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{assignment.type}</span>
                </div>
                <button className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
                  View Feedback
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuranStudy = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quran Study Center</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Memorization Progress</h2>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Current Hifz Progress</h3>
                <span className="text-green-600 font-bold">Juz 15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{width: '50%'}}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">15 out of 30 Juz completed</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Recent Memorization</h4>
              {[
                { surah: 'Surah Al-Isra', ayahs: '1-10', status: 'mastered', date: '2025-09-01' },
                { surah: 'Surah Al-Kahf', ayahs: '1-20', status: 'reviewing', date: '2025-08-28' },
                { surah: 'Surah Maryam', ayahs: '1-15', status: 'learning', date: '2025-08-25' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{item.surah}</p>
                    <p className="text-xs text-gray-600">Ayahs {item.ayahs}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'mastered' ? 'bg-green-100 text-green-800' :
                      item.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Tajweed Practice</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Current Focus: Qalqalah</h3>
              <p className="text-sm text-gray-700">Practice the five letters of qalqalah: ق ط ب ج د</p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                <Play className="inline h-4 w-4 mr-1" />
                Audio Practice
              </button>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Tajweed Rules Progress</h4>
              <div className="space-y-2">
                {[
                  { rule: 'Nun Sakinah & Tanween', progress: 95 },
                  { rule: 'Meem Sakinah', progress: 88 },
                  { rule: 'Qalqalah', progress: 75 },
                  { rule: 'Madd (Elongation)', progress: 60 },
                  { rule: 'Waqf (Stopping)', progress: 45 }
                ].map((rule, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{rule.rule}</span>
                      <span>{rule.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${rule.progress}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Quran Study Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-green-600">Morning Session (Fajr)</h3>
            <div className="bg-green-50 p-3 rounded">
              <p className="font-medium">New Memorization</p>
              <p className="text-sm text-gray-600">30 minutes - New verses</p>
              <div className="mt-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">In Progress</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-600">Afternoon Session (Asr)</h3>
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-medium">Review & Revision</p>
              <p className="text-sm text-gray-600">45 minutes - Previous lessons</p>
              <div className="mt-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Scheduled</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-purple-600">Evening Session (Maghrib)</h3>
            <div className="bg-purple-50 p-3 rounded">
              <p className="font-medium">Tajweed Practice</p>
              <p className="text-sm text-gray-600">20 minutes - Pronunciation</p>
              <div className="mt-2">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Islamic Library</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              {[
                'Quran & Tafseer',
                'Hadith Collections',
                'Islamic Jurisprudence',
                'Arabic Language',
                'Islamic History',
                'Prophetic Biography',
                'Islamic Ethics',
                'Contemporary Issues'
              ].map((category, index) => (
                <button key={index} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm">
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Search Islamic books, authors, or topics..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
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
            ].map((book, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-32 bg-gradient-to-b from-green-100 to-green-200 rounded mb-3 flex items-center justify-center">
                  <Book className="h-8 w-8 text-green-600" />
                </div>
                
                <h3 className="font-semibold text-sm mb-1">{book.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{book.category}</span>
                  <span className="text-xs text-gray-500">{book.pages} pages</span>
                </div>
                
                <button 
                  className={`w-full py-2 rounded text-sm transition-colors ${
                    book.available 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!book.available}
                >
                  {book.available ? (
                    <>
                      <Download className="inline h-4 w-4 mr-1" />
                      Download {book.type}
                    </>
                  ) : (
                    'Currently Unavailable'
                  )}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recently Added</h2>
            <div className="bg-white rounded-lg border border-gray-200 divide-y">
              {[
                { title: 'Contemporary Islamic Banking', author: 'Dr. Abdullah Saeed', date: '2025-08-30' },
                { title: 'Islamic Ethics in Modern Context', author: 'Prof. Aisha Ahmed', date: '2025-08-28' },
                { title: 'Quranic Arabic Grammar', author: 'Ustadh Omar Hassan', date: '2025-08-25' }
              ].map((book, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{book.date}</p>
                    <button className="text-green-600 hover:text-green-800 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Class Directory</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <input 
            type="text" 
            placeholder="Search students..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="divide-y divide-gray-200">
          {[
            { name: 'Ahmed Abdullah', course: 'Tafseer al-Quran', progress: 85, status: 'active' },
            { name: 'Fatima Hassan', course: 'Arabic Grammar', progress: 92, status: 'active' },
            { name: 'Omar Malik', course: 'Hadith Sciences', progress: 76, status: 'active' },
            { name: 'Aisha Rahman', course: 'Islamic Jurisprudence', progress: 88, status: 'active' },
            { name: 'Yusuf Ahmad', course: 'Tafseer al-Quran', progress: 65, status: 'inactive' }
          ].map((student, index) => (
            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.course}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{student.progress}%</p>
                  <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-green-600 h-1 rounded-full" 
                      style={{width: `${student.progress}%`}}
                    ></div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {student.status}
                </span>
                <button className="text-green-600 hover:text-green-800">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'quran', label: 'Quran Study', icon: Book },
    { id: 'library', label: 'Islamic Library', icon: FileText },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'calendar', label: 'Schedule', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Book className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Dars LMS</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={userRole} 
                onChange={(e) => setUserRole(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="student">Student View</option>
                <option value="teacher">Teacher View</option>
                <option value="admin">Admin View</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ahmed Abdullah</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {navigation.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'assignments' && renderAssignments()}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'quran' && renderQuranStudy()}
          {activeTab === 'library' && renderLibrary()}
          {activeTab === 'calendar' && (
            <div className="text-center py-20">
              <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">Schedule feature coming soon...</p>
            </div>
          )}
          {activeTab === 'messages' && (
            <div className="text-center py-20">
              <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">Messages feature coming soon...</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-20">
              <Settings className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">Settings feature coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DarsLMS;