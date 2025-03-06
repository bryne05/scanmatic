<template>
  <div>
    <div class="pos">
      <nav class="navbar navbar-expand bg-light inv">
        <a class="navbar-brand left">ScanMatic</a>
        <div>
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr active" to="/professor">
                Class
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr" to="/professor/shop">
                Incentives
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr" to="/professor/profile">
                Profile
              </RouterLink>
            </li>
   <li class="nav-item">
              <RouterLink class="nav-link pointer curr" to="/professor/event">
                Events
              </RouterLink>
            </li>
            <li class="nav-item">
              <a
                class="nav-link pointer curr"
                to="/ZXNzb3IiLCJVfrvonD"
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

  <div class="mt-2 text">
    <h2 class="text">Recycle Bin</h2>
    <!-- <h3 class="text-start">Subject: {{ subjectName }}</h3> -->
    <div>
      <div
        class="row scroll-container"
        :style="{ width: professorSession.length <= 2 ? '80vw' : 'auto' }"
      >
        <div
          class="col-md-4 col-sm-6 mt-3"
          v-for="session in professorSession"
          :key="session.class_id"
        >
          <div class="card h-100 card-color">
            <div class="card-body">
              <button
                class="btn btn-dark mar w-100 mb-3"
                @click="enterQR(session)"
              >
                Enter
              </button>
              <h4 class="card-title mb-3">
                {{ session.createdAt }}
              </h4>
              <!-- <h6>
                Start Time: {{ formatTime(session.start_time) }} &ensp; End
                Time: {{ formatTime(session.end_time) }}
              </h6> -->
              <p class="card-text">
                <!-- Program Level: {{ session.class_courseYearSection }} <br /> -->
                Point Value:{{ session.clas_token }}<br />
                Exp: {{ session.class_exp }} <br />
              </p>
              <button
                class="btn btn-success mar"
                data-bs-toggle="modal"
                data-bs-target="#updateSession"
                @click="restoreClass(session)"
              >
                Restore
              </button>
              <button
                class="btn btn-danger mar"
                @click="deleteRecycleSession(session)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <button class="btnsyle mb-3" @click="goBack">Back</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";

const router = useRouter();
const props = defineProps(["subjectID", "subjectName"]);
const subjectID = ref(props.subjectID);
const subjectName = ref(props.subjectName);

const proftoken = localStorage.getItem("proftoken");
const professorSession = ref([]);

function formatTime(timeString) {
  if (!timeString) return ""; // Handle null or undefined

  const [hours, minutes, seconds] = timeString.split(":");
  let formattedHours = parseInt(hours, 10);
  const amPm = formattedHours >= 12 ? "PM" : "AM";

  formattedHours = formattedHours % 12 || 12; // Convert to 12-hour format (0 becomes 12)

  return `${formattedHours}:${minutes} ${amPm}`;
}

const fetchSessions = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/api/professor/getClassDeleted/${props.subjectID}`,
      {
        headers: {
          proftoken: proftoken,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    professorSession.value = response.data.classes;
    console.log(professorSession.value);
  } catch (error) {
    console.error("Error getting sessions:", error);
    Swal.fire("Error", "Failed to fetch sessions", "error");
  }
};

const restoreClass = async (session) => {
  const currentSessionID = session.class_id;
  const confirmationResult = await Swal.fire({
    title: "Update Session",
    text: "Are you sure you want to restore this classs? ",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    try {
      const response = await axios.put(
        `${baseURL}/api/professor/deleteClassRestore/${subjectID.value}/${currentSessionID}`,
        {},

        {
          headers: {
            proftoken: proftoken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Class Data Restored successfully",
          icon: "success",
        });

        await fetchSessions();
      } else {
        console.error("Failed to update Sessions:", response.statusText);
        Swal.fire({
          title: "Error",
          text: `"Failed to update Sessions"`,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating Sessions:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating Sessions",
        icon: "error",
      });
    }
  }
};

const deleteRecycleSession = async (session) => {
  const currentSessionID = session.class_id;
  const confirmationResult = await Swal.fire({
    title: "Delete Session",
    html: `Are you sure you want to <span style="color: red; font-weight: bold;">PERMANENTLY DELETE</span> this class?`,
    icon: "warning",
    confirmButtonColor: "#d33",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmationResult.isConfirmed) {
    try {
      const response = await axios.delete(
        `${baseURL}/api/professor/deleteClassPerma/${subjectID.value}/${currentSessionID}`,
        {
          headers: {
            proftoken: proftoken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Class Data Deleted successfully",
          icon: "success",
        });

        await fetchSessions();
      } else {
        console.error("Failed to update Sessions:", response.statusText);
        Swal.fire({
          title: "Error",
          text: `"Failed to update Sessions"`,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating Sessions:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating Sessions",
        icon: "error",
      });
    }
  }
};
onMounted(() => {
  fetchSessions();
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
    localStorage.removeItem("proftoken");
    router.push("/ZXNzb3IiLCJVfrvonD");
  }
};

const enterQR = (session) => {
  router.push({
    name: "QrScanner",
    params: {
      subjectID: subjectID.value,
      sessionID: session.class_id,
    },
  });
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.card-color {
  background-color: lightcyan;
}
body {
  margin: 0;
  padding: 0;
}

.scroll-container {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}

.btnsyle {
  background-color: white;
  color: black;
  width: 335px;
  height: 44px;
  border-radius: 30px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: gray;
  color: white;
  border-color: white;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
}

@media (max-height: 800px) {
  .scroll-container {
    max-height: 400px;
  }
}
</style>
