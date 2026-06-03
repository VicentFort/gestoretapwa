import { defineStore } from "pinia";
import api from "./api";
import { isManager } from "./checkAccessType";
import Cookies from "js-cookie";

let rememberSession = false;
import router from "@/router";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    userEmail: null,
    userInfo: null,
    userPfp: null,
    fallaAdminInfo: null,
  }),
  persist: {
    key: "auth_session", // El nombre que tendrá la cookie en el navegador
    storage: {
      getItem: (key) => Cookies.get(key),
      setItem: (key, value) => {
        const rememberSession = Cookies.get("falla_remember_me") === "true"
        if (rememberSession) {
          // Si marcó el checkbox, la cookie dura 7 días y sobrevive al cerrar el navegador
          Cookies.set(key, value, { 
            expires: 7, 
            secure: window.location.protocol === 'https:', 
          })
        } else {
          // Si NO lo marcó, NO le pasamos el parámetro 'expires'.
          // Esto crea una "Session Cookie": se borra automáticamente al cerrar el navegador/pestaña.
          Cookies.set(key, value, { 
            secure: window.location.protocol === 'https:', 
          })
        }
      },
      removeItem: (key) => Cookies.remove(key),
    },
  },
  actions: {
    //SECCIÓN USUARIOS

    /*
     * Llama al endpoint de login del backend
     */
    async login(email, password, remember) {
      try {
        if (remember) {
          // Si es true, creamos una marca que dura 7 días
          Cookies.set("falla_remember_me", "true", { expires: 7 })
        } else {
          // Si es false, nos aseguramos de borrarla si existía de antes
          Cookies.remove("falla_remember_me")
        }
        const response = await api
          .post("/auth/login", {
            email,
            password,
          })
          .catch(handleApiError);
        this.token = response.data; // El string del JWT
        this.userEmail = email;
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        router.push("/user")
        await this.fetchUserInfo();
      } catch (error) {
        throw error;
      }
    },
    /*
     * Crea un usuario en la bd a partir del parámetro de entrada.
     */
    async createUser(user, image) {
      try {
        const formData = new FormData()

        const userBlob = new Blob([JSON.stringify(user)], {
          type: 'application/json'
        })
        formData.append('user', userBlob)
        if(image) {
          formData.append("pfp", image)
        }
        const response = await api
          .post("/user/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .catch(handleApiError);
      } catch (error) {
        throw error;
      }
    },
    /*
     * Elimina la info del usuario guardada y quita los headers de autorización
     */
    logout() {
      this.token = null;
      this.userEmail = null;
      this.userInfo = null;
      this.fallaAdminInfo = null;
      this.userPfp = null;
      delete api.defaults.headers.common["Authorization"];
      this.$reset()
    },
    /*
     * Actualiza el usuario dados ciertos parámetro de entrada.
     */
    async updateUser(uName, uSurname, uBday, uShowBday, uNickname) {
      try {
        const response = await api
          .put("/user/update", {
            name: uName,
            surname: uSurname,
            birthday: uBday,
            showBday: uShowBday,
            nickname: uNickname,
          })
          .catch(handleApiError);
      } catch (error) {
        throw error;
      } finally {
        this.fetchUserInfo();
      }
    },
    /*
     * Añade una necesidad alimentaria a un usuario dada un tipo
     */
    async addFoodNeed(needType) {
      try {
        const response = await api
          .post("/user/addFoodNeed", new String(needType))
          .catch(handleApiError);
        this.fetchUserInfo();
      } catch (error) {
        console.error(error);
      }
    },
    /*
     * Elimina una necesidad alimentaria a un usuario dada su id.
     */
    async deleteNeed(need) {
      try {
        const response = await api
          .delete("/user/deleteNeed", new String(need))
          .catch(handleApiError);
        await this.fetchUserInfo();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    /*
     * Elimina disposiciones de asistencia de un usuario dada una lista con ids.
     */
    async deletePref(prefId) {
      try {
        const response = await api
          .delete("/user/removeAttPrefs", { data: [prefId] })
          .catch(handleApiError);
      } catch (error) {
        console.error(error);
      } finally {
        await this.fetchUserInfo();
      }
    },
    /*
     * Añada una disposición de asistencia de un usuario dado un id de etiqueta de evento.
     */
    async addAttPref(tagId) {
      try {
        const response = await api
          .post("/user/addAttPrefs", new Number(tagId))
          .catch(handleApiError);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        await this.fetchUserInfo();
      }
    },
    /*
     * Obtiene la información del usuario y la guarda.
     * Entre esta información está la información suya, la de su falla, y otras cosas como disposiciones o necesidades alimentarias.
     */
    async fetchUserInfo() {
      try {
        const responseInfo = await api
          .get("/user/getUserInfo")
          .catch(handleApiError);
        orderJSONStructure(responseInfo.data);
        this.userInfo = responseInfo.data;

        await this.getPfpImage();
        if (isManager(this.userInfo?.accessType)) {
          await this.fetchFallaAdminInfo();
        }
      } catch (error) {
        throw error;
      }
    },
    async readNotification(notificationId) {
      try {
        await api
          .post("/user/readNotification", notificationId)
          .catch(handleApiError);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        await this.fetchUserInfo();
      }
    },

    //SECCIÓN FALLA

    /*
     * Obtiene la información de administración de la falla.
     * Entre esta información está, la lista de usuarios, eventos, todo lo relacionado con inventario, etc...
     */
    async fetchFallaAdminInfo() {
      try {
        const response = await api.get("/falla/info").catch(handleApiError);
        orderJSONStructure(response.data);
        this.fallaAdminInfo = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    /*
     * Actualiza los permisos de administrador de un usuario.
     */
    async editAccessType(accessRequest) {
      try {
        const response = await api
          .post("/falla/editAccessType", accessRequest)
          .catch(handleApiError);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.fetchUserInfo();
      }
    },
    /*
     * Añade una etiqueta de eventos para una falla.
     */
    async addTag(name) {
      try {
        const response = await api
          .post("/falla/addEventTag", name)
          .catch(handleApiError);
        this.fetchFallaAdminInfo();
        this.fetchUserInfo();
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        await this.fetchUserInfo()
      }
    },
    /*
     * Elimina una etiqueta de eventos para una falla.
     */
    async deleteTag(id) {
      try {
        const response = await api
          .delete("/falla/deleteEventTag", {
            data: new Number(id),
          })
          .catch(handleApiError);
        this.fetchFallaAdminInfo();
        this.fetchUserInfo();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    /*
    * Actualiza el escudo de la falla
    */
    async updateFallaShield(shieldImage, fallaId) {
      try {
        const formData = new FormData()
        formData.append("shieldImage", shieldImage)
        formData.append("fallaId", fallaId)
        const response = await api.post('/falla/updateShield', formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }).catch(handleApiError)
      } catch(err) {
        throw err
      } finally {
        await this.fetchUserInfo()
      }
    },
    async updateRequest(req) {
      try {
        const response = await api.post('/falla/updateRequest', req).catch(handleApiError)

      } catch(err) {
        throw err
      } finally {
        await this.fetchUserInfo()
      }
    },
    async sendRequest(req) {
      try {
        const response = await api.post('/falla/createRequest', req).catch(handleApiError)
      } catch(err) {
        throw err
      }
    },
    //SECCIÓN EVENTOS

    /*
     * Postea / añade un evento en la base de datos
     */
    async addEvent(event, tag, users) {
      try {
        let img = null;
        if (event.eventImage !== null) {
          img = event.eventImage[1];
        }
        const response = await api
          .post("/event/create", {
            title: event.title,
            publicField: event.publicField,
            price: event.price,
            description: event.description,
            maxPeople: event.maxPeople,
            date: formatToYYYYMMDD(formatToBackend(event.date)),
            fallaId: this.fallaAdminInfo.fallaId,
            tagId: tag,
            startHour: event.startHour,
            endHour: event.endHour,
            attendants: users,
            createdBy: event.createdBy,
            open: true,
            createdAt: event.createdAt,
            endDate: formatToYYYYMMDD(formatToBackend(event.endDate)),
            checkNeeds: event.checkNeeds,
            active: true,
            eventImage: img,
          })
          .catch(handleApiError);
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        await this.fetchUserInfo();
      }
    },
    async updateFalla(req) {
      try {
        const response = await api.put("/falla/update", req).catch(handleApiError)
      }catch(err) {
        throw err
      } finally {
        await this.fetchUserInfo();
      }
    },
    //SECCIÓN EVENTOS

    /*
     * Elimina un evento dada su id.
     */
    async deleteEvent(eventId) {
      try {
        const response = await api
          .delete("/event/delete/" + eventId)
          .catch(handleApiError);
      } catch (error) {
        console.error(error);
      } finally {
        await this.fetchFallaAdminInfo();
      }
    },
    /*
     * Actualiza un evento dadas ciertas variables.
     */
    async updateEvent(eventDto) {
      try {
        const response = await api
          .put("/event/update", eventDto)
          .catch(handleApiError);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        await this.fetchUserInfo();
      }
    },
    /*
     * Añade una persona a un evento / Añade una asistencia a un evento.
     */
    async joinEvent(eventId) {
      try {
        const response = await api
          .post("/event/join/" + eventId)
          .catch(handleApiError);
      } catch (error) {
        throw error;
      } finally {
        this.fetchUserInfo();
      }
    },
    /*
     * Elimina una asistencia a un evento.
     */
    async deleteAssist(assistId) {
      try {
        const response = await api
          .delete("/event/leave/" + new Number(assistId))
          .catch(handleApiError);
      } catch (error) {
        throw error;
      } finally {
        await this.fetchUserInfo();
      }
    },

    //SECCIÓN DE INVENTARIO

    /*
     * Crea un almacén de inventario en la base de datos.
     */
    async createInventoryStore(store) {
      try {
        const response = await api
          .post("/inv/createStore", store)
          .catch(handleApiError);
      } catch (error) {
        throw error;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    /*
     * Actualiza un almacén de inventario.
     */
    async updateStore(updatedStore) {
      try {
        const response = await api
          .put("/inv/updateStore", updatedStore)
          .catch(handleApiError);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    /*
     * Crea un ítem de inventario.
     */
    async createNewInventoryItem(newItem) {
      try {
        const response = await api
          .post("/inv/createItem", newItem)
          .catch(handleApiError);
      } catch (error) {
        throw error;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    /*
     * Actualiza un ítem de inventario.
     */
    async updateInventoryItem(updatedItem) {
      try {
        const response = await api
          .put("/inv/updateItem", updatedItem)
          .catch(handleApiError);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    /*
     * Procesa un movimiento en la base de datos.
     */
    async processMovement(movement) {
      try {
        const response = await api
          .post("/inv/processMovement", movement)
          .catch(handleApiError);
        return response.data;
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    /*
     * Crea un contacto para préstamos en la base de datos.
     */
    async createContact(contact) {
      try {
        const response = await api
          .post("/inv/createContact", contact)
          .catch(handleApiError);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    /*
     * Procesa el retorno de un préstamo de inventario.
     */
    async returnLoan(returnDto) {
      try {
        const response = await api
          .post("/inv/returnLoan", returnDto)
          .catch(handleApiError);
        return response;
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    /*
     * Actualiza un contacto de préstamo de inventario.
     */
    async updateContact(contact) {
      try {
        const response = await api
          .put("/inv/updateContact", contact)
          .catch(handleApiError);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    async sellCoupon(coupon) {
      try {
        const response = await api
          .post("/payment/sellCoupon", coupon)
          .catch(handleApiError);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    async exchangeCoupon(coupon) {
      try {
        const response = await api
          .post("/payment/exchangeCoupon", coupon)
          .catch(handleApiError);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        await this.fetchFallaAdminInfo();
      }
    },
    async feePayment(request) {
      try {
        const response = await api
          .post("/payment/feePayment", request)
          .catch(handleApiError);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    async eventPayment(request) {
      try {
        const response = await api
          .post("/payment/eventPayment", request)
          .catch(handleApiError);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    async editCoupon(coupon) {
      try {
        const response = await api
          .put("/payment/editCoupon", coupon)
          .catch(handleApiError);
      } catch (err) {
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    async createCoupon(request) {
      try {
        const response = await api
          .post("/payment/createCoupon", request)
          .catch(handleApiError);
      } catch (err) {
        throw err;
      } finally {
        this.fetchFallaAdminInfo();
      }
    },
    async getPfpImage() {
      try {
        const response = await api
          .get("/user/downloadPfp", { responseType: "blob" })
          .catch(handleApiError);
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          const base64String = reader.result;
          this.userPfp = base64String;
        };
      } catch (err) {
        throw err;
      }
    },
    async uploadPfpImage(imageData) {
      try {
        const response = await api
          .post("/user/changePfp", imageData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .catch(handleApiError);
        this.getPfpImage();
      } catch (err) {
        throw err;
      }
    },

    async generateQrCode(couponId, stockId, amount, itemId) {
      try {
        const response = await api
          .get("/payment/generateCouponQR", {
            params: { couponId, stockId, amount, itemId },
          })
          .catch(handleApiError);

        if (typeof response.data === "object" && response.data.text) {
          return response.data.text;
        }
        return response.data;
      } catch (err) {
        throw err;
      }
    },
  },
});

/*
 * Función que envia emails al contacto de todos los loans que estén atrasados
 * y que no tenga notificaiones de retraso
 * loan.state == 'Atrassat' && loan.hasDelayedNotification == true
 */
const sendDelayedEmails = async (loans) => {
  loans.forEach((loan) => {
    if (loan.state == "Atrassat" && loan.hasDelayedNotifications == false) {
      const serviceId = process.env.VUE_APP_EMAIL_JS_SERVICE_ID;
      const key = process.env.VUE_APP_EMAIL_JS_KEY;
    }
  });
};

/*
 * Función que hace de listener cuando la api de Axios recibe un error.
 * este es tratado dependiendo de las posibles formas en que venga la respuesta de error.
 */
const handleApiError = (error) => {
  console.error(error);
  if (error.message != null) throw error.response.data;

  throw error.response.data;
};

/*
 * Funciones de formateo de fechas para que las entienda el backend.
 */
const formatToBackend = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;
  const localISO = new Date(d.getTime() - offset).toISOString();
  return localISO.replace("T", " ").replace("Z", "");
};
const formatToYYYYMMDD = (date) => {
  if (!date) return null;

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Ordena recursivamente todos los arrays de un JSON sin importar su estructura interna.
 */
function orderJSONStructure(data) {
  // 1. Si no es objeto o es nulo, terminamos (Caso base)
  if (typeof data !== "object" || data === null) {
    return data;
  }

  // 2. Si es un Array, lo ordenamos primero
  if (Array.isArray(data)) {
    data.sort((a, b) => {
      // Convertimos a string para tener una base de comparación universal
      // Esto funciona para números, strings, y objetos (los ordena por su representación)
      const valA = typeof a === "object" ? JSON.stringify(a) : a;
      const valB = typeof b === "object" ? JSON.stringify(b) : b;

      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });

    // 3. Después de ordenar el array, entramos en sus elementos por si tienen más arrays
    data.forEach((item) => orderJSONStructure(item));
  } else {
    // 4. Si es un objeto, recorremos sus claves
    Object.keys(data).forEach((key) => {
      data[key] = orderJSONStructure(data[key]);
    });
  }

  return data;
}
