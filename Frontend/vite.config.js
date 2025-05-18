import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: "./localhost-key.pem",
      cert: "./localhost.pem",
    },
    host: "0.0.0.0",
  },
  optimizeDeps: {
    include: ["vue-spinner"],
  },
});
