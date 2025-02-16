import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookie instead of localStorage
    const token = typeof window !== 'undefined' ? 
      document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default axiosInstance; 