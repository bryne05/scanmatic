import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import "./style.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import backgroundImage from "./assets/bg.jpg";



// Initialize Pinia store
const pinia = createPinia();

// Create Vue application instance
const app = createApp(App);

// Use plugins (Pinia must be used before other plugins)
app.use(pinia);
app.use(router);

// Mount the application
app.mount("#app");
