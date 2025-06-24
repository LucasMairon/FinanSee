import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/schema/redoc",
  headers: {
    "Content-Type": "application/json",
  },
});

// // Interceptor para adicionar token, se necessário
// api.interceptors.request.use((config) => {
//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
