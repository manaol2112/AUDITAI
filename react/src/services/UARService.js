import axios from 'axios';
import axiosInstance from './AxiosService';

const uarService = {

  fetchUAR: async () => {
    const response = await axiosInstance.get('useraccessreview/');
    return response.data;
  },

  fetchUARById: async (uarID) => {
    const response = await axiosInstance.get(`useraccessreview/${uarID}/`);
    return response.data;
},

    fetchUARByApp: async (APP_NAME) => {
        const response = await axiosInstance.get(`useraccess-review/${APP_NAME}/`);
        return response.data;
    },

  createUAR: async (uarData) => {
    const response = await axiosInstance.post(`useraccessreview/`, uarData);
    return response.data;
  },

  updateUAR: async (uarID, uarData) => {
    const response = await axiosInstance.put(`useraccessreview/${uarID}/`, uarData);
    return response.data;
  },

  deleteUAR: async (uarID) => {
    const response = await axiosInstance.delete(`useraccessreview/${uarID}/`);
    return response.data;
  }
};

export default uarService;
