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
    <h1 class="text-center mb-4">Subject: {{ subjectName }}</h1>

    <div class="container">
      <div
        class="col-12 card-col overflow-auto d-flex align-items-center justify-content-start flex-wrap gap-3"
      >
        <div
          class="my-card d-flex align-items-center justify-content-center"
          v-for="subjectProgramLevel in uniqueProgramLevel"
          :key="subjectProgramLevel"
          @click="openStudentParticipation(subjectProgramLevel)"
        >
          <h2 style="color: black">{{ subjectProgramLevel }}</h2>
        </div>
      </div>
    </div>
  </div>

  <div>
    <Teleport to="body">
      <div v-if="isModalVisible" :class="{ show: isModalVisible }">
        <div class="modal text-center">
          <div class="modal-content d-flex align-items-center justify-content-center flex-column">
            <h2>Attendance Details for <br> {{ fullName }}</h2>

            <!-- Search input for filtering by date -->
            <input
              style="
                color: black;
                background-color: white;
                border: 1px solid gray;
                width: 400px;
                height: 50px;
                margin-top: 5px;
              "
              type="text"
              v-model="searchTerm"
              placeholder="Search by date Ex: m/d/yyyy"
            />

            <!-- Table displaying the attendance details -->
            <table class="table my-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time In</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(detail, index) in filteredAttendanceDetails"
                  :key="index"
                >
                  <td>{{ detail.date }}</td>
                  <td>{{ detail.time }}</td>
                  <td>{{ detail.status }}</td>
                </tr>
              </tbody>
            </table>

            <button @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup>
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useShopData } from "../composables/useShopData";
import { useSubjectData } from "../composables/useSubjectData";
const isModalVisible = ref(false);

const closeModal = () => {
  isModalVisible.value = false;
};
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

const uniqueProgramLevel = ref([]);
const StudentEntry = ref([]);
const AllSubjectSession = ref([]);
const searchTerm = ref("");
const fullentrydata = ref([]);
let fullName = ref("");
let attendanceDetails = ref([]);
const courseYearSectionCount = ref([]);

