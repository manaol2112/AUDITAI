import axios from 'axios';
import axiosInstance from './AxiosService';

const JobService = {
//   Job Schedule Services 

  fetchSchedule: async () => {
    const response = await axiosInstance.get(`hr-job-schedule/`);
    return response.data;
  },

  fetchScheduleById: async (scheduleId) => {
    const response = await axiosInstance.get(`hr-job-schedule/${scheduleId}/`);
    return response.data;
},

  createSchedule: async (scheduleData) => {
    const response = await axiosInstance.post(`hr-job-schedule/`, scheduleData);
    return response.data;
  }, 

  updateSchedule: async (scheduleId, scheduleData) => {
    const response = await axiosInstance.put(`hr-job-schedule/${scheduleId}/`, scheduleData);
    return response.data;
  },

  deleteSchedule: async (scheduleId) => {
    const response = await axiosInstance.delete(`hr-job-schedule${scheduleId}/`);
    return response.data;
  }

};

export default JobService;
