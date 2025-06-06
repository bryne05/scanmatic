<template>
  <navbar />
  <div class="bg-2">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>

    <div v-else class="container">
      <div class="row">
        <div
          class="col-12 d-flex justify-content-center align-items-center flex-column"
        >
          <h1 class="mb-2">LEADERBOARD</h1>
          <h5>
            This page displays <b>your current ranking</b> relative to other
            students within your designated academic program.
          </h5>
          <div v-if="leaderboard.length === 0">
            <p class="text-center text-muted">
              Loading leaderboard or no data available...
            </p>
          </div>
          <div v-else class="table-responsive">
            <table
              class="table table-striped table-hover table-bordered shadow"
            >
              <thead class="bg-primary text-white">
                <tr class="text-center">
                  <th scope="col" style="color: white">RANK</th>
                  <th scope="col" style="color: white">STUDENT LIST</th>

                  <th scope="col" style="color: white">RANK POINTS</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student, index) in leaderboard"
                  :key="student.stud_id"
                  :class="{
                    'table-info active-student':
                      student.stud_id === activeStudentId,
                  }"
                  class="leaderboard-row-hover text-center"
                >
                  <td scope="row" class="text-start">
                    {{ index + 1 }}
                    <span
                      v-if="student.stud_id === activeStudentId"
                      class="you-indicator"
                    >
                      &larr; YOU
                    </span>
                  </td>
                  <td>
                    {{ student.first_name }} {{ student.middle_name }}
                    {{ student.last_name }}
                  </td>

                  <td>{{ student.current_level }}00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import navbar from "../components/studentNavBar.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { baseURL } from "../config";
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);

const leaderboard = ref([]);
const activeStudentId = ref(null); // To store the ID of the currently logged-in student

const token = ref(null);
try {
  token.value = localStorage.getItem("studtoken");
} catch (e) {
  console.error("Error accessing localStorage:", e);
  alert(
    "Please disable private browsing mode or allow storage access for this site to log in."
  );
  // Handle redirection or display error to user
}

const getStudentLeaderboard = async () => {
  if (!token.value) {
    console.warn("No student token found. Cannot fetch leaderboard.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await axios.get(
      `${baseURL}/api/student/getStudentLeaderboard`,
      {
        headers: {
          studtoken: `${token.value}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    if (response.status === 200) {
      leaderboard.value = response.data.studentLeaderboard;
      activeStudentId.value = response.data.activeStudent; // Capture the active student ID from the server
      isLoading.value = false;
    }
  } catch (error) {
    isLoading.value = false;
    console.error("Error fetching leaderboards:", error);
    if (error.response) {
      isLoading.value = false;
      console.error(
        "Server responded with:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      isLoading.value = false;
      console.error("No response received:", error.request);
    } else {
      isLoading.value = false;
      console.error("Error setting up request:", error.message);
    }
  }
};

onMounted(async () => {
  await getStudentLeaderboard();
});
</script>

<style scoped>
.container {
  padding-top: 100px;
}

h1 {
  font-family: "Outfit-Bold", sans-serif;
  color: #333;
}

.table-responsive {
  margin-top: 20px;
}

.table-primary {
  background-color: #007bff;
}

.table-info.active-student {
  background-color: #d9edf7 !important;
  border-color: #bce8f1 !important;
  font-weight: bold;
}

td {
  padding: 30px;
}

.leaderboard-row-hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
table {
  width: 60vw;
  overflow: hidden;
}
.table tr td,
.table tr th {
  padding: 13px;
  margin: 0;
}
.table thead tr th {
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
}
.table-responsive {
  min-height: 650px !important;
}
.leaderboard-row-hover:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: relative;
}

.table th {
  background-color: #222831;
}

.you-indicator {
  margin-left: 8px;
  color: #007bff;
  font-weight: bold;
  white-space: nowrap;
}

@media (max-height: 860px) {
  .table-responsive {
    min-height: 450px !important;
  }
}
</style>
