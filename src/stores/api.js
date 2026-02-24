import axios from "axios";

const API_IP = "http://37.135.29.68:8080";
const LOCAL_API_IP = "http://localhost:8080";

const api = axios.create({
  baseURL: API_IP
})
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api