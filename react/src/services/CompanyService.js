import axios from 'axios';
import axiosInstance from './AxiosService';

const companyService = {
  fetchCompanies: async () => {
    const response = await axiosInstance.get('companies/');
    return response.data;
  },

  fetchCompanyById: async (companyId) => {
    const response = await axiosInstance.get(`companies/${companyId}/`);
    return response.data;
},

  createCompany: async (companyData) => {
    const response = await axiosInstance.post(`companies/`, companyData);
    return response.data;
  },

  updateCompany: async (companyId, companyData) => {
    const response = await axiosInstance.put(`companies/${companyId}/`, companyData);
    return response.data;
  },

  deleteCompany: async (companyId) => {
    const response = await axiosInstance.delete(`companies/${companyId}/`);
    return response.data;
  }
};

export default companyService;
