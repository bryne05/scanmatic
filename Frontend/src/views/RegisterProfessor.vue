<script setup>
import { useRouter } from "vue-router";
import { baseURL } from "../config";
import axios from "axios";
import { ref } from "vue";
import Box from "../components/box.vue";
import Swal from "sweetalert2";

const router = useRouter();

const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const username = ref("");
const password = ref("");
const confirmpassword = ref("");
const submitForm = async () => {
  try {
    // Check if required fields are empty
    if (
      !firstName.value ||
      !lastName.value ||
      !username.value ||
      !password.value ||
      !confirmpassword.value
    ) {
      Swal.fire(
        "Error!",
        "All fields are required except Middle Name.",
        "error"
      );
      return;
    }

    if (password.value !== confirmpassword.value) {
      Swal.fire("Error!", "Password do not match. Please try again.", "error");
      return;
    }
    const RegisterProfessor = await axios.post(
      `${baseURL}/api/professor/registerProfessor`,
      {
        first_name: firstName.value,
        middle_name: middleName.value,
        last_name: lastName.value,
        username: username.value,
        password: password.value,
      }
    );
    if (RegisterProfessor.status === 200) {
      Swal.fire("Success!", "Registration successful.", "success");
      router.push("/ZXNzb3IiLCJVfrvonD");
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Registration failed. Please try again.";
    Swal.fire("Error!", errorMessage, "error");
  }
};
</script>
<template>
  <div class="bg-login">
    <div
      class="container-fluid d-flex flex-column justify-content-center align-items-center pt-5"
    >
      <Box />
      <div
        class="row white-bg d-flex justify-content-center align-items-center"
      >
        <div class="col-2"></div>
        <div class="col-md-8">
          <h1 class="text-center fw-bold inv">Hello, Professor!!</h1>
          <h4 class="text-center inv">Register</h4>
          <div class="row">
            <div class="col-6">
              <form action="" class="text-start">
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
              </form>
            </div>
            <div class="col-6">
              <form action="" class="text-start">
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

                <label class="fw-bold inv">Confirm Password</label>
                <input
                  v-model="confirmpassword"
                  type="password"
                  class="form-control cus-border mb-2"
                  placeholder="Enter your Password"
                />
              </form>
            </div>
          </div>

          <div class="text-center py-4 inv">
            <button @click="submitForm" class="btnsyle">Sign Up</button>
            <p>
              Already have an account?
              <RouterLink
                to="/ZXNzb3IiLCJVfrvonD"
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
    width: 80vw;
    height: 60svh;
    overflow: scroll !important;
  }
}

@media (max-width: 436px) {
  .btnsyle {
    width: 110px;
  }
  .white-bg {
    height: 65svh;
  }
}
</style>
