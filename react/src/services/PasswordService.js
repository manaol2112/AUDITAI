import axios from 'axios';
import axiosInstance from './AxiosService';

const appPasswordService = {
  fetchAppPassword: async () => {
    const response = await axiosInstance.get('applications/password/');
    return response.data;
  },

  fetchAppPasswordByApp: async (APP_NAME) => {
    const response = await axiosInstance.get(`app-password/appid/${APP_NAME}/`);
    return response.data;
},

  createAppPassword: async (passwordData) => {
    const response = await axiosInstance.post(`app-password/`, passwordData);
    return response.data;
  },

  updateAppPassword: async (appId, passwordData) => {
    const response = await axiosInstance.put(`app-password/appid/${appId}/`, passwordData);
    return response.data;
  },

  deleteAppPassword: async (appId) => {
    const response = await axiosInstance.delete(`applications/password/${appId}/`);
    return response.data;
  }
};

export default appPasswordService;
