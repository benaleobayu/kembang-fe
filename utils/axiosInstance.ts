import axios from 'axios';

// Buat instance axios
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Gunakan ENV untuk URL API
    timeout: 5000, // Timeout request
});

// Tambahkan interceptor untuk menangani respons
axiosInstance.interceptors.response.use(
    (response) => {
        // Periksa header custom untuk penghapusan storage
        const clearLocalStorage = response.headers['x-clear-localstorage'];
        const clearSessionStorage = response.headers['x-clear-sessionstorage'];

        if (clearLocalStorage === 'true') {
            localStorage.clear();
        }
        if (clearSessionStorage === 'true') {
            sessionStorage.clear();
        }

        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;