import axios from 'axios'
import { getCsrfToken } from '../utils/csrf';

axios.interceptors.request.use((config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
        config.headers['X_CSRFToken'] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error)
})