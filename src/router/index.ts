import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/home",
    component: () => import("@/layouts/index.vue"),
    children: [],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/resident/login/index.vue"),
    children: [],
  },
  {
    path: "/404",
    component: () => import("@/views/error/404.vue"),
  },
  {
    path: "/:path(.*)",
    component: () => import("@/views/error/404.vue"),
  },
];

// 路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

// 导出
export default router;
