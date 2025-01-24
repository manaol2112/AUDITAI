import axios from 'axios';
import Cookies from 'js-cookie';


// const API_URL =  'https://audit-ai.net/api'  

const API_URL =   'http://localhost:8000/api' 

const AuthService = {

  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login/`, { username, password });
      
      if (response.data.access && response.data.refresh) {
        const { access, refresh } = response.data;
        
        localStorage.setItem('token', access); // Store access token in localStorage
        Cookies.set('token', access, { expires: 1, secure: true, sameSite: 'strict' }); // Store access token in cookies (expires in 1 day)

        localStorage.setItem('refresh_token', refresh); // Store refresh token in localStorage
        Cookies.set('refresh_token', refresh, { expires: 7, secure: true, sameSite: 'strict' }); // Store refresh token in cookies (expires in 7 days)
      }
      
      return response.data;
    } catch (error) {
      throw new Error('Login failed'); // Handle login failure
    }
  },

  logout: () => {
    localStorage.removeItem('token'); // Remove access token from localStorage
    Cookies.remove('token'); // Remove access token from cookies
    localStorage.removeItem('refresh_token'); // Remove refresh token from localStorage
    Cookies.remove('refresh_token'); // Remove refresh token from cookies
    Cookies.remove('csrftoken'); // Remove refresh token from cookies
    window.location.href = '/login';
  },

  getToken: () => {
    return localStorage.getItem('token') || Cookies.get('token'); // Retrieve access token from localStorage or cookies
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token') || Cookies.get('refresh_token'); // Retrieve refresh token from localStorage or cookies
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    // Check if access token exists and is not expired (you can add additional checks based on your JWT structure)
    return !!token; // Return true if access token exists, false otherwise
  },

  refreshToken: async () => {
    const refresh_token = AuthService.getRefreshToken();
    try {
      const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refresh_token });
      const newAccessToken = response.data.access;
      
      // Update access token in localStorage and cookies
      localStorage.setItem('token', newAccessToken);
      Cookies.set('token', newAccessToken, { expires: 1 });
      
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }
};

export default AuthService;
