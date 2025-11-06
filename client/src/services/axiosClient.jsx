import axios from 'axios';

// ================================
// 🔹 Create Axios Instance
// ================================
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // optional: 10s timeout
});

export default axiosClient;
