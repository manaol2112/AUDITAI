import axios from 'axios';
import axiosInstance from './AxiosService';

const JobService = {
//   Job Schedule Services 

  fetchHRSchedule: async () => {
    const response = await axiosInstance.get(`hr-job-schedule/`);
    return response.data;
  },

  fetchHRScheduleById: async (scheduleId) => {
    const response = await axiosInstance.get(`hr-job-schedule/${scheduleId}/`);
    return response.data;
},

  fetchAppJobScheduleById: async (scheduleId) => {
    const response = await axiosInstance.get(`jobschedule/${scheduleId}/`);
    return response.data;
  },

  createHRSchedule: async (scheduleData) => {
    const response = await axiosInstance.post(`hr-job-schedule/`, scheduleData);
    return response.data;
  }, 

  createAppJobSchedule: async (scheduleData) => {
    const response = await axiosInstance.post(`app-job-schedule/`, scheduleData);
    return response.data;
  }, 

  updateSchedule: async (scheduleId, scheduleData) => {
    const response = await axiosInstance.put(`hr-job-schedule/${scheduleId}/`, scheduleData);
    return response.data;
  },

  createAppJobAlert: async (jobData) => {
    const response = await axiosInstance.post(`app-job-alert/`, jobData);
    return response.data;
  }, 

  createHRJobAlert: async (jobData) => {
    const response = await axiosInstance.post(`hr-job-alert/`, jobData);
    return response.data;
  }, 

  updateJobAlert: async (appID, jobData) => {
    const response = await axiosInstance.put(`app-job-alert/${appID}/`, jobData);
    return response.data;
  },

  updateHRJobAlert: async (jobID, jobData) => {
    const response = await axiosInstance.put(`hr-job-alert/${jobID}/`, jobData);
    return response.data;
  },

  fetchAppJobAlertById: async (appID) => {
    const response = await axiosInstance.get(`jobalert/${appID}/`);
    return response.data;
  },

  fetchAppJobLogById: async (appID) => {
    const response = await axiosInstance.get(`joblog/${appID}/`);
    return response.data;
  },

  fetchHRJobAlert: async (appID) => {
    const response = await axiosInstance.get(`hr-job-alert/`);
    return response.data;
  },

  fetchHRJobLog: async (appID) => {
    const response = await axiosInstance.get(`hr-job-log/`);
    return response.data;
  },

  deleteSchedule: async (scheduleId) => {
    const response = await axiosInstance.delete(`hr-job-schedule${scheduleId}/`);
    return response.data;
  }

};

export default JobService;