const openStudentParticipation = (programLevel) => {
  // Filter the masterlist based on the selected programLevel

  console.log(programLevel);
  const filteredProgram = fullentrydata.value?.masterlist?.find(
    (item) => item.courseYearSection === programLevel
  );
  const filteredEntries = StudentEntry.value.filter(
    (entry) => entry.student.courseYearSection === programLevel
  );

  // Count the number of unique classes attended by students for the selected program level
  const classCount = new Set(
    filteredEntries.map((entry) => entry.class.class_id)
  ).size;

  console.log("studentParticipation", filteredProgram);
  // Check if there are students in the filtered program
  if (!filteredProgram || !filteredProgram.students.length) {
    Swal.fire(
      "No data available",
      "There are no students for this class.",
      "info"
    );
    return;
  }

  let tableHTML = `
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Program Level</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>No. of times attended</th>
            <th>Latest attended Date</th>
            <th>Attendance Details</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Loop through the students in the filtered program
  filteredProgram.students.forEach((student) => {
    // Get the attendance details for the student (you may need to match it with attendance data)
    const studentAttendance = fullentrydata.value.entry.filter(
      (entry) => entry.student.stud_id === student.stud_id
    );

    // Calculate attendance count (if the student attended any classes)
    const attendanceCount = studentAttendance.length;
    const latestAttendedDate =
      attendanceCount > 0
        ? new Date(studentAttendance[0].latestAttendedDate).toLocaleDateString()
        : "No Attendance";

    tableHTML += `
      <tr>
        <td>${programLevel}</td>
        <td>${student.first_name || "-"}</td>
        <td>${student.middle_name || "-"}</td>
        <td>${student.last_name || "-"}</td>
        <td>${attendanceCount} / ${classCount}</td>
        <td>${latestAttendedDate}</td>
        <td>
          <button class="btn btn-primary details-btn pl-4 pr-4" data-id="${student.stud_id}">
            View 
          </button>
        </td>
      </tr>
    `;
  });

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  // Show the table in a SweetAlert modal
  Swal.fire({
    title: `Student List for ${programLevel}`,
    html: tableHTML,
    width: "1400px",
    allowOutsideClick: false, // Prevent closing by clicking outside
    allowEscapeKey: false, // Prevent closing by pressing Esc key
    confirmButtonText: "OK",
    didOpen: () => {
      // After the Swal is open, attach event listener to the button
      const detailButtons = document.querySelectorAll(".details-btn");
      detailButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const studentId = button.getAttribute("data-id");
          const student = filteredProgram.students.find(
            (student) => student.stud_id == studentId
          );
          showModal(
            student.stud_id,
            student.first_name,
            student.middle_name,
            student.last_name,
            student.courseYearSection
          );
        });
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Handle OK button click (e.g., you might not need to do anything here if you just want to prevent closing)
      console.log("OK clicked");
    }
  });
};

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
    );
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
    uniqueProgramLevel.value = response.data.uniqueCourseYearSections;
    numberOfClasses.value = response.data.numberOfClasses;
    fullentrydata.value = response.data;
    console.log("Student Entry", response.data);
    console.log("Student Entry.value", StudentEntry.value);

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
  attendanceDetails = AllSubjectSession.value.map((session) => {
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

// Show the modal and initialize any data or state when opened

const showModal = (
  studentId,
  firstname,
  middlename,
  lastname,
  courseYearSection
) => {
  // Prepare student information and full name
  console.log("Student Info:", studentId, firstname, middlename, lastname);
  fullName.value = `${firstname} ${middlename} ${lastname}`;

  // Log all subject sessions available
  console.log("All subject sessions:", AllSubjectSession.value);

  // Helper function to check if a student is enrolled in a session
  const getEnrolledStudentsInSession = (sessionId) => {
    return StudentEntry.value.filter(
      (entry) => entry.class.class_id === sessionId
    );
  };

  // Filter sessions that have enrolled students and match the student's courseYearSection
  const filteredSessions = AllSubjectSession.value.filter((session) => {
    console.log(
      `Filtering session ${session.class_courseYearSection} for ${courseYearSection}`
    );

    const enrolledStudents = getEnrolledStudentsInSession(session.class_id);

    // Only include the session if it matches the student's courseYearSection
    // or it's an open session (class_courseYearSection is empty)
    const isValidSession =
      session.class_courseYearSection === courseYearSection ||
      session.class_courseYearSection.trim() === "";

    return enrolledStudents.length > 0 && isValidSession;
  });

  console.log(
    "Filtered Sessions (with matching courseYearSection or open sessions):",
    filteredSessions
  );

  // Handle open sessions (sessions with empty courseYearSection)
  const openSessions = AllSubjectSession.value.filter(
    (session) => session.class_courseYearSection.trim() === ""
  );

  // Add open sessions to the filtered sessions list
  openSessions.forEach((session) => {
    const studentsInOpenSession = getEnrolledStudentsInSession(
      session.class_id
    );

    studentsInOpenSession.forEach((studentEntry) => {
      // Only include this session if the student is enrolled and it is an open session
      if (studentEntry.student.courseYearSection === courseYearSection) {
        filteredSessions.push({
          ...session,
          class_courseYearSection: studentEntry.student.courseYearSection, // Assign courseYearSection for open session
        });
      }
    });
  });

  console.log(
    "Updated Filtered Sessions (including open sessions):",
    filteredSessions
  );

  // Remove duplicate sessions based on class_id
  const uniqueSessions = Array.from(
    new Map(
      filteredSessions.map((session) => [session.class_id, session])
    ).values()
  );

  // Helper function to get attendance for a student in a specific session
  const getAttendanceForSession = (sessionId) => {
    const attendanceRecord = StudentEntry.value.find(
      (entry) =>
        entry.student.stud_id === studentId &&
        entry.class.class_id === sessionId
    );

    return attendanceRecord
      ? {
          status: "Present",
          time: new Date(
            attendanceRecord.latestAttendedDate
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      : {
          status: "Absent",
          time: "No Entry",
        };
  };

  // Populate attendance details for the student in the filtered sessions
  attendanceDetails.value = uniqueSessions
    .map((session) => {
      const attendance = getAttendanceForSession(session.class_id);

      // Only include the session in attendance details if the session courseYearSection matches the student's courseYearSection
      if (session.class_courseYearSection === courseYearSection) {
        return {
          class_id: session.class_id, // Class ID
          date: new Date(session.createdAt).toLocaleDateString(), // Session date
          status: attendance.status, // Attendance status
          time: attendance.time, // Attendance time or "No Entry"
        };
      }

      return null; // Do not include session if class_courseYearSection does not match the student's courseYearSection
    })
    .filter(Boolean); // Remove null values

  console.log("Attendance Details:", attendanceDetails.value);

  // Show the modal
  isModalVisible.value = true;
};

// Filter attendance details based on search term (date)
const filteredAttendanceDetails = computed(() => {
  return attendanceDetails.value.filter((detail) =>
    detail.date.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

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
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100 !important;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 800px;
  width: 100%;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}
.col-12 {
  width: auto;
}
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
@media (max-width: 1050px) {
  .container-1 {
    margin-left: 50px;
  }
  .card-col {
    width: 650px;
  }
}
@media (max-width: 768px) {
  .card-col {
    width: 330px;
  }
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
