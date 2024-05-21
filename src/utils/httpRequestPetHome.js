import axios from 'axios';
import * as authServices from '~/services/authServices';

// Instance cho các request có xác thực
const authRequest = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL_PETHOME,
});

const publicRequest = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL_PETHOME,
});

// Request interceptor để thêm token vào mỗi request authRequest
authRequest.interceptors.request.use(
    async config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = accessToken;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor để làm mới token nếu cần thiết
authRequest.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await authServices.getNewAccessToken();
            localStorage.setItem('accessToken', newAccessToken);
            axios.defaults.headers.common['Authorization'] = newAccessToken;
            return authRequest(originalRequest);
        }
        return Promise.reject(error);
    }
);

export { authRequest, publicRequest };
