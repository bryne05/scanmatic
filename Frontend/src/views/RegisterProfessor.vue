<script setup>
import { useRouter } from "vue-router";
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

const submitForm = async () => {
  try {
    // Check if required fields are empty
    if (
      !firstName.value ||
      !lastName.value ||
      !username.value ||
      !password.value
    ) {
      Swal.fire(
        "Error!",
        "All fields are required except Middle Name.",
        "error"
      );
      return;
    }

    const RegisterProfessor = await axios.post(
      "http://localhost:5000/api/professor/registerProfessor",
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
        router.push("/");
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Registration failed. Please try again.";
    Swal.fire("Error!", errorMessage, "error");
  }
};
</script>
<template>
  <div class="container-fluid app">
    <Box />
    <div class="row white-bg">
      <div class="col-2"></div>
      <div class="col-md-8">
        <h1 class="text-center fw-bold inv">Hello, Professor!!</h1>
        <h4 class="text-center inv">Register</h4>
        <form action="" class="text-start mx-5">
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
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
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
  height: 60svh;
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
