<script setup>
import { ref } from "vue";
import { baseURL } from "../config";

import axios from "axios";
import { RouterLink, useRouter } from "vue-router";
import Swal from "sweetalert2";

import Box from "../components/box.vue";
const router = useRouter();

const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const courseYearSection = ref("");
const username = ref("");
const password = ref("");

const submitForm = async () => {
  try {
    // Check if required fields are empty
    if (!firstName.value || !lastName.value || !courseYearSection.value || !username.value || !password.value) {
      Swal.fire("Error!", "All fields are required except Middle Name.", "error");
      return;
    }

    const registerStudent = await axios.post(
      `${baseURL}/api/student/registerStudent`,
      {
        first_name: firstName.value,
        middle_name: middleName.value,
        last_name: lastName.value,
        courseYearSection: courseYearSection.value,
        username: username.value,
        password: password.value,
      }
    );

    if (registerStudent.status === 200) {
      Swal.fire("Success!", "Registration successful.", "success");
      setTimeout(() => {
        router.push("/");
      }, 1600);
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Registration failed. Please try again.";
    Swal.fire("Error!", errorMessage, "error");
  }
};
</script>
<template>
  <div class="container-fluid">
    <Box />
    <div class="row white-bg pb-3">
      <!-- Rest of your template -->
      <div class="col-2"></div>
      <div class="col-md-8">
        <h1 class="text-center inv">Hi, Student!!</h1>
        <h4 class="text-center inv">Register</h4>
        <form action="" class="text-start mx-4">
          <label class="fw-bold inv">First name</label>
          <input
            v-model="firstName"
            type="text"
            class="form-control cus-border mb-2"
            placeholder="Enter your First Name"
          />

          <label class="fw-bold inv">Middle name</label>
          <input
            v-model="middleName"
            type="text"
            class="form-control cus-border mb-2"
            placeholder="Leave blank if not Available"
          />

          <label class="fw-bold inv">Last name</label>
          <input
            v-model="lastName"
            type="text"
            class="form-control cus-border mb-2"
            placeholder="Enter your Last Name"
          />

          <label class="fw-bold inv">Program Level</label>
          <input
            v-model="courseYearSection"
            type="text"
            class="form-control cus-border mb-2"
            placeholder="Ex BSCS 4A,BSIT 3B, GAS 11A, STEM 12B"
          />

          <label class="fw-bold inv">Username</label>
          <input
            v-model="username"
            type="text"
            class="form-control cus-border mb-2"
            placeholder="Enter your username"
          />

          <label class="fw-bold inv">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control cus-border mb-2"
            placeholder="Enter your Password"
          />
        </form>
        <div class="text-center py-4 inv">
          <button @click="submitForm" class="btnsyle">Sign Up</button>
          <p>
            Already have an account?
            <RouterLink
              to="/"
              style="color: black; text-decoration: none; font-weight: bold"
            >
              Login Here</RouterLink
            >
          </p>
        </div>
      </div>
      <div class="col-2"></div>
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
  height: 65svh;
  overflow: hidden !important;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
  .white-bg {
    width: 80vw;
    height: 90svh;
    overflow: auto !important;
  }
}

@media (max-width: 436px) {
  .btnsyle {
    width: 110px;
  }
  .white-bg {
    height: 60svh;
  }
}
</style>
