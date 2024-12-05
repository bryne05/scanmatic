<template>
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

  <div class="text">
    <div class="table-responsive">
      <h1 class="text-center mb-4">Subject: {{ subjectName }}</h1>
      <table class="table">
        <thead>
          <tr class="tr">
            <th scope="col">Program Level</th>
            <th scope="col">First Name</th>
            <th scope="col">Middle Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">No. of times attended</th>
            <th scope="col">Latest attended Date</th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="participantSet in professorParticipants"
            :key="participantSet.latestAttendedDate"
          >
            <tr v-if="participantSet">
              <td>{{ participantSet.class.class_courseYearSection }}</td>
              <td>{{ participantSet.student.first_name }}</td>
              <td>{{ participantSet.student.middle_name }}</td>
              <td>{{ participantSet.student.last_name }}</td>
              <td>
                {{ participantSet.attendanceCount }} / {{ numberOfClasses }}
              </td>
              <td>{{ formatDate(participantSet.latestAttendedDate) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const professorToken = localStorage.getItem("proftoken");
const professorParticipants = ref([]);
const props = defineProps(["subjectID", "subjectName"]);
const subjectID = ref(props.subjectID);
const subjectName = ref(props.subjectName);
const numberOfClasses = ref();

onMounted(async () => {
  try {
    const response = await axios.get(
      `${baseURL}/api/professor/getStudentEntry/${subjectID.value}`,
      {
        headers: {
          proftoken: professorToken,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    professorParticipants.value = response.data.entry;
    numberOfClasses.value = response.data.numberOfClasses;
    console.log("HEYYY", response.data.numberOfClasses);
    console.log(professorParticipants.value);
  } catch (error) {
    console.error("Error fetching professor transactions:", error);
  }
});

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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
</script>

<style scoped>
.text {
  max-width: fit-content;
  max-height: 650px;
  overflow-y: auto;
  margin-top: 50px;
  color: white;
}
.tr {
  position: relative;
}

@media (max-width: 550px) {
  .text {
    max-width: 270px;
    overflow-x: auto;
  }
}

@media (max-height: 720px) {
  .text {
    max-height: 550px;
  }
}
</style>
