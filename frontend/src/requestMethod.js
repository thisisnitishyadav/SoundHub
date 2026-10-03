import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_HOST}/userapp`;

export const publicRequest = axios.create({
    baseURL: BASE_URL
});

const privateRequest = axios.create({
    baseURL: BASE_URL,
});

privateRequest.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

privateRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default privateRequest;
