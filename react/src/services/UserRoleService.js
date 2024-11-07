import axios from 'axios';
import axiosInstance from './AxiosService';

const userrolesService = {
  getAll: async () => {
    const response = await axiosInstance.get(`userroles/`);
    return response.data;
  },

  getOne: async (username) => {
    const response = await axiosInstance.get(`userroles/${username}/`);
    return response.data;
  },

  getUserCompanies: async (user_id) => {
    const response = await axiosInstance.get(`userroles/${user_id}/`);
    return response.data;
  },

  getUserbyCompanies: async (company_id) => {
    const response = await axiosInstance.get(`userroles/company/${company_id}/`);
    return response.data; 
  },

  create: async (userroleData) => {
    const response = await axiosInstance.post(`userroles/`, userroleData);
    return response.data;
  },

  update: async (user_id, userroleData) => {
    const response = await axiosInstance.put(`userroles/${user_id}/`, userroleData);
    return response.data;
  },

  delete: async (username) => {
    const response = await axiosInstance.delete(`userroles/${username}/`);
    return response.data;
  }
};

export default userrolesService;
