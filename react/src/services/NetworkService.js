import axios from 'axios';
import axiosInstance from './AxiosService';

const NetworkService = {
//   Job Schedule Services 

  fetchNetworkAuth: async () => {
    const response = await axiosInstance.get(`network-auth/`);
    return response.data;
  },

  createNetworkAuth: async (networkAuthData) => {
    const response = await axiosInstance.post(`network-auth/`, networkAuthData);
    return response.data;
  }, 

  updateNetworkAuth: async (networkID, networkAuthData) => {
    const response = await axiosInstance.put(`network-auth/${networkID}/`, networkAuthData);
    return response.data;
  },

};

export default NetworkService;
