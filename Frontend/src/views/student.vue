<script setup>
import { useRouter } from "vue-router";
import QrcodeVue from "qrcode.vue";
import axios from "axios";
import { baseURL } from "../config";

import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

import { useShopData } from "../composables/useShopData";

const { clearStateData } = useShopData();

const token = ref(localStorage.getItem("studtoken")); // Make token reactive
const size = 300;
const qrToken = ref("")
const router = useRouter();
const studentData = ref(null);
const showQrCode = ref(false);
const timer = ref(25);
const intervalId = ref(null);

onMounted(async () => {
  try {
    const getStudent = await axios.get(`${baseURL}/api/student/getStudent`, {
      headers: {
        studtoken: token.value, // Use token.value
        "ngrok-skip-browser-warning": "69420",
      },
    });
    studentData.value = getStudent.data;
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
});

const logout = async () => {
  const result = await Swal.fire({
    title: "Do you want to log out?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("studtoken");
    clearStateData();
    router.push("/");
  }
};

const goToAttendanceDetails = () => {
  router.push({ name: "AttendanceDetails" });
};

const showQRCodeAndStartTimer = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/api/student/generateNewToken`,
      {
        oldToken: token.value,
      }
    );

    if (response.data && response.data.newToken) {
      token.value = response.data.newToken;
      qrToken.value = response.data.QrToken // Update token.value
      localStorage.setItem("studtoken", token.value);
      showQrCode.value = true;
      timer.value = 10;

      intervalId.value = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) {
          clearInterval(intervalId.value);
          showQrCode.value = false;
        }
      }, 1000);
    } else {
      console.error("Failed to generate new token");
    }
  } catch (error) {
    console.error("Error generating new token:", error);
  }
};
</script>

<template>
  <div>
    <div class="pos">
      <nav class="navbar navbar-expand bg-light inv">
        <a class="navbar-brand left">ScanMatic</a>
        <div>
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr active" to="/student">
                Qr Code
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr" to="/student/shop">
                Incentives
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr" to="/student/profile">
                Profile
              </RouterLink>
            </li>

            <li class="nav-item">
              <a
                class="nav-link pointer curr"
                to="/"
                style="color: red"
                @click="logout"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>

  <div class="container-fluid col-12 mt-5">
    <button class="attendance-btn" v-if="!showQrCode" @click="showQRCodeAndStartTimer">
      Generate QR Code
    </button>
    <div v-if="showQrCode">
      <div class="bg-white">
        <h1>Student QR Code</h1>
        <qrcode-vue :value="qrToken" :size="size" level="H" />
        <p>
          QR Code will disappear in
          <span style="color: red">{{ timer }} </span> seconds
        </p>
      </div>
    </div>
  </div>

  <div class="student-details">
    <ul class="text mt-2">
      <h2>Student Details</h2>
      <div class="text-start mt-2">
        <li v-if="studentData">
          Name: {{ studentData.first_name }} {{ studentData.middle_name }}
          {{ studentData.last_name }}
        </li>
        <li v-if="studentData">
          Program Level: {{ studentData.courseYearSection }}
        </li>
      </div>
    </ul>

    <button class="attendance-btn" @click="goToAttendanceDetails">
      Check Attendance Details
    </button>
  </div>
</template>

<style scoped>
.attendance-btn {
  background-color: white;
  color: black;
  border-radius: 40px;
  transition: 0.3s;
  border: none;
  padding-top: 13px;
  padding-bottom: 13px;
}
.attendance-btn:hover {
  background-color: gray;
  color: white;
}
.text {
  color: white;
  list-style: none;
}

.bg-white {
  margin: 0;
  background-color: white;
  width: 105%;
}

@media (max-width: 366px) {
  .bg-white {
    background-color: white;
    overflow: visible !important;
    position: fixed !important;
    left: 0 !important;
    width: 100% !important;
  }
  .student-details {
    margin-top: 400px;
  }
}
</style>
