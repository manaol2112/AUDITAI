import axios from 'axios';
import axiosInstance from './AxiosService';

const SFTPService = {
  fetchSFTP: async () => {
    const response = await axiosInstance.get(`hr-sftp/`);
    return response.data;
  },

  fetchSFTPById: async (sftpId) => {
    const response = await axiosInstance.get(`hr-sftp/${sftpId}/`);
    return response.data;
},

  fetchAppSFTPById: async (appID) => {
    const response = await axiosInstance.get(`app-sftp/${appID}/`);
    return response.data;
  },

  createSFTP: async (sftpData) => {
    const response = await axiosInstance.post(`hr-sftp/`, sftpData);
    return response.data;
  }, 

  createAppSFTP: async (sftpData) => {
    const response = await axiosInstance.post(`app-sftp/`, sftpData);
    return response.data;
  }, 

  updateAppSFTP: async (sftpId, sftpData) => {
    const response = await axiosInstance.put(`app-sftp/${sftpId}/`, sftpData);
    return response.data;
  },

  updateSFTP: async (sftpId, sftpData) => {
    const response = await axiosInstance.put(`hr-sftp/${sftpId}/`, sftpData);
    return response.data;
  },

  deleteSFTP: async (sftpId) => {
    const response = await axiosInstance.delete(`hr-sftp/${sftpId}/`);
    return response.data;
  },

  testHRsftp: async (sftpdata) => {
    const response = await axiosInstance.post(`sftp/hrtest/`, sftpdata,);
    return response.data;

  },

  hrdataMapping: async (formData) => {
    const response = await axiosInstance.post(`hr-data-mapping/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true, 
    });
    return response.data;
  },

  fetchHRDataImportLog: async () => {
    const response = await axiosInstance.get(`hr-data-mapping/`,);
    return response.data;
  },

  userdataMapping: async (formData) => {
    const response = await axiosInstance.post(`user-data-mapping/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true, 
    });
    return response.data;
  },

  fetchAppDataImportLog: async (APP_NAME) => {
    try {
      const response = await axiosInstance.get(`app-users/joblog/${APP_NAME}/`);
      return response.data;
    } catch (error) {
      console.log(`Error deleting application with ID ${APP_NAME}: ${error.message}`);
    }
  },


};

export default SFTPService;
