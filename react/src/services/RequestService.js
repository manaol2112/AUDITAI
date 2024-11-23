import axiosInstance from './AxiosService';

const RequestService = {


    //Request

    fetchRequestID: async () => {
        const response = await axiosInstance.get('request-id/');
        return response.data;
    },

    fetchRequests: async () => {
        const response = await axiosInstance.get('access/request');
        return response.data;
      },
    
    fetchRequestById: async (requestId) => {
        const response = await axiosInstance.get(`access/request/${requestId}/`);
        return response.data;
    },
    
    createRequest: async (requesData) => {
        const response = await axiosInstance.post(`access/request/`,requesData);
        return response.data;
      },
    
    updateRequest: async (requestId, requestData) => {
        const response = await axiosInstance.put(`access/request/${requestId}/`, requestData);
        return response.data;
      },
    
    deleteRequest: async (requestId) => {
        const response = await axiosInstance.delete(`access/request/${requestId}/`);
        return response.data;
      },


    //Approval

    fetchApproval: async () => {
        const response = await axiosInstance.get('access/approval');
        return response.data;
      },
    
    fetchApprovalById: async (approvalID) => {
        const response = await axiosInstance.get(`access/approval/${approvalID}/`);
        return response.data;
    },
    
    createApproval: async (approvalData) => {
        const response = await axiosInstance.post(`access/approval/`,approvalData);
        return response.data;
      },

    confirmApproval: async (requestID, approvalData) => {
        const response = await axiosInstance.post(`accessrequest/approval/${requestID}/`,approvalData);
        return response.data;
      },
    
    updateApproval: async (approvalID, approvalData) => {
        const response = await axiosInstance.put(`access/approval/${approvalID}/`, approvalData);
        return response.data;
      },
    
    deleteApproval: async (approvalID) => {
        const response = await axiosInstance.delete(`access/approval/${approvalID}/`);
        return response.data;
      },

    //EMAIL
    sendEmailApproval: async (approvalData) => {
        const response = await axiosInstance.post('send-approval-request/',approvalData);
        return response.data;
      },

    //My Requests

    fetchRequestsByApp: async (requestID) => {
      const response = await axiosInstance.get(`access/myrequests/${requestID}/`);
      return response.data;
  },

    
    
};

export default RequestService;
