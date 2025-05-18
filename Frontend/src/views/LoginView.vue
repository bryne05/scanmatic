<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { baseURL } from "../config";
import axios from "axios";
import Box from "../components/box.vue";
import Swal from "sweetalert2";

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
  //student login
  try {
    const loginResponse = await axios.post(
      // Store the result in loginResponse
      `${baseURL}/api/student/loginStudent`,
      {
        username: username.value,
        password: password.value,
      }
    );

    console.log("status", loginResponse.status); // Log the status correctly

    if (loginResponse.status === 200) {
      // Check status after the request completes
      const token = loginResponse.data.token; // Access data correctly
      localStorage.setItem("studtoken", token);
      Swal.fire({
        title: "Success!",
        text: loginResponse.data.message, // Access data correctly
        icon: "success",
      });

      router.push({ name: "Student" });
    }
  } catch (errorStudent) {
    console.error("Login Error:", errorStudent); // Log the full error object

    if (errorStudent.response) {
      // Check for a server response
      Swal.fire({
        title: "Error!",
        text: errorStudent.response.data.message || "Server Error",
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
  <div
    class="container-fluid d-flex justify-content-center align-items-center flex-column"
  >
    <div class="row d-flex justify-content-center align-items-center text-center">
      <div class="col-md-12 mt-5"><Box /></div>
      <div class="col-md-4"></div>
      <div class="col-md-4 white-bg ">
        <h1 class="text-center fw-bold mt-5 inv">Welcome to ScanMatic</h1>
        <h4 class="text-center inv">Greetings Students!</h4>
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
              to="/RegisterStudent"
              style="color: black; text-decoration: none; font-weight: bold"
            >
              Register Here</RouterLink
            >
          </p>
        </div>
      </div>
      <div class="col-md-4"></div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: black !important ;
  background-image: url(../assets/bg.jpg) !important;
  background-size: cover !important;
}

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
