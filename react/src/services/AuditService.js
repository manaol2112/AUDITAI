import axios from 'axios';
import axiosInstance from './AxiosService';

const auditService = {

// RISK Library

  fetchRisk: async () => {
    const response = await axiosInstance.get(`audit/risk/`);
    return response.data;
  },

  fetchRiskById: async (riskID) => {
    const response = await axiosInstance.get(`audit/risk/${riskID}/`);
    return response.data;
},

  createRisk: async (riskData) => {
    const response = await axiosInstance.post(`audit/risk/`, riskData);
    return response.data;
  }, 

  updateRisk: async (riskID, riskData) => {
    const response = await axiosInstance.put(`audit/risk/${riskID}/`, riskData);
    return response.data;
  },

  deleteRisk: async (riskID) => {
    const response = await axiosInstance.delete(`audit/risk/${riskID}/`);
    return response.data;
  },
  

  //CONTROLS LIBRARY
  
  fetchControls: async () => {
    const response = await axiosInstance.get(`audit/controls/`);
    return response.data;
  },

  fetchControlsById: async (controlID) => {
    const response = await axiosInstance.get(`audit/controls/${controlID}/`);
    return response.data;
  },

  createControls: async (controlData) => {
    const response = await axiosInstance.post(`audit/controls/`, controlData);
    return response.data;
  }, 

  updateControls: async (controlID, controlData) => {
    const response = await axiosInstance.put(`audit/controls/${controlID}/`, controlData);
    return response.data;
  },

  deleteControls: async (controlID) => {
    const response = await axiosInstance.delete(`audit/controls/${controlID}/`);
    return response.data;
  },

  //PROJECTS LIBRARY

  fetchProjects: async () => {
    const response = await axiosInstance.get(`audit/projects/`);
    return response.data;
  },

  fetchProjectsById: async (auditID) => {
    const response = await axiosInstance.get(`audit/projects/${auditID}/`);
    return response.data;
  },

  createProjects: async (projectData) => {
    const response = await axiosInstance.post(`audit/projects/`, projectData);
    return response.data;
  }, 

  updateProjects: async (auditID, projectData) => {
    const response = await axiosInstance.put(`audit/projects/${auditID}/`, projectData);
    return response.data;
  },

  deleteProjects: async (auditID) => {
    const response = await axiosInstance.delete(`audit/projects/${auditID}/`);
    return response.data;
  },

  //RISK MAPPING

  fetchRiskMapping: async () => {
    const response = await axiosInstance.get(`audit/riskmapping/`);
    return response.data;
  },

  fetchRiskMappingbyId: async (APP_NAME, COMPANY_ID) => {
    const response = await axiosInstance.get(`audit/mapping/${APP_NAME}/${COMPANY_ID}/`);
    return response.data;
  },

  createRiskMapping: async (riskmappingData) => {
    const response = await axiosInstance.post(`audit/riskmapping/`, riskmappingData);
    return response.data;
  }, 

  updateRiskMappingbyMapID: async (APP_NAME, RISK_ID, COMPANY_ID, updatedData) => {
    const response = await axiosInstance.put(`audit/riskmapping/delete/${APP_NAME}/${RISK_ID}/${COMPANY_ID}/`,updatedData);
    return response.data;
  },

  fetchRiskMappingbyApp: async (APP_NAME, COMPANY_ID) => {
    const response = await axiosInstance.get(`audit/mapping/app/${APP_NAME}/${COMPANY_ID}/`);
    return response.data;
  },

  fetchMappedControls: async (APP_NAME, RISK_ID, COMPANY_ID) => {
    const response = await axiosInstance.get(`audit/mapping/controls/${APP_NAME}/${RISK_ID}/${COMPANY_ID}/`);
    return response.data;
  },

  deleteRiskMappingbyMapID: async (APP_NAME, RISK_ID, COMPANY_ID) => {
    const response = await axiosInstance.delete(`audit/riskmapping/delete/${APP_NAME}/${RISK_ID}/${COMPANY_ID}/`);
    return response.data;
  },

  //Workpapers

  fetchWorkpaper: async () => {
    const response = await axiosInstance.get(`audit/workpapers/`);
    return response.data;
  },

  fetchWorkpapersById: async (workpaperID) => {
    const response = await axiosInstance.get(`audit/testing/${workpaperID}/`);
    return response.data;
  },

  fetchWorkpapersByApp: async (appID, companyID) => {
    const response = await axiosInstance.get(`audit/workpapers/${appID}/${companyID}/`);
    return response.data;
  },

  createWorkpaper: async (workpaperData) => {
    const response = await axiosInstance.post(`audit/workpapers/`, workpaperData);
    return response.data;
  }, 

  updateWorkpaper: async (workpaperID, workpaperData) => {
    const response = await axiosInstance.put(`audit/workpapers/${workpaperID}/`, workpaperData);
    return response.data;
  },

  deleteWorkpaper: async (workpaperID) => {
    const response = await axiosInstance.delete(`audit/workpapers/${workpaperID}/`);
    return response.data;
  },

  //PROCEDURES LIBRARY
  
  fetchProcedures: async () => {
    const response = await axiosInstance.get(`audit/testprocedures/`);
    return response.data;
  },

  fetchProceduresById: async (procedureName) => {
    const response = await axiosInstance.get(`audit/testprocedures/${procedureName}/`);
    return response.data;
  },

  createProcedures: async (procedureData) => {
    const response = await axiosInstance.post(`audit/testprocedures/`, procedureData);
    return response.data;
  }, 

  updateProcedures: async (procedureName, procedureData) => {
    const response = await axiosInstance.put(`audit/testprocedures/${procedureName}/`, procedureData);
    return response.data;
  },

  deleteProcedures: async (procedureName) => {
    const response = await axiosInstance.delete(`audit/testprocedures/${procedureName}/`);
    return response.data;
  },

   //WORKPAPER DETAILS LIBRARY
  
   fetchWorkpaperDetails: async () => {
    const response = await axiosInstance.get(`audit/workpaperdetails/`);
    return response.data;
  },

  fetchWorkpaperDetailsById: async (workpaperID) => {
    const response = await axiosInstance.get(`audit/workpaperdetails/${workpaperID}/`);
    return response.data;
  },

  createWorkpaperDetails: async (workpaperDetails) => {
    const response = await axiosInstance.post(`audit/workpaperdetails/`, workpaperDetails);
    return response.data;
  }, 

  updateWorkpaperDetails: async (workpaperID, workpaperDetails) => {
    const response = await axiosInstance.put(`audit/workpaperdetails/${workpaperID}/`, workpaperDetails);
    return response.data;
  },

  deleteWorkpaperDetails: async (workpaperID) => {
    const response = await axiosInstance.delete(`audit/workpaperdetails/${workpaperID}/`);
    return response.data;
  },

};

export default auditService;
