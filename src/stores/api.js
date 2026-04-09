import axios from "axios";
import { useLoadingStore } from "./loadingStore";


const API_IP = "https://gestoretaapp-production.up.railway.app";
const LOCAL_API_IP = "http://192.168.1.24:8080";
const GOOGLE_CALLENDAR_API = 'https://www.googleapis.com/auth/calendar';
const api = axios.create({
  baseURL: LOCAL_API_IP
})
api.interceptors.request.use(config => {
  const loading = useLoadingStore()
  loading.show()
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
api.interceptors.response.use(
  response => {
    const loading = useLoadingStore();
    loading.hide(); // Desactivamos al recibir respuesta
    return response;
  },
  error => {
    const loading = useLoadingStore();
    loading.hide(); // Desactivamos aunque falle
    return Promise.reject(error);
  }
);

export default api
/*
export const crearEvento = async (evento)=> {
  const calendarId = 'primary'; // 'primary' se refiere al calendario principal del usuario
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

  try {
    const response = await axios.post(url, evento, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Evento creado con éxito:', response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error('Error al crear el evento:', error.response ? error.response.data : error.message);
  }
}
*/