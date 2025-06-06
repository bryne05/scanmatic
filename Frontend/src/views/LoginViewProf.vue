<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { baseURL } from "../config";
import axios from "axios";
import Box from "../components/box.vue";
import Swal from "sweetalert2";
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);
const router = useRouter();

const username = ref("");
const password = ref("");

const submitForm = async () => {
  // Check if fields are filled
  if (!username.value || !password.value) {
    Swal.fire({
      title: "Error!",
      text: "Username and Password are required.",
      icon: "error",
    });
    return;
  }

  try {
    isLoading.value = true;
    // Attempt professor login
    const loginProfessor = await axios.post(
      `${baseURL}/api/professor/loginProfessor`,
      {
        username: username.value,
        password: password.value,
      }
    );

    if (loginProfessor.status === 200) {
      const token = loginProfessor.data.token;
      localStorage.setItem("proftoken", token);

      isLoading.value = false;
      Swal.fire({
        title: "Success!",
        text: "Professor logged in successfully.",
        icon: "success",
      });
    }

    router.push({ name: "Professor" });
  } catch (errorProfessor) {
    console.error("Login Error:", errorProfessor); // Log the full error object

    if (errorProfessor.response) {
      isLoading.value = false;
      // Check for a server response
      Swal.fire({
        title: "Error!",
        text: errorProfessor.response.data.message || "Server Error",
        icon: "error",
      });
    } else {
      // Network error or other client-side error
      Swal.fire({
        title: "Error!",
        text: "A network error occurred.",
        icon: "error",
      });
    }
  }
};
</script>

<template>
  <div class="bg-login">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>

    <div
  
      class="container-fluid d-flex justify-content-center align-items-center flex-column pt-5"
    >
      <Box />

      <div class="row white-bg">
        <div class="col-2"></div>
        <div class="col-md-8">
          <h1 class="text-center fw-bold mt-5 inv">Welcome to ScanMatic</h1>
          <h4 class="text-center inv">Greetings Professors!!</h4>
          <form action="" class="text-start mx-5">
            <label class="fw-bold inv">Username</label>
            <input
              v-model="username"
              type="text"
              class="form-control cus-border mb-2"
            />

            <label class="fw-bold inv">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control cus-border mb-2"
            />
          </form>
          <div class="text-center py-4">
            <button @click="submitForm" class="btnsyle mb-2">Sign In</button>
            <p class="inv">
              Don't have an account?
              <RouterLink
                to="/RegisterProfessor"
                style="color: black; text-decoration: none; font-weight: bold"
              >
                Register Here</RouterLink
              >
            </p>
          </div>
        </div>
        <div class="col-2"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cus-border {
  border-width: 1px;
  border-color: black;
}
.btnsyle {
  background-color: black;
  color: white;
  width: 335px;
  height: 44px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: white;
  color: black;
  border-color: black;
}

.white-bg {
  margin-top: 15px;
  background-color: white;
  border-radius: 20px;
  width: 700px;
  height: 50svh;
  overflow: hidden !important;
  margin-bottom: 80px;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
  .white-bg {
    background-color: white;
    border-radius: 10px;
    width: 80vw;
    height: 60svh;
    overflow: hidden !important;
  }
}
@media (max-width: 436px) {
  .btnsyle {
    width: 110px;
  }
}
</style>
