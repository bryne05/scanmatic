<template>
  <navbar />
  <div class="bg-2">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>
    <div
      v-else
      class="container col-12 d-flex flex-column justify-content-center align-items-center"
      style="padding-top: 100px"
    >
      <div class="col-xl-3"></div>
      <div class="col-xl-6 text-center">
        <h1 style="color: black">My Attendance</h1>
        <h5>
          Stay on top of your attendance! This section provides a quick snapshot
          of your attendance for all your subjects. For a complete record,
          simply click on any subject card.
        </h5>
        <h5
          class="d-flex justify-content-around align-items-center align-middle"
        >
          <b>LEGENDS: </b>

          <span class="legends">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              :fill="'red'"
              class="bi bi-fire"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"
              />
            </svg>

            : Streak Count</span
          >

          <span class="legends">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="green"
              class="bi bi-person-fill-check"
              viewBox="0 0 16 16"
            >
              <path
                d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
              />
              <path
                d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
              />
            </svg>
            : Present
          </span>
          <span class="legends">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="red"
              class="bi bi-person-fill-x"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
              />
              <path
                d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708"
              />
            </svg>
            : Absent
          </span>
        </h5>
      </div>
      <div class="col-xl-3"></div>
      <div
        class="card-col d-flex flex-wrap align-items-center justify-content-center gap-3"
      >
        <div
          class="my-card d-flex align-items-center justify-content-center flex-row shadow-lg p-2"
          v-for="subject in studentSubjectName"
          :key="subject.subject_id"
          @click="
            showSubjectAttendance(subject.subject_id, subject.subject_name)
          "
        >
          <div class="col-2">
            <div class="streak d-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                :fill="
                  subjectStreaks[subject.subject_id]?.streak === 0
                    ? 'gray'
                    : 'red'
                "
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
                    subjectStreaks[subject.subject_id]?.streak === 0
                      ? 'gray'
                      : 'red',
                }"
              >
                {{ subjectStreaks[subject.subject_id]?.streak || 0 }}
              </h6>
            </div>
          </div>
          <div class="col-5">
            <h4>{{ subject.subject_name }}</h4>
          </div>
          <div class="col-4">
            <p>
              <span
                class="d-flex justify-content-start align-items-center align-middle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="green"
                  class="bi bi-person-fill-check attendance-icon"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
                  />
                  <path
                    d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
                  />
                </svg>

                {{ subjectStreaks[subject.subject_id]?.presentCount || 0 }}
                {{
                  (subjectStreaks[subject.subject_id]?.presentCount || 0) === 1
                    ? "Class"
                    : "Classes"
                }}
              </span>

              <span
                class="d-flex justify-content-start align-items-center align-middle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="red"
                  class="bi bi-person-fill-x attendance-icon"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
                  />
                  <path
                    d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708"
                  />
                </svg>
                {{ subjectStreaks[subject.subject_id]?.absentCount || 0 }}
                {{
                  (subjectStreaks[subject.subject_id]?.absentCount || 0) ===
                    0 || 1
                    ? "Class"
                    : "Classes"
                }}
              </span>
              Total Class:
              {{ subjectStreaks[subject.subject_id]?.totalClasses || 0 }}
            </p>
          </div>
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
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);
const token = localStorage.getItem("studtoken");

const router = useRouter();
const studentAttendance = ref([]);
const studentClassAndSubject = ref([]);
const studentSubjectName = ref([]);
const subjectStreaks = ref({});

onMounted(async () => {
  isLoading.value = true;
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

    console.log("student attendance", studentAttendance.value);
    console.log("student attendance", getStudentClassAndSubject.data);
    calculateAllSubjectStreaks();
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error("Error fetching student data:", error);
  }
});

const calculateAllSubjectStreaks = () => {
  studentSubjectName.value.forEach((subject) => {
    const relevantClasses = studentClassAndSubject.value
      .filter((cls) => cls.subject_id === subject.subject_id)
      .map((cls) => ({
        date: new Date(cls["Class Date"]).toDateString(),
        isPresent: studentAttendance.value.some(
          (entry) => entry.class_id === cls.class_id
        ),
      }));

    const uniqueAttendance = {};
    relevantClasses.forEach((record) => {
      uniqueAttendance[record.date] = record.isPresent;
    });

    const attendanceDetails = Object.entries(uniqueAttendance)
      .map(([date, isPresent]) => ({ date: new Date(date), isPresent }))
      .sort((a, b) => a.date - b.date);

    let streak = 0;
    let presentCount = 0;
    let absentCount = 0;

    for (const record of attendanceDetails) {
      if (record.isPresent) {
        streak++;
        presentCount++;
      } else {
        streak = 0;
        absentCount++;
      }
    }

    // Calculate total classes
    const totalClasses = presentCount + absentCount;

    // Store streak, presentCount, absentCount, and totalClasses for each subject
    subjectStreaks.value[subject.subject_id] = {
      streak: streak,
      presentCount: presentCount,
      absentCount: absentCount,
      totalClasses: totalClasses, // Add this line
    };
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

  // Initialize counters for present and absent
  let presentCount = 0;
  let absentCount = 0;

  attendanceDetails.forEach((detail) => {
    if (detail.isPresent) {
      currentStreak++;
      presentCount++; // Increment present count
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0; // Reset streak if absent
      absentCount++; // Increment absent count
    }
  });

  // Calculate Total Classes for display in the Swal (optional, but good for completeness)
  const totalClasses = presentCount + absentCount;


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
    <div>
        <strong>Longest Streak: </strong>${longestStreak} Consecutive Days<br>
        <strong>Times Attended: </strong>${presentCount}<br>
        <strong>Times Absent: </strong>${absentCount}<br>
        <strong>Total Classes: </strong>${totalClasses}
    </div>
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
        // Updated CSV header to include summary counts
        let csvContent = "Date,Time In,Status\n";

        // Add the attendance details rows
        attendanceDetails.forEach((detail) => {
          csvContent += `${detail.formattedDate},${detail.time},${detail.status}\n`;
        });

        // Add the summary counts at the end of the CSV
        csvContent += `\n`; // Add a blank line for separation
        csvContent += `Summary:\n`;
        csvContent += `Longest Streak:,${longestStreak} Consecutive Days\n`;
        csvContent += `Times Attended:,${presentCount}\n`; // Include present count
        csvContent += `Times Absent:,${absentCount}\n`;   // Include absent count
        csvContent += `Total Classes:,${totalClasses}\n`; // Include total classes

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
  height: 120px;
  width: 380px;
  background-color: white;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.3s;
  position: inherit;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
}
.my-card h4 {
  text-wrap: nowrap;
  overflow: hidden; /* Hides any content that overflows the element's box */
  text-overflow: ellipsis; /* Displays an ellipsis (...) to indicate truncated text */

  display: block;
}
.my-card:hover {
  scale: 1.03;
}

.legends {
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: center;
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

.attendance-icon {
  width: 30px;
  height: 30px;
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
 
  .my-card{
    width: 380px !important;
  }
}
</style>
