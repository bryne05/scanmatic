<template>
  <div
    class="container-fluid d-flex justify-content-center align-items-center text-center"
  >
    <div class="">
      <div class="col-md-12"><Box /></div>

      <div class="col-md-12 white-bg reg p-4">
        <h1 class="text-center inv">Hi, Student!!</h1>
        <h4 class="text-center inv">Register</h4>
        <form @submit.prevent="submitForm" class="text-start">
          <div class="row">
            <div class="col-6">
              <label class="fw-bold inv">First name</label>
              <input
                v-model="registrationData.firstName"
                type="text"
                class="form-control cus-border mb-2"
                placeholder="Enter your First Name"
              />

              <label class="fw-bold inv">Middle name</label>
              <input
                v-model="registrationData.middleName"
                type="text"
                class="form-control cus-border mb-2"
                placeholder="Leave blank if not Available"
              />

              <label class="fw-bold inv">Last name</label>
              <input
                v-model="registrationData.lastName"
                type="text"
                class="form-control cus-border mb-2"
                placeholder="Enter your Last Name"
              />

              <label class="fw-bold inv">Program Level</label>
              <input
                v-model="registrationData.courseYearSection"
                type="text"
                class="form-control cus-border mb-2"
                placeholder="Ex BSCS 4A,BSIT 3B, GAS 11A, STEM 12B"
              />
            </div>
            <div class="col-6">
              <label class="fw-bold inv">Username</label>
              <input
                v-model="registrationData.username"
                type="text"
                class="form-control cus-border mb-2"
                placeholder="Enter your username"
              />

              <label class="fw-bold inv">Password</label>
              <input
                v-model="registrationData.password"
                type="password"
                class="form-control cus-border mb-2"
                placeholder="Enter your Password"
              />

              <label class="fw-bold inv">Confirm Password</label>
              <input
                v-model="registrationData.confirmpassword"
                type="password"
                class="form-control cus-border mb-2"
                placeholder="Confirm your Password"
              />
              <label class="fw-bold inv">Email</label>
              <input
                v-model="registrationData.email"
                type="email"
                class="form-control cus-border mb-2"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div class="text-center inv reg-button">
            <button type="submit" class="btnsyle" @click="submitForm">
              Sign Up
            </button>
            <p>
              Already have an account?
              <RouterLink
                to="/"
                style="color: black; text-decoration: none; font-weight: bold"
              >
                Login Here
              </RouterLink>
            </p>
          </div>
        </form>
      </div>
     
    </div>

    <Teleport to="body">
      <div v-if="showOtpModal" class="modal-overlay">
        <div class="modal-content">
          <h4>OTP is sent to {{ registrationData.email }}</h4>
          <div class="otp-input-container">
            <input
              v-for="(n, i) in 4"
              :key="i"
              type="number"
              class="otp-input"
              ref="otpInputs"
              :maxLength="1"
              @input="handleInput(i, $event)"
              @keydown.space.prevent
              inputmode="numeric"
              @paste="handlePaste"
            />
            <br />
            <button
              v-if="resendAvailable"
              class="btn btn-primary"
              @click="resendOTP"
            >
              Resend
            </button>
            <p v-else>{{ resendCountdown }}</p>
          </div>

          <p v-if="otpError" class="error">{{ otpError }}</p>
          <div class="modal-buttons">
            <button @click="registerStudent" class="btn btn-success">
              Verify OTP
            </button>
            <button @click="closeOtpModal" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { baseURL } from "../config";
import axios from "axios";
import { RouterLink, useRouter } from "vue-router";
import Swal from "sweetalert2";

import Box from "../components/box.vue";

const router = useRouter();

const registrationData = reactive({
  firstName: "",
  middleName: "",
  lastName: "",
  courseYearSection: "",
  username: "",
  password: "",
  confirmpassword: "",
  email: "",
  otp: "",
});

