import { defineStore } from "pinia";
import api from "./api";
import { useEventStore } from "./event";


export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: sessionStorage.getItem("token") || null,
    userEmail: sessionStorage.getItem("userEmail") || null,
    fallaInfo: JSON.parse(sessionStorage.getItem("fallaInfo")) || null,
    userInfo: JSON.parse(sessionStorage.getItem("userInfo")) || null,
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
        const responseInfo = await api.get("/user/getUserInfo");

        this.userInfo = responseInfo.data;
        sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));

        this.fetchFallaIfo()
      } catch (error) {
        console.error(error);
      }
    },
    async fetchFallaIfo() {
      try {
        const response = await api.get("/user/falla");
        this.fallaInfo = response.data;
        sessionStorage.setItem("fallaInfo", JSON.stringify(this.fallaInfo));
      } catch (error) {
        console.error(error + "");
        throw error;
      }
    },
    logout() {
      this.token = null;
      this.userEmail = null;
      this.fallaInfo = null;
      this.userInfo = null;
      sessionStorage.removeItem("fallaEvents")
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("fallaInfo");
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("userEvents")
      delete api.defaults.headers.common["Authorization"];
    },
    getFallaInfo() {
      return this.fallaInfo;
    },
    getUserInfo() {
      return this.userInfo;
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
    }
  },
});
