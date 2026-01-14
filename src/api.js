import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Attach JWT from localStorage to every request
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Invalid/expired token, remove from localStorage
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// ===== RECORDS API =====
export const getRecords = () => api.get("/records").then(res => res.data);
export const getRecord = (id) => api.get(`/records/${id}`).then(res => res.data);
export const createRecord = (data) => api.post("/records", data).then(res => res.data);
export const updateRecord = (id, data) => api.put(`/records/${id}`, data).then(res => res.data);
export const deleteAllRecords = () => api.delete('/records').then(res => res.data);
export const deleteRecord = (id) => api.delete(`/records/${id}`).then(res => res.data);
export const getNextCode = () => api.get("/records/next-code").then(res => res.data);

// ===== AUTH API =====
export const loginUser = (email, password) => api.post("/auth/login", { email, password }).then(res => res.data);
export const checkUserExists = () => api.get("/auth/exists").then(res => res.data.exists);