const otpInputs = ref([]);
const otpError = ref(null);
const showOtpModal = ref(false);
const resendAvailable = ref(false);
const resendCountdown = ref("Resend in 5:00");
let countdownInterval;
const handleInput = (index, event) => {
  const input = event.target;
  let value = input.value;

  value = value.replace(/\D/g, ""); // Remove non-digits
  if (value.length > 1) {
    value = value.slice(0, 1);
  }
  input.value = value;

  if (value.length === 1 && index < 3) {
    nextTick(() => {
      otpInputs.value[index + 1].focus();
    });
  }
};
const startResendCountdown = () => {
  let timeLeft = 5 * 60; // 5 minutes in seconds

  resendAvailable.value = false; // Initially disable the resend button

  countdownInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds; // Add leading zero if needed
    resendCountdown.value = `Resend in ${minutes}:${seconds}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(countdownInterval);
      resendAvailable.value = true; // Enable the resend button
      resendCountdown.value = "Resend";
    }
  }, 1000);
};
const handlePaste = (event) => {
  const pasteData = (event.clipboardData || window.clipboardData).getData(
    "text"
  );
  const digits = pasteData.replace(/\D/g, "").slice(0, 4); // Extract up to 4 digits

  // Distribute digits to input fields
  for (let i = 0; i < Math.min(digits.length, 4); i++) {
    otpInputs.value[i].value = digits[i];
  }

  // Focus on the next empty input or verify if all are filled
  const nextInputIndex = digits.length < 4 ? digits.length : 3;
  if (nextInputIndex < 4) {
    nextTick(() => otpInputs.value[nextInputIndex].focus());
  } else {
    verifyOTP();
  }

  event.preventDefault(); // Prevent default paste behavior
};

const resendOTP = async () => {
  try {
    const response = await axios.post(`${baseURL}/api/student/sendOTP`, {
      email: registrationData.email,
    });
    if (response.status === 200) {
      Swal.fire(
        "Success",
        response.data.message || "Failed to send OTP.",
        "success"
      );
      otpError.value = null;
      otpInputs.value.forEach((input) => (input.value = ""));
      nextTick(() => otpInputs.value[0].focus());

      clearInterval(countdownInterval);
      resendAvailable.value = false;
      resendCountdown.value = "Resend in 5:00";
      startResendCountdown();
    } else {
      otpError.value = response.data.message || "Failed to resend OTP.";
    }
  } catch (error) {
    Swal.fire("Error", response.data.message || "Failed to send OTP.", "error");
  }
};
const submitForm = async () => {
  if (submitForm.isSubmitting) {
    return; // Do nothing if already submitting
  }

  submitForm.isSubmitting = true;
  // Basic form validation
  const { otp, ...registrationDataWithoutOTP } = registrationData;
  if (
    Object.values(registrationDataWithoutOTP).some(
      (value) => !value && value !== registrationData.middleName
    )
  ) {
    Swal.fire("Error!", "All fields are required except Middle Name.", "error");
    return;
  }

  if (registrationData.password !== registrationData.confirmpassword) {
    Swal.fire("Error!", "Passwords do not match. Please try again.", "error");
    return;
  }

  try {
    const response = await axios.post(`${baseURL}/api/student/sendOTP`, {
      email: registrationData.email,
    });

    if (response.status === 200) {
      showOtpModal.value = true;
      startResendCountdown(); // Show the custom modal
    } else {
      Swal.fire(
        "Error",
        response.data.message || "Failed to send OTP.",
        "error"
      );
    }
  } catch (error) {
    Swal.fire("Error", "Failed to send OTP. Please try again.", "error");
    console.error("OTP sending error:", error);
  }
};

const closeOtpModal = () => {
  showOtpModal.value = false;
  otpInputs.value.forEach((input) => (input.value = "")); // Clear OTP inputs
  otpError.value = null;
};

const registerStudent = async () => {
  const enteredOTP = otpInputs.value.map((input) => input.value).join("");
  registrationData.otp = enteredOTP;

  try {
    const registerStudent = await axios.post(
      `${baseURL}/api/student/registerStudent`,
      {
        admin_id: 5,
        username: registrationData.username,
        password: registrationData.password,
        first_name: registrationData.firstName,
        middle_name: registrationData.middleName,
        last_name: registrationData.lastName,
        courseYearSection: registrationData.courseYearSection,
        email: registrationData.email,
        otp: registrationData.otp,
      }
    );

    if (registerStudent.status === 200) {
      Swal.fire("Success!", "Registration successful.", "success");
      setTimeout(() => {
        router.push("/");
      }, 1600);
    } else {
      const errorMessage =
        registerStudent.response?.data?.message || "Registration failed.";
      Swal.fire("Error!", errorMessage, "error");
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Registration failed.";
    Swal.fire("Error!", errorMessage, "error");
    console.error("Registration error:", error);
  }
};
</script>

<style scoped>
.cus-border {
  border-width: 1px;
  border-color: black;
}
.btnsyle {
  margin-top: 25px;
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
  height: 55vh;
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
.btnsyle {
  width: 110px;
}
.white-bg {
  height: 60svh;
}
.error {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Semi-transparent backdrop */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* Ensure it's on top */
}
.modal-content {
  width: 500px;
  height: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  min-width: 300px;
  display: flex;
  justify-content: center;
  /* Adjust as needed */
}
.modal-buttons {
  display: flex;
  justify-content: center;
  /* Center the buttons */
  margin-top: 20px;
}
.modal-buttons button {
  margin: 0 10px;
  /* Add some spacing between buttons */
}
.cancel {
  background-color: gray;
}
/* .otp-input-container {
  display: flex;
  justify-content: center;
 
} */
.otp-input-container input {
  width: 40px;
  height: 40px;
  font-size: 20px;
  border: 1px solid #ccc;
  margin: 5px;
  text-align: center;
  border-radius: 5px;
  background-color: white;
  color: black;
}
.otp-input-container input {
  /* ... other styles ... */
  -moz-appearance: textfield; /* For Firefox */
  -webkit-appearance: none; /* For WebKit browsers (Chrome, Safari) */
  appearance: none; /* The standard property - Add this! */
}

.otp-input-container input::-webkit-outer-spin-button,
.otp-input-container input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
