export const API_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Fetch user profile data (student/faculty)
export const fetchUserProfile = async (userType, id, token) => {
  try {
    const response = await fetch(`${API_URL}/api/${userType}/${id}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, message: 'Network error' };
  }
};

// Helper function to make authenticated requests
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };
  
  try {
    const response = await fetch(`${API_URL}${url}`, mergedOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in authFetch for ${url}:`, error);
    throw error;
  }
};

// Login function to authenticate users and store token
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
