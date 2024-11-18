import axiosInstance from './AxiosService';

const HRService = {

    fetchHRRecordByEmail: async (email) => {
        const response = await axiosInstance.get(`hr/data/`);
        return response.data;
    }
}

export default HRService;
