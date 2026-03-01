import axios from "axios";


const API_IP = "http://37.135.29.68:8080";
const LOCAL_API_IP = "http://localhost:8080";
const GOOGLE_CALLENDAR_API = 'https://www.googleapis.com/auth/calendar';
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