import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Markdown from "vite-plugin-md";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), VueRouter(), Markdown()],
});
