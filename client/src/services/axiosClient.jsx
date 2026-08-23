import axios from "axios";
import { store } from "../app/store";
import { logout } from "../app/auth/userSlice";
import { logoutAdmin } from "../app/auth/adminSlice";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// ========================================
// REQUEST INTERCEPTOR (very stable)
// ========================================
axiosClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const adminToken = state.admin?.token;
    const userToken = state.user?.token;

    // Priority: Admin token first
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ========================================
// RESPONSE INTERCEPTOR (auto logout correct role)
// ========================================
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const state = store.getState();
    const adminToken = state.admin?.token;
    const userToken = state.user?.token;

    if (error.response?.status === 401) {
      // If admin is logged in → logout admin
      if (adminToken) {
        store.dispatch(logoutAdmin());
      }
      // Else if user logged in → logout user
      else if (userToken) {
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
