import axios from 'axios';
import axiosInstance from './AxiosService';

const roleService = {
    fetchRoles: async () => {
        const response = await axiosInstance.get(`roles/`);
        return response.data;
    },

    fetchRolesByID: async (roleId) => {
        const response = await axiosInstance.get(`roles/${roleId}/`);
        return response.data;
    },

    createRoles: async (roleData) => {
        const response = await axiosInstance.post(`roles/`, roleData);
        return response.data;
    },

    assignPermissions: async (permissionData) => {
        const response = await axiosInstance.post(`roles/`, permissionData);
        return response.data;
    },

    updateRoles: async (roleId, roleData) => {
        const response = await axiosInstance.put(`roles/${roleId}/`, roleData);
        return response.data;
    },

    deleteRoles: async (roleId) => {
        const response = await axiosInstance.delete(`roles/${roleId}/`);
        return response.data;
    },

    getSystemPassword: async() => {
        const response = await axiosInstance.get(`systemsettings/`);
        return response.data;
    },

    createSystemPassword: async(passwordData) => {
        const response = await axiosInstance.post(`systemsettings/`, passwordData);
        return response.data;
    },

    updateSystemPassword: async(id,passwordData) => {
        const response = await axiosInstance.put(`systemsettings/${id}/`, passwordData);
        return response.data;
    }

};

export default roleService;
