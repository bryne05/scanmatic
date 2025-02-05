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
            <th scope="col">Attendance Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in masterlist" :key="student.stud_id">
            <td>{{ student.courseYearSection }}</td>
            <td>{{ student.first_name }}</td>
            <td>{{ student.middle_name }}</td>
            <td>{{ student.last_name }}</td>
            <td>
              {{ getAttendanceCount(student.stud_id) }} / {{ numberOfClasses }}
            </td>
            <td>{{ formatDate(getLatestAttendanceDate(student.stud_id)) }}</td>
            <td>
              <button
                class="btn details-btn"
                @click="
                  goToAttendanceDetails(
                    student.stud_id,
                    student.first_name,
                    student.middle_name,
                    student.last_name
                  )
                "
              >
                <img src="../assets/list.png" height="30" alt="list icon" />
              </button>
            </td>
          </tr>
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
import { useShopData } from "../composables/useShopData";
import { useSubjectData } from "../composables/useSubjectData";

const { clearStateDataProfessor } = useShopData();
const { clearStateSubject } = useSubjectData();

const router = useRouter();
const professorToken = localStorage.getItem("proftoken");
const masterlist = ref([]);
const professorParticipants = ref([]);
const props = defineProps(["subjectID", "subjectName"]);
const subjectID = ref(props.subjectID);
const subjectName = ref(props.subjectName);
const numberOfClasses = ref(0); // Initialize to 0

const StudentEntry = ref([]);
const AllSubjectSession = ref([]);

const fetchAllSubjectSession = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/api/professor/getAllSubjectClass`,
      { subject_id: subjectID.value }
    );

    AllSubjectSession.value = response.data.getAllSubjectClass;
  } catch (error) {
    console.error("Error fetching all subject session:", error); // Important: Log the error!
    Swal.fire(
      "Error",
      "An error occurred while fetching all subject session.",
      "error"
    ); // Show error Swal
  }
};
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

    StudentEntry.value = response.data.entry;
    masterlist.value = response.data.masterlist;
    numberOfClasses.value = response.data.numberOfClasses;

    // Aggregate attendance data for efficient lookup
    const aggregatedData = response.data.entry.reduce((acc, current) => {
      const studentId = current.student.stud_id;
      if (!acc[studentId]) {
        acc[studentId] = { attendanceCount: 0, latestAttendedDate: null };
      }
      acc[studentId].attendanceCount++;
      if (
        !acc[studentId].latestAttendedDate ||
        new Date(current.latestAttendedDate) >
          new Date(acc[studentId].latestAttendedDate)
      ) {
        acc[studentId].latestAttendedDate = current.latestAttendedDate;
      }
      return acc;
    }, {});

    professorParticipants.value = aggregatedData;
    await fetchAllSubjectSession();
  } catch (error) {
    console.error("Error fetching student entry:", error);
  }
});

const goToAttendanceDetails = (studentId, firstname, middlename, lastname) => {
  const attendanceDetails = AllSubjectSession.value.map((session) => {
    const attendanceRecord = StudentEntry.value.find(
      (entry) =>
        entry.student.stud_id === studentId &&
        entry.class.class_id === session.class_id
    );

    return {
      date: new Date(session.createdAt).toLocaleDateString(),
      status: attendanceRecord ? "Present" : "Absent",
      time: attendanceRecord
        ? new Date(attendanceRecord.latestAttendedDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "No Entry",
    };
  });

  let tableHTML = `
    <input style="color:black; background-color:white; border: 1px solid gray; width:400px;height:50px; margin-top:5px;" type="text" id="date-search" placeholder="Search by date Ex: m/d/yyyy"/>
    <table class="table my-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time In</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  `;

  attendanceDetails.forEach((detail) => {
    tableHTML += `
      <tr>
        <td>${detail.date}</td>
        <td>${detail.time}</td>
        <td>${detail.status}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  Swal.fire({
    title: `Attendance Details <br> ${firstname} ${middlename} ${lastname}`,
    html: tableHTML,
    width: "800px",

    didOpen: () => {
      // After the Swal is open, add event listener
      const searchInput = document.getElementById("date-search");
      const tableRows = document.querySelectorAll(".my-table tbody tr");

      searchInput.addEventListener("keyup", () => {
        const searchTerm = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {
          const dateCell = row.cells[0].textContent.toLowerCase(); // Get date from the first cell

          if (dateCell.includes(searchTerm)) {
            row.style.display = ""; // Show the row
          } else {
            row.style.display = "none"; // Hide the row
          }
        });
      });
    },
  });

  console.log(
    `Attendance Details for Student ${studentId}:`,
    attendanceDetails
  );
};

const getAttendanceCount = (studentId) => {
  return professorParticipants.value[studentId]?.attendanceCount || 0;
};

const getLatestAttendanceDate = (studentId) => {
  return professorParticipants.value[studentId]?.latestAttendedDate || null;
};

const formatDate = (dateString) => {
  if (!dateString) return "-"; // Handle cases where date is null
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
    clearStateDataProfessor();
    clearStateSubject();
    router.push("/ZXNzb3IiLCJVfrvonD");
  }
};
</script>

<style scoped>
.details-btn {
  border: 2px solid black;
  transition: 0.3s;
}
.details-btn:hover {
  border: 2px solid rgb(2, 255, 2);
  scale: 1.1;
}
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
