import { createRouter, createWebHistory } from "vue-router";
// @ts-ignore
import { routes } from "vue-router/auto";

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
