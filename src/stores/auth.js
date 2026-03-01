import { defineStore } from "pinia";
import api from "./api";


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
        });

        this.token = response.data; // El string del JWT
        this.userEmail = email;

        sessionStorage.setItem("token", this.token);
        sessionStorage.setItem("userEmail", this.userEmail);

        // Configura axios para enviar el token en futuras peticiones
        await this.fetchUserInfo()
        

      } catch (error) {
        console.error(error);
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
    async updateUser(uName, uSurname, uBday, uShowBday) {
      try {
          const response = await api.put('/user/update', {
              name: uName,
              surname: uSurname,
              birthday: uBday,
              showBday: uShowBday
          })
          if(response.data.success != null && !response.data.success) {
            throw response.data?.message
          }
          this.userInfo = response.data
          sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));

      } catch(error) {
        console.error(error)
      }
    },
    async addFoodNeed(description) {
      try {
          const response = await api.post("/user/addFoodNeed?description="+description+'')
          if(response.data?.success != null && !response.data.success) throw response.data?.message
          this.userInfo = response.data
          sessionStorage.setItem("userInfo", JSON.parse(this.userInfo))
          
        } catch(error) {
          console.error(error)
        }
      },
      async deleteNeed(needId) {
        try {
          const response = await api.delete("/user/deleteNeed?needId="+needId+'')
          if(response.data.sucess!= null && !response.data?.success) throw response.data.message
          await this.fecthUserInfo()
        } catch(error) {
          console.error(error)
        }
      },
      async fetchUserInfo() {
        try {
          const responseInfo = await api.get("/user/getUserInfo");

          this.userInfo = responseInfo.data;
          sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));

          if(this.userInfo.adminAccess==true) {
            await this.fetchFallaAdminInfo()
          }

        } catch (error) {
          console.error(error)
        }
      },
      async addEvent(event) {
        try {
          const response = await api.post('/event/create', {
            title: event.title,
            publicField: event.publicField,
            done: false,
            price: event.price,
            description: event.description,
            maxPeople: event.maxPeople,
            date: event.date,
            fallaId: this.fallaAdminInfo.fallaId,
            tagId: event.tagId
          })
          if(response.data.sucess!= null && !response.data?.success) throw response.data.message
          await this.fetchFallaAdminInfo()
        } catch(error) {
          console.error(error)
        }
      },
      async fetchFallaAdminInfo() {
        try {
          const response = await api.get('/falla/info')
          if(response.data.sucess!= null && !response.data?.success) throw response.data.message
          this.fallaAdminInfo = response.data
          sessionStorage.setItem('fallaAdminInfo', JSON.stringify(this.fallaAdminInfo))
        } catch(error) {
          console.log(error)
        }
      }
    }
  },
);
