import { defineStore } from "pinia";
import api from "./api";
import { formToJSON } from "axios";


export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: sessionStorage.getItem("token") || null,
    userEmail: sessionStorage.getItem("userEmail") || null,
    userInfo: JSON.parse(sessionStorage.getItem("userInfo")) || null,
    fallaAdminInfo: JSON.parse(sessionStorage.getItem("fallaAdminInfo") || null),
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await api.post("/auth/login", {
          email,
          password,
        }).catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            })
        this.token = response.data; // El string del JWT
        this.userEmail = email;

        sessionStorage.setItem("token", this.token);
        sessionStorage.setItem("userEmail", this.userEmail);

        // Configura axios para enviar el token en futuras peticiones
        await this.fetchUserInfo()
        

      } catch (error) {
        throw error
      }
    },
    logout() {
      this.token = null;
      this.userEmail = null;
      this.userInfo = null;
      this.fallaAdminInfo = null;

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userInfo")
      sessionStorage.removeItem("fallaAdminInfo");

      delete api.defaults.headers.common["Authorization"];
    },
    async updateUser(uName, uSurname, uBday, uShowBday, uNickname) {
      try {
          const response = await api.put('/user/update', {
              name: uName,
              surname: uSurname,
              birthday: uBday,
              showBday: uShowBday,
              nickname: uNickname
          }).catch(function (error) {
              if(!error.response.data?.success) {
                throw error.response.data.message
              }
              throw error.message
            })
          if(response.data.success != null && !response.data.success) {
            throw response.data?.message
          }
          this.userInfo = response.data
          sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));

      } catch(error) {
        throw error
      }
    },
    async addFoodNeed(description) {
      try {
          const response = await api.post('/user/addFoodNeed?description', {
            desc: description
          });        
          this.fetchUserInfo()
          
        } catch(error) {
          console.error(error)
        }
      },
      async deleteNeed(needId) {
        try {
          const response = await api.delete("/user/deleteNeed?needId="+needId+'').catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            })
          await this.fetchUserInfo()
        } catch(error) {
          console.error(error)
        }
      },
      async fetchUserInfo() {
        try {
          const responseInfo = await api.get("/user/getUserInfo").catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            });
          
            orderJSONStructure(responseInfo.data)
          this.userInfo = responseInfo.data;
    
          sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));

          if(this.userInfo.adminAccess==true) {
            await this.fetchFallaAdminInfo()
          }

        } catch (error) {
          console.error(error)
        }
      },
      async addEvent(event, tag, users) {
        try {
          const response = await api.post('/event/create', {
            title: event.title,
            publicField: event.publicField,
            done: false,
            price: event.price,
            description: event.description,
            maxPeople: event.maxPeople,
            date: formatToYYYYMMDD(event.date),
            fallaId: this.fallaAdminInfo.fallaId,
            tagId: tag,
            startHour: event.startHour,
            endHour: event.endHour,
            attendants: users,
            createdBy: event.createdBy,
            open: event.open,
            createdAt: event.createdAt,
            endDate: formatToYYYYMMDD(event.endDate)
          }).catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            })
            return response.data;
        } catch(error) {
          throw error
        } finally{
          await this.fetchFallaAdminInfo()
          await this.fetchUserInfo()
        }
      },
      async fetchFallaAdminInfo() {
        try {
          const response = await api.get('/falla/info').catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            })
            orderJSONStructure(response.data)
          this.fallaAdminInfo = response.data
          sessionStorage.setItem('fallaAdminInfo', JSON.stringify(this.fallaAdminInfo))
        } catch(error) {
          console.error(error)
        }
      },
      async deleteEvent(eventId) {
          try {
            const response = await api.delete('/event/delete/'+eventId).catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            })
          } catch(error) {
            console.error(error)
          } finally {
            await this.fetchFallaAdminInfo()
          }
      },
      async deletePref(prefId) {
          try {
            const response = await api.delete('/user/removeAttPrefs',{data:[prefId]}).catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            })
          } catch(error) {
            console.error(error)
          } finally {
            await this.fetchUserInfo()
          }
      },
      async addAttPref(tagId) {

         try {
            const response = await api.post('/user/addAttPrefs', new Number(tagId)).catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            })
          } catch(error) {
            console.error(error)
            throw error
          } finally {
            await this.fetchUserInfo()
          }
      },
      async editAdminAccess(userId, adminAccess) {
        try {
          const response = await api.post('/falla/editAdminAccess/'+userId, new Boolean(adminAccess)).catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            })
          
        } catch(error) {
          console.error(error)
          throw error
        } finally {
          this.fetchFallaAdminInfo()
          this.fetchUserInfo()
        }
      },
      async addTag(name) {
        try {
          const response = await api.post('/falla/addEventTag',name)
          if(response.data.sucess != null || response.data?.success==false) throw response.data.message
          this.fetchFallaAdminInfo()
          this.fetchUserInfo()
        } catch(error) {
          console.error(error)
          throw error
        } finally {

        }
      },
      async deleteTag(id) {
        try {
          const response = await api.delete('/falla/deleteEventTag',{
            data: new Number(id)
          })
          if(response.data.sucess != null || response.data?.success==false) throw response.data.message
          this.fetchFallaAdminInfo()
          this.fetchUserInfo()
        } catch(error) {
          console.error(error)
          throw error
        }
      },
      async updateEvent(eventDto, eventId) {
        try {
          const response = await api.put('/event/update/'+eventId,{
            "title": eventDto.title,
              "publicField": eventDto.publicField,
              "done": eventDto.done,
              "price": eventDto.price,
              "description": eventDto.description,
              "maxPeople": eventDto.maxPeople,
              "date": eventDto.date ? new Date(eventDto.date).toLocaleDateString('en-CA') : null,
              "tagId": eventDto.tagId,
              "startHour": eventDto.startHour,
              "endHour": eventDto.endHour
          })
          if(response.data.sucess != null || response.data?.success==false) throw response.data.message
        } catch(error) {
          console.error(error)
          throw error
        } finally {
          await this.fetchFallaAdminInfo()
          await this.fetchUserInfo()
        }
      },
      async joinEvent(eventId) {
        try {
          const response = await api.post('/event/join/'+eventId)
          if(response.data.sucess != null || response.data?.success==false) throw response.data.message
  
        } catch(error) {
          throw error
        } finally {
          this.fetchFallaAdminInfo()
          this.fetchUserInfo()
        }
      },
      async deleteAssist(eventId) {
         try {
          const response = await api.delete('/event/leave/'+eventId).catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
            })
        } catch(error) {
          throw error
        } finally {
          this.fetchFallaAdminInfo()
          this.fetchUserInfo()
        }
      },
      async createUser(user) {
        try {
          const response = await api.post('/user/create', user).catch(function (error) {
              if(!error.response.data?.success) {
                console.error(error.response.data.message)
                throw error.response.data.message
              }
              throw error.message
          })
        } catch (error) {
          throw error
        }
      }
    }
  },
);


