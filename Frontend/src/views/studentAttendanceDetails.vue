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

  <div class="container col-12 mt-5">
    <h1 style="color: white">My Attendance</h1>
    <div
      class="card-col d-flex flex-wrap overflow-auto justify-content-start gap-3"
    >
      <div
        class="my-card d-flex align-items-center justify-content-center"
        v-for="subject in studentSubjectName"
        :key="subject"
        @click="showSubjectAttendance(subject.subject_id, subject.subject_name)"
      >
        <h4>{{ subject.subject_name }}</h4>
      </div>
    </div>
    <button class="attendance-btn" @click="goBack">Back</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { baseURL } from "../config";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

const token = localStorage.getItem("studtoken");

const router = useRouter();
const studentAttendance = ref([]);
const studentClassAndSubject = ref([]);
const studentSubjectName = ref([]);

onMounted(async () => {
  try {
    const getStudentClassAndSubject = await axios.get(
      `${baseURL}/api/student/getStudentClassAndSubject`,
      {
        headers: {
          studtoken: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    studentAttendance.value = getStudentClassAndSubject.data.studentAttendance;
    studentClassAndSubject.value =
      getStudentClassAndSubject.data.studentClassAndSubject;
    studentSubjectName.value =
      getStudentClassAndSubject.data.studentSubjectName;
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
});

const showSubjectAttendance = (subjectID, subjectName) => {
  // Filter classes for the selected subject
  const relevantClasses = studentClassAndSubject.value.filter(
    (cls) => cls.subject_id === subjectID
  );

  const attendanceDetails = relevantClasses.map((cls) => {
    const attendanceRecord = studentAttendance.value.find(
      (entry) => entry.class_id === cls.class_id
    );

    return {
      date: new Date(cls["Class Date"]).toLocaleDateString(),
      status: attendanceRecord ? "Present" : "Absent",
      time: attendanceRecord
        ? new Date(attendanceRecord["Time in"]).toLocaleTimeString({
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
    <button id="download-csv-btn" class="btn btn-primary">Download CSV</button>
  `; // Added Download CSV Button

  Swal.fire({
    title: `Attendance for ${subjectName}`,
    html: tableHTML,
    width: "800px",

    didOpen: () => {
      const searchInput = document.getElementById("date-search");
      const tableRows = document.querySelectorAll(".my-table tbody tr");
      const downloadCsvBtn = document.getElementById("download-csv-btn"); // Get the button

      searchInput.addEventListener("keyup", () => {
        const searchTerm = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {
          const dateCell = row.cells[0].textContent.toLowerCase();

          if (dateCell.includes(searchTerm)) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });
      });

      // Download CSV Button Click Handler
      downloadCsvBtn.addEventListener("click", () => {
        let csvContent = "Date,Time In,Status\n"; // CSV Header

        attendanceDetails.forEach((detail) => {
          csvContent += `${detail.date},${detail.time},${detail.status}\n`;
        });

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: "Downloaded Successfully",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          width: "350px",
          height: "auto",
        });
        link.setAttribute("download", `${subjectName}_attendance.csv`); // Filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
  });

  console.log(
    `Attendance Details for Subject ${subjectName}:`,
    attendanceDetails
  );
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
    localStorage.removeItem("studtoken");
    router.push("/");
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.card-col {
  width: 1000px;
  max-height: 600px;
  padding: 20px;
}

.my-card {
  height: 200px;
  width: 300px;
  background-color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
  position: inherit;
}

.my-card:hover {
  scale: 1.03;
}
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
@media (max-width: 1050px) {
  .card-col {
    width: 650px;
  }
}

@media (max-width: 768px) {
  .card-col {
    width: 330px;
  }
}
</style>
