<template>
  <navbar />
  <div
    :style="{
      backgroundColor: '#c7c7c7',
      fontFamily: 'Outfit-Regular',
      minHeight: '100vh',
      overflow: 'visible',
    }"
  >
    <div
      class="container col-12 d-flex flex-column justify-content-center align-items-center"
      style="padding-top: 100px"
    >
      <h1 style="color: black">My Attendance</h1>
      <div
        class="card-col d-flex flex-wrap align-items-center justify-content-start gap-3"
      >
        <div
          class="my-card d-flex align-items-center justify-content-center flex-column shadow-lg"
          v-for="subject in studentSubjectName"
          :key="subject.subject_id"
          @click="
            showSubjectAttendance(subject.subject_id, subject.subject_name)
          "
        >
          <div class="streak d-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              :fill="subjectStreaks[subject.subject_id] === 0 ? 'gray' : 'red'"
              class="bi bi-fire"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"
              />
            </svg>
            <h6
              style="margin-left: 3px; font-size: 30px"
              :style="{
                color:
                  subjectStreaks[subject.subject_id] === 0 ? 'gray' : 'red',
              }"
            >
              {{ subjectStreaks[subject.subject_id] || 0 }}
            </h6>
          </div>

          <h4>{{ subject.subject_name }}</h4>
        </div>
      </div>
      <button class="attendance-btn" @click="goBack">Back</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { baseURL } from "../config";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import navbar from "../components/studentNavBar.vue";

const token = localStorage.getItem("studtoken");

const router = useRouter();
const studentAttendance = ref([]);
const studentClassAndSubject = ref([]);
const studentSubjectName = ref([]);
const subjectStreaks = ref({});

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

    calculateAllSubjectStreaks();
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
});

const calculateAllSubjectStreaks = () => {
  studentSubjectName.value.forEach((subject) => {
    // Get all relevant classes for the subject
    const relevantClasses = studentClassAndSubject.value
      .filter((cls) => cls.subject_id === subject.subject_id)
      .map((cls) => ({
        date: new Date(cls["Class Date"]).toDateString(), // Normalize date format
        isPresent: studentAttendance.value.some(
          (entry) => entry.class_id === cls.class_id
        ),
      }));

    // Remove duplicate dates (keep only the latest attendance status for each day)
    const uniqueAttendance = {};
    relevantClasses.forEach((record) => {
      uniqueAttendance[record.date] = record.isPresent;
    });

    // Convert the object back into an array sorted by date (oldest to newest)
    const attendanceDetails = Object.entries(uniqueAttendance)
      .map(([date, isPresent]) => ({ date: new Date(date), isPresent }))
      .sort((a, b) => a.date - b.date); // Sort ascending (oldest to newest)

    let streak = 0;

    for (const record of attendanceDetails) {
      if (record.isPresent) {
        streak++; // Increase streak if present
      } else {
        streak = 0; // Reset streak if absent
      }
    }

    subjectStreaks.value[subject.subject_id] = streak;
  });
};

const showSubjectAttendance = (subjectID, subjectName) => {
  const relevantClasses = studentClassAndSubject.value.filter(
    (cls) => cls.subject_id === subjectID
  );

  const attendanceDetails = relevantClasses.map((cls) => {
    const attendanceRecord = studentAttendance.value.find(
      (entry) => entry.class_id === cls.class_id
    );

    return {
      date: new Date(cls["Class Date"]),
      formattedDate: new Date(cls["Class Date"]).toLocaleDateString(),
      status: attendanceRecord ? "Present" : "Absent",
      time: attendanceRecord
        ? new Date(attendanceRecord["Time in"]).toLocaleTimeString({
            hour: "2-digit",
            minute: "2-digit",
          })
        : "No Entry",
      isPresent: !!attendanceRecord,
    };
  });

  attendanceDetails.sort((a, b) => a.date - b.date);

  // Calculate the longest streak based on consecutive "Present" days
  let longestStreak = 0;
  let currentStreak = 0;

  attendanceDetails.forEach((detail) => {
    if (detail.isPresent) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0; // Reset streak if absent
    }
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
        <td>${detail.formattedDate}</td>
        <td>${detail.time}</td>
        <td>${detail.status}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
    <button id="download-csv-btn" class="btn btn-primary">Download CSV</button>
    <div><strong>Longest Streak: </strong>${longestStreak} Consecutive Days</div>
  `;

  Swal.fire({
    title: `Attendance for ${subjectName}`,
    html: tableHTML,
    width: "800px",

    didOpen: () => {
      const searchInput = document.getElementById("date-search");
      const tableRows = document.querySelectorAll(".my-table tbody tr");
      const downloadCsvBtn = document.getElementById("download-csv-btn");

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

      downloadCsvBtn.addEventListener("click", () => {
        let csvContent = "Date,Time In,Status\n";

        attendanceDetails.forEach((detail) => {
          csvContent += `${detail.formattedDate},${detail.time},${detail.status}\n`;
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
        link.setAttribute("download", `${subjectName}_attendance.csv`);
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
  height: 100px;
  width: 300px;
  background-color: white;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.3s;
  position: inherit;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
}

.my-card:hover {
  scale: 1.03;
}
.attendance-btn {
  background-color: black;
  color: white;
  border-radius: 40px;
  transition: 0.3s;
  border: none;
  padding-top: 13px;
  padding-bottom: 13px;
  width: 200px;
  border: 2px solid black;
}
.attendance-btn:hover {
  background-color: white;
  color: black;
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
