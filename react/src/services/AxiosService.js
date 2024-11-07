import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8000/api/'; // Adjust URL as per your Django development server URL
const token = Cookies.get('token');
const refresh_token = Cookies.get('refresh_token')

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  },
});

// Function to refresh token
const refreshToken = async () => {
    // try {
    //     console.log('This is the refresh token', refresh_token)
    //   // Example: Replace with your actual endpoint to refresh token
    //   const refreshResponse = await axiosInstance.post('refresh_token/', {
    //     refresh: refresh_token,
    //   });
  
    //   const newToken = refreshResponse.data.access;
    //   // Update the original axiosInstance headers with the new token
    //   axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`;
    //   // Also update your stored token (if needed) in Cookies or local storage
    //   Cookies.set('token', newToken);
  
    //   return Promise.resolve(newToken);
    // } catch (error) {
    //   return Promise.reject(error);
    //   window.location.href = '/login'; 
    // }
  };
  
  // Axios interceptor for token refresh
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
  
      // Check if the error is due to token expiration
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const token = await refreshToken();
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (error) {

          // Handle refresh token failure (e.g., redirect to login)
          console.error('Failed to refresh token: ', error);
          // Example: You might want to redirect to login page or do something else
          throw error;
        }
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;
