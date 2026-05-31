import axios from "axios";
import { useLoadingStore } from "./loadingStore";
import { useAuthStore } from "./auth";

const API_IP =
  "https://nondistributive-nonhedonistically-monserrate.ngrok-free.dev";
const LOCAL_API_IP = "http://37.135.29.68:8080";
const GOOGLE_CALLENDAR_API = "https://www.googleapis.com/auth/calendar";
const api = axios.create({
  baseURL: API_IP,
  headers: {
    // Esta cabecera le dice a ngrok que ignore el aviso y te dé el JSON directo
    "ngrok-skip-browser-warning": true,
  },
});
api.interceptors.request.use(
  (config) => {
    const loading = useLoadingStore();
    const auth = useAuthStore()
    loading.show();
    const token = auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      
      // Limpiamos el store de Pinia (y por ende la cookie de forma automática)
      authStore.$reset() 
      
      // Redirigimos al Login de inmediato
      router.push({ name: 'Login' })
    }
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    const loading = useLoadingStore();
    loading.hide(); // Desactivamos al recibir respuesta
    return response;
  },
  (error) => {
    const loading = useLoadingStore();
    loading.hide(); // Desactivamos aunque falle
    return Promise.reject(error);
  }
);

export default api;
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
