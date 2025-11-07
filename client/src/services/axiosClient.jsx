import axios from "axios";
import { store } from "../app/store";
import { logout } from "../app/auth/userSlice";

// ========================================
// 🔹 Create Axios Instance
// ========================================
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // backend URL
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // optional
});

// ========================================
// 🔹 Request Interceptor: Attach Token
// ========================================
axiosClient.interceptors.request.use(
    (config) => {
        const token = store.getState().user.token; // get token from Redux

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ========================================
// 🔹 Response Interceptor: Handle Unauthorized
// ========================================
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            console.warn("Unauthorized — token may have expired.");
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
