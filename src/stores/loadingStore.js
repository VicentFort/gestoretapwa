import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    isLoading: false,
    activeRequests: 0, // Contador para manejar múltiples llamadas simultáneas
  }),
  actions: {
    show() {
      this.activeRequests++;
      this.isLoading = true;
    },
    hide() {
      this.activeRequests--;
      if (this.activeRequests <= 0) {
        this.activeRequests = 0;
        this.isLoading = false;
      }
    },
  },
});