const formatToBackend = (date) => {
  if (!date) return null
  const d = new Date(date)
  const offset = d.getTimezoneOffset() * 60000
  const localISO = new Date(d.getTime() - offset).toISOString()
  return localISO.replace('T', ' ').replace('Z', '')
}
const formatToYYYYMMDD = (date) => {
  if (!date) return null;

  const d = formatToBackend(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Ordena recursivamente todos los arrays de un JSON sin importar su estructura interna.
 */
function orderJSONStructure(data) {
  // 1. Si no es objeto o es nulo, terminamos (Caso base)
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  // 2. Si es un Array, lo ordenamos primero
  if (Array.isArray(data)) {
    data.sort((a, b) => {
      // Convertimos a string para tener una base de comparación universal
      // Esto funciona para números, strings, y objetos (los ordena por su representación)
      const valA = (typeof a === 'object') ? JSON.stringify(a) : a;
      const valB = (typeof b === 'object') ? JSON.stringify(b) : b;

      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });

    // 3. Después de ordenar el array, entramos en sus elementos por si tienen más arrays
    data.forEach(item => orderJSONStructure(item));
  } else {
    // 4. Si es un objeto, recorremos sus claves
    Object.keys(data).forEach(key => {
      data[key] = orderJSONStructure(data[key]);
    });
  }

  return data;
}