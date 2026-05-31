import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: "/user",
    name: "User Info",
    component: () => import("../views/UserView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: { requiresAuth: false }, // ✅ Cambiado a false para que cualquiera pueda entrar
  },
  {
    path: "/adminPanel",
    name: "adminPanel",
    component: () => import("../views/AdminPanelView.vue"),
    meta: { requiresAuth: true }, // ✅ Corregido el typo y protegido
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 1. Si la ruta requiere autenticación y NO hay token
  if (to.meta.requiresAuth && !authStore.token) {
    return next({ name: 'login' })
  }

  // 2. Si intenta ir al login pero YA está autenticado, lo mandamos a la Home
  if (to.name === 'login' && authStore.token) {
    return next('/')
  }
  

  next() // Permitir el paso si todo está en orden
})
export default router;
