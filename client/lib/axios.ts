import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to log requests
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request being made:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; 