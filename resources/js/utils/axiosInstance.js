import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',              // API base URL
  withCredentials: true,        // Important for sending/receiving cookies
  headers: { 
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Add request interceptor for CSRF token
axiosInstance.interceptors.request.use(config => {
  // Get CSRF token from meta tag
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
  if (csrf) config.headers['X-CSRF-TOKEN'] = csrf;
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      // You can redirect to login page or dispatch an auth reset action here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
