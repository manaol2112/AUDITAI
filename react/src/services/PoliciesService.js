import axios from 'axios';
import axiosInstance from './AxiosService';

const policyService = {
    fetchPWPolicyByApp: async (APP_NAME) => {
    const response = await axiosInstance.get(`policies/password/${APP_NAME}/`);
    return response.data;
},
};

export default policyService;
