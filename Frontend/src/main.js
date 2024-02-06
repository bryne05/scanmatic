import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import router from "./router/index.js";

// const BackendUrl = ref("https://llama-assuring-monster.ngrok-free.app");

import backgroundImage from "./assets/bg.jpg";

//document.body.style.backgroundColor = "black";
document.body.style.backgroundImage = `url(${backgroundImage})`;
document.documentElement.style.height = "100vh";
document.body.style.height = "100vh";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundRepeat = "repeat";
document.body.style.overflow = "hidden";
const app = createApp(App);

app.use(router); // Use the router configuration
app.mount("#app");
