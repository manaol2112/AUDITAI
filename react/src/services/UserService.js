import axios from 'axios';
import axiosInstance from './AxiosService';

const userService = {
  fetchUsers: async () => {
    const response = await axiosInstance.get(`users/`);
    return response.data;
  },

  fetchCurrentUser: async () => {
    const response = await axiosInstance.get(`current_user/`);
    return response.data;
  },

  fetchUsersById: async (userId) => {
    const response = await axiosInstance.get(`users/${userId}/`);
    return response.data;
},

  createUser: async (userDataWithRoles) => {
    const response = await axiosInstance.post(`users/`, userDataWithRoles);
    return response.data;
  }, 

  updateUser: async (username, userData) => {
    const response = await axiosInstance.put(`users/${username}/`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`users/${userId}/`);
    return response.data;
  }

};

export default userService;
