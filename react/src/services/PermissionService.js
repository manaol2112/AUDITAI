import axios from 'axios';
import axiosInstance from './AxiosService';

const permissionService = {
    fetchPermission: async () => {
        const response = await axiosInstance.get(`permission/`);
        return response.data;
    },

    fetchPermissionByID: async (permId) => {
        const response = await axiosInstance.get(`permission/${permId}/`);
        return response.data;
    },

    createPermission: async (permData) => {
        const response = await axiosInstance.post(`permission/`, permData);
        return response.data;
    },

    updatePermission: async (permId, permData) => {
        const response = await axiosInstance.put(`permission/${permId}/`, permData);
        return response.data;
    },

    deletePermission: async (permId) => {
        const response = await axiosInstance.delete(`permission/${permId}/`);
        return response.data;
    }


};

export default permissionService;
