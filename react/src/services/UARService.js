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

  fetchUARByUARFile: async (UAR_FILE) => {
    const response = await axiosInstance.get(`useraccessreviewsod/${UAR_FILE}/`);
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
  },

  //UARSODCHECK

  getUARSODProcessByAppCycle: async (APP_NAME, REVIEW_CYCLE) => {
    const response = await axiosInstance.get(`useraccessreviewsod/${APP_NAME}/${REVIEW_CYCLE}/`);
    return response.data;
  },

  createUARSODRecord: async (uarSODData) => {
    const response = await axiosInstance.post(`uarsod/`, uarSODData);
    return response.data;
  },

  updateUARSODRecord: async (recordID, uarSODData) => {
    const response = await axiosInstance.put(`uarsod/${recordID}/`, uarSODData);
    return response.data;
  },

  //Send UAR for Review
  sendUARForReview: async (uarSODData) => {
    const response = await axiosInstance.post(`send-uar-for-review/`, uarSODData);
    return response.data;
  },

  fetchUARByToken: async (token) => {
    const response = await axiosInstance.get(`uartoken/${token}/`);
    return response.data;
  },

  //CONFIGURE SCOPING 

  fetchInscopeRolesByUARFile: async (UAR_FILE) => {
    const response = await axiosInstance.get(`uarroleinscope/${UAR_FILE}/`);
    return response.data;
  },

  createInscopeRoles: async (uarRolesData) => {
    const response = await axiosInstance.post(`uarrolescoping/`, uarRolesData);
    return response.data;
  },

  updateInscopeRoles: async (APP_NAME, uarRolesData) => {
    const response = await axiosInstance.put(`uarrolescoping/${APP_NAME}/`, uarRolesData);
    return response.data;
  },

  deleteInscopeRoles: async (ROLE_ID) => {
    const response = await axiosInstance.delete(`uarrolescopingdelete/${ROLE_ID}/`);
    return response.data;
  }

};

export default uarService;
