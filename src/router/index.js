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
    component: () =>
      import(/* webpackChunkName: "userinfo" */ "../views/UserView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/adminPanel",
    name: "adminPanel",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/AdminPanelView.vue"),
    meta: { reuqiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.token) {
    router.push({ name: "Login" });
  }
  if (to.meta.requiresAdmin && !auth.token) {
    router.push({ name: "Login" });
  }
});
export default router;
