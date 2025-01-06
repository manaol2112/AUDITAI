import axios from 'axios';
import axiosInstance from './AxiosService';

const OnboardingService = {

  fetchRegistration: async () => {
    const response = await axiosInstance.get('registration/');
    return response.data;
  },

  fetchRegistrationByID: async (registrationID) => {
    const response = await axiosInstance.get(`fetch-registration-id/${registrationID}/`);
    return response.data;
  },

  createRegistration: async (registrationData) => {
    const response = await axiosInstance.post(`registration/`, registrationData);
    return response.data;
  },

   //EMAIL
   sendRegistrationConfirmation: async (registrationData) => {
    const response = await axiosInstance.post('send-registration-confirmation/',registrationData);
    return response.data;
  },


}

export default OnboardingService;
