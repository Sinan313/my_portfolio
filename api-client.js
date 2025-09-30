// API Client for C-Tech Solutions
class APIClient {
  constructor() {
    this.baseURL = '/api';
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to make requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle token expiry
      if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
        this.logout();
        window.location.reload();
      }
      
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: credentials
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async updatePassword(passwordData) {
    return await this.request('/auth/update-password', {
      method: 'PUT',
      body: passwordData
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // User methods
  async getUserProfile() {
    return await this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: profileData
    });
  }

  async getUserDashboard() {
    return await this.request('/users/dashboard');
  }

  async enrollInCourse(courseId) {
    return await this.request(`/users/enroll/${courseId}`, {
      method: 'POST'
    });
  }

  async updateCourseProgress(courseId, progressData) {
    return await this.request(`/users/progress/${courseId}`, {
      method: 'PUT',
      body: progressData
    });
  }

  async getUserCourses() {
    return await this.request('/users/courses');
  }

  async getUserAnalytics() {
    return await this.request('/users/analytics');
  }

  // Course methods
  async getCourses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/courses${queryString ? `?${queryString}` : ''}`);
  }

  async getPopularCourses(limit = 6) {
    return await this.request(`/courses/popular?limit=${limit}`);
  }

  async getCourse(identifier) {
    return await this.request(`/courses/${identifier}`);
  }

  async searchCourses(query, filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`/courses/search/${encodeURIComponent(query)}${params ? `?${params}` : ''}`);
  }

  async getCourseLessons(courseId) {
    return await this.request(`/courses/${courseId}/lessons`);
  }

  // Resource methods
  async getResources(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/resources${queryString ? `?${queryString}` : ''}`);
  }

  async getResourcesByCategory(category, limit = 20) {
    return await this.request(`/resources/category/${category}?limit=${limit}`);
  }

  async getPopularResources(limit = 10) {
    return await this.request(`/resources/popular?limit=${limit}`);
  }

  async getResource(identifier) {
    return await this.request(`/resources/${identifier}`);
  }

  async searchResources(query, filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`/resources/search/${encodeURIComponent(query)}${params ? `?${params}` : ''}`);
  }

  async downloadResource(resourceId, fileIndex = 0) {
    return await this.request(`/resources/${resourceId}/download/${fileIndex}`);
  }

  async likeResource(resourceId) {
    return await this.request(`/resources/${resourceId}/like`, {
      method: 'POST'
    });
  }

  // Utility methods
  isLoggedIn() {
    return !!this.token;
  }

  async checkHealth() {
    return await this.request('/health');
  }

  // Error handling
  handleError(error, showMessage = true) {
    console.error('API Error:', error);
    
    if (showMessage && typeof showMessage === 'function') {
      showMessage('error', error.message || 'An error occurred');
    } else if (showMessage && window.showMessage) {
      window.showMessage('error', error.message || 'An error occurred');
    }
    
    return null;
  }
}

// Global API client instance
window.apiClient = new APIClient();

// Authentication helper functions
window.authenticateUser = async (credentials) => {
  try {
    const response = await window.apiClient.login(credentials);
    
    if (response.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      window.currentUser = response.user;
      window.isLoggedIn = true;
      return response.user;
    }
  } catch (error) {
    window.apiClient.handleError(error);
    return null;
  }
};

window.logoutUser = () => {
  window.apiClient.logout();
  window.currentUser = null;
  window.isLoggedIn = false;
  localStorage.removeItem('currentUser');
  
  // Redirect to home page
  if (typeof showPageWithHistory === 'function') {
    showPageWithHistory('home');
  }
};

// Initialize authentication state on page load
window.addEventListener('load', async () => {
  const token = localStorage.getItem('authToken');
  const savedUser = localStorage.getItem('currentUser');
  
  if (token && savedUser) {
    try {
      // Verify token is still valid
      const response = await window.apiClient.getCurrentUser();
      
      if (response.user) {
        window.currentUser = response.user;
        window.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        // Update UI if functions exist
        if (typeof updateNavigationState === 'function') {
          updateNavigationState();
        }
      }
    } catch (error) {
      // Token invalid, clear authentication
      window.logoutUser();
    }
  }
});

// Data fetching helpers for existing functions
window.fetchDashboardData = async () => {
  try {
    const response = await window.apiClient.getUserDashboard();
    return response.data;
  } catch (error) {
    window.apiClient.handleError(error);
    return null;
  }
};

window.fetchUserProfile = async () => {
  try {
    const response = await window.apiClient.getUserProfile();
    return response.user;
  } catch (error) {
    window.apiClient.handleError(error);
    return null;
  }
};

window.fetchResources = async (category = 'all') => {
  try {
    const params = category !== 'all' ? { category } : {};
    const response = await window.apiClient.getResources(params);
    return response.data.resources;
  } catch (error) {
    window.apiClient.handleError(error);
    return [];
  }
};

window.searchResourcesAPI = async (query) => {
  try {
    const response = await window.apiClient.searchResources(query);
    return response.data.resources;
  } catch (error) {
    window.apiClient.handleError(error);
    return [];
  }
};
