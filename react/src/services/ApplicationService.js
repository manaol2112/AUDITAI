import axiosInstance from './AxiosService';
import ErrorBoundary from '../components/common/ErrorBoundery';

const appService = {
    fetchApps: async () => {
        try {
            const response = await axiosInstance.get('applications/');
            return response.data;
        } catch (error) {
            console.log(`Error fetching applications: ${error.message}`);
        }
    },

    fetchAppsById: async (appId) => {
        try {
            const response = await axiosInstance.get(`applications/${appId}/`);
            return response.data;
        } catch (error) {
            console.log(`Error fetching application with ID ${appId}: ${error.message}`);
        }
    },

    fetchAppsByOwner: async (ownerId) => {
        try {
            const response = await axiosInstance.get(`applications/myapp/${ownerId}/`);
            return response.data;
        } catch (error) {
            console.log(`Error fetching applications for owner ${ownerId}: ${error.message}`);
        }
    },

    fetchAppsByCompany: async (COMPANY_ID) => {
        try {
            const response = await axiosInstance.get(`applications/myapp/company/${COMPANY_ID}/`);
            return response.data;
        } catch (error) {
            console.log(`Error fetching applications for owner ${COMPANY_ID}: ${error.message}`);
        }
    },

    fetchAppsByType: async (appType) => {
        try {
            const response = await axiosInstance.get(`applications/myapp/apptype/${appType}/`);
            return response.data;
        } catch (error) {
            console.log(`Error fetching applications of type ${appType}: ${error.message}`);
        }
    },

    createApp: async (appData) => {
        try {
            const response = await axiosInstance.post(`applications/`, appData);
            return response.data;
        } catch (error) {
            console.log(`Error creating application: ${error.message}`);
        }
    },

    updateApp: async (appId, appData) => {
        try {
            const response = await axiosInstance.put(`applications/${appId}/`, appData);
            return response.data;
        } catch (error) {
            console.log(`Error updating application with ID ${appId}: ${error.message}`);
        }
    },

    deleteApp: async (appId) => {
        try {
            const response = await axiosInstance.delete(`applications/${appId}/`);
            return response.data;
        } catch (error) {
            console.log(`Error deleting application with ID ${appId}: ${error.message}`);
        }
    },

    fetchAppsRecordById: async (APP_NAME) => {
        const response = await axiosInstance.get(`app-users/${APP_NAME}/`);
        return response.data;
    },

    fetchAppsRecordByIdAndGrantDate: async (APP_NAME) => {
        const response = await axiosInstance.get(`app-users/date-granted/${APP_NAME}/`);
        return response.data;
    },

    //PROVISIONING
    getProvisioningProcessByID: async(APP_NAME) => {
        const response = await axiosInstance.get(`process/provisioning/${APP_NAME}/`);
        return response.data;
    }, 

    createProvisioningProcess: async(appData) => {
        const response = await axiosInstance.post(`process/provisioning/`, appData);
        return response.data;
    }, 

    updateProvisioningProcess: async(APP_NAME, appData) => {
        const response = await axiosInstance.put(`process/provisioning/${APP_NAME}/`, appData);
        return response.data;
    }, 

    //TERMINATION
    getTerminationProcessByID: async(APP_NAME) => {
        const response = await axiosInstance.get(`process/termination/${APP_NAME}/`);
        return response.data;
    }, 

    createTerminationProcess: async(appData) => {
        const response = await axiosInstance.post(`process/termination/`, appData);
        return response.data;
    }, 

    updateTerminationProcess: async(APP_NAME, appData) => {
        const response = await axiosInstance.put(`process/termination/${APP_NAME}/`, appData);
        return response.data;
    }, 

    //UAR

    getUARProcessByID: async(APP_NAME) => {
        const response = await axiosInstance.get(`process/uar/${APP_NAME}/`);
        return response.data;
    }, 

    createUARProcess: async(appData) => {
        const response = await axiosInstance.post(`process/uar/`, appData);
        return response.data;
    }, 

    updateUARProcess: async(APP_NAME, appData) => {
        const response = await axiosInstance.put(`process/uar/${APP_NAME}/`, appData);
        return response.data;
    }, 

     //ADMIN

    getAdminProcessByID: async(APP_NAME) => {
        const response = await axiosInstance.get(`process/admin/${APP_NAME}/`);
        return response.data;
    }, 

    createAdminProcess: async(appData) => {
        const response = await axiosInstance.post(`process/admin/`, appData);
        return response.data;
    }, 

    updateAdminProcess: async(APP_NAME, appData) => {
        const response = await axiosInstance.put(`process/admin/${APP_NAME}/`, appData);
        return response.data;
    }, 

};

export default appService;
