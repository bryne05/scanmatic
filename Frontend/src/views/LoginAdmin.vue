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

const submitForm = async (event) => {
  // Prevent the form's default submission behavior
  event.preventDefault();

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
    // admin login
    const loginAdmin = await axios.post(`${baseURL}/api/admin/loginAdmin`, {
      username: username.value,
      password: password.value,
    });

    console.log(username.value);
    console.log(password.value);

    console.log(loginAdmin.data.message);

    console.log(loginAdmin.status);
    console.log(loginAdmin.data.token);
    if (loginAdmin.status === 200) {
      const token = loginAdmin.data.token;
      localStorage.setItem("admintoken", token);
      Swal.fire({
        title: "Success!",
        text: "Admin logged in successfully.",
        icon: "success",
      });

      // Redirect to Admin Dashboard
      router.push("/AdminDashboard");
    }
  } catch (err) {
    // Handle errors for admin login
    Swal.fire({
      title: "Error!",
      text: "Invalid Username or Password",
      icon: "error",
    });
  }
};
</script>

<template>
  <div class="bg-login">
    <div
      class="container-fluid d-flex flex-column justify-content-center align-items-center pt-5"
    >
      <Box />

      <div class="row white-bg">
        <div class="col-xl-2"></div>
        <div class="col-xl-8">
          <h1 class="text-center fw-bold mt-5 inv">Welcome to ScanMatic</h1>
          <h4 class="text-center inv">Hello Admin!</h4>
          <form @submit.prevent="submitForm" class="text-start mx-5">
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

            <div class="text-center py-4">
              <button type="submit" class="btnsyle mb-2">Sign In</button>
            </div>
          </form>
        </div>
        <div class="col-xl-2"></div>
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
