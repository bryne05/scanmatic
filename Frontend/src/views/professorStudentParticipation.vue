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
    <div v-if="isLoading" class="loading-overlay">
      <moon-loader :loading="isLoading" color="white" size="150px" />
    </div>
    <div v-else class="container pad">
      <div class="row d-flex flex-column">
        <div class="col-12">
          <div class="text-center" style="font-family: Outfit-bold">
            <h1>STUDENT OVERVIEW PARTICIPATION</h1>
          </div>
          <p class="text-center" style="font-size: 18px">
            This section lists the
            <i>
              <b>{{ subjectProgramLevel }} </b>
            </i>
            students and their participation in
            <i>
              <b>{{ subjectName }} </b> </i
            >. <br />
            Hover over student's name, then click to view their detailed
            individual participation.
          </p>
          <h1></h1>
        </div>

        <div class="col-12 pt-4">
          <div class="table-responsive tt">
            <table class="table table-bordered text-center">
              <thead>
                <tr>
                  <th v-if="uniqueSessions.length > 0">Master List</th>

                  <th v-else>
                    This subject does not have any classes available at the
                    moment.
                  </th>
                  <th v-for="session in uniqueSessions" :key="session.class_id">
                    {{ formatDate(session.createdAt) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="student in masterlistStudents"
                  :key="student.stud_id"
                >
                  <td>
                    <div
                      class="ALINK"
                      @click="
                        showModal(
                          student.stud_id,
                          student.first_name,
                          student.middle_name,
                          student.last_name,
                          student.courseYearSection
                        )
                      "
                    >
                      {{ student.first_name }} {{ student.middle_name }}
                      {{ student.last_name }}
                    </div>
                  </td>
                  <td
                    v-for="session in uniqueSessions"
                    :key="session.class_id"
                    class="attendance-cell"
                  >
                    <div
                      class="attendance-grid-wrapper d-flex justify-content-center align-items-center"
                    >
                      <div
                        class="attendance-box"
                        :class="{
                          'bg-success': isStudentPresent(
                            student.stud_id,
                            session.class_id
                          ),
                          'bg-danger': !isStudentPresent(
                            student.stud_id,
                            session.class_id
                          ),
                        }"
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="col-12 pt-3 d-flex justify-content-center align-items-center gap-3"
        >
          <button class="btnsyle" @click="goBack">Back</button>
          <button class="btnsyle" @click="downloadCSV">Download CSV</button>
        </div>
      </div>
    </div>
  </div>

  <div>
    <Teleport to="body">
      <div v-if="isModalVisible" :class="{ show: isModalVisible }">
        <div class="modal text-center">
          <div
            class="modal-content d-flex align-items-center justify-content-center flex-column"
          >
            <h2>
              Attendance Details for <br />
              {{ fullName }}
            </h2>

            <input
              type="text"
              v-model="dateSearchTerm"
              placeholder="Search by date Ex: m/d/yyyy"
              style="
                color: black;
                background-color: white;
                border: 1px solid gray;
                width: 400px;
                height: 50px;
                margin-top: 5px;
                margin-bottom: 5px;
              "
            />

            <div class="d-flex justify-content-center mb-2">
              <label
                v-for="status in ['All', 'Present', 'Absent']"
                :key="status"
                class="me-3 radio-label"
                :class="{
                  active:
                    statusFilter === status ||
                    (status === 'All' && statusFilter === ''),
                }"
              >
                <input
                  type="radio"
                  :value="status === 'All' ? '' : status"
                  v-model="statusFilter"
                  class="me-1 hidden-radio"
                />
                <span
                  class="custom-radio"
                  :class="{
                    active:
                      statusFilter === status ||
                      (status === 'All' && statusFilter === ''),
                  }"
                ></span>
                {{ status }}
              </label>
            </div>

            <table class="table my-table" style="height: 100px !important">
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

            <button class="btnsyle" @click="closeModal">Close</button>
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
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(true);
import navbar from "../components/professorNavBar.vue";
const isModalVisible = ref(false);
const statusFilter = ref("");
const closeModal = () => {
  isModalVisible.value = false;
  dateSearchTerm.value = "";
  statusFilter.value = "";
};
const { clearStateDataProfessor } = useShopData();
const { clearStateSubject } = useSubjectData();

const router = useRouter();
const professorToken = localStorage.getItem("proftoken");
const masterlist = ref([]);
const professorParticipants = ref([]);
const props = defineProps(["subjectID", "subjectName", "subjectProgramLevel"]);
const subjectID = ref(props.subjectID);
const subjectName = ref(props.subjectName);
const subjectProgramLevel = ref(props.subjectProgramLevel);
const numberOfClasses = ref(0); // Initialize to 0

const uniqueProgramLevel = ref([]);
const StudentEntry = ref([]);
const AllSubjectSession = ref([]);
const searchTerm = ref("");
const dateSearchTerm = ref("");
const fullentrydata = ref([]);
let fullName = ref("");
let attendanceDetails = ref([]);
const courseYearSectionCount = ref([]);

const downloadCSV = () => {
  if (!masterlistStudents.value || masterlistStudents.value.length === 0) {
    Swal.fire(
      "No data to download",
      "Please ensure there is data to download.",
      "info"
    );
    return;
  }

  let csvContent = "Student Name,";
  const dates = uniqueSessions.value.map((session) =>
    formatDate(session.createdAt)
  );
  csvContent += dates.join(",") + "\n";

  masterlistStudents.value.forEach((student) => {
    let row = `${student.first_name} ${student.middle_name} ${student.last_name},`;
    uniqueSessions.value.forEach((session) => {
      row += isStudentPresent(student.stud_id, session.class_id)
        ? "Present,"
        : "Absent,";
    });
    csvContent += row + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `attendance_${subjectName.value.replace(/\s+/g, "_")}.csv`
  );
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
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const goBack = () => {
  router.go(-1);
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
const masterlistStudents = computed(() => {
  if (
    fullentrydata.value.masterlist &&
    fullentrydata.value.masterlist.length > 0
  ) {
    return fullentrydata.value.masterlist[0].students;
  }
  return [];
});

const uniqueSessions = computed(() => {
  if (AllSubjectSession.value) {
    return AllSubjectSession.value
      .filter(
        (session, index, self) =>
          self.findIndex((s) => s.class_id === session.class_id) === index
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sorting from newest to oldest
  }
  return [];
});

const isStudentPresent = (studentId, classId) => {
  return StudentEntry.value.some(
    (entry) =>
      entry.student.stud_id === studentId && entry.class.class_id === classId
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

onMounted(async () => {
  isLoading.value = true;
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
    fullentrydata.value = response.data;
    await fetchAllSubjectSession();
  } catch (error) {
    console.error("Error fetching student entry:", error);
  } finally {
    isLoading.value = false;
  }
});

const showModal = (
  studentId,
  firstname,
  middlename,
  lastname,
  courseYearSection
) => {
  console.log("Student Info:", studentId, firstname, middlename, lastname);
  fullName.value = `${firstname} ${middlename} ${lastname}`;

  console.log("All subject sessions:", AllSubjectSession.value);

  const getEnrolledStudentsInSession = (sessionId) => {
    return StudentEntry.value.filter(
      (entry) => entry.class.class_id === sessionId
    );
  };

  const filteredSessions = AllSubjectSession.value.filter((session) => {
    console.log(
      `Filtering session ${session.class_courseYearSection} for ${courseYearSection}`
    );

    const enrolledStudents = getEnrolledStudentsInSession(session.class_id);

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
  return attendanceDetails.value.filter((detail) => {
    const dateMatch = detail.date
      .toLowerCase()
      .includes(dateSearchTerm.value.toLowerCase());
    const statusMatch =
      statusFilter.value === "" || detail.status === statusFilter.value;
    return dateMatch && statusMatch;
  });
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
    clearStateDataProfessor();
    clearStateSubject();
    router.push("/ZXNzb3IiLCJVfrvonD");
  }
};
</script>

<style scoped>
.pad {
  padding-top: 110px;
}
.btnsyle {
  background-color: black;
  color: white;
  width: 300px;
  height: 44px;
  border: black 1px solid;
  border-radius: 30px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: white;
  color: black;
}

.loading-overlay {
  position: fixed; /* Important: Stays in the viewport */
  top: 0;
  left: 0;
  width: 100%; /* Covers the entire width */
  height: 100%; /* Covers the entire height */
  background-color: rgba(
    0,
    0,
    0,
    0.5
  ); /* Semi-transparent background to dim the content */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centers content vertically */
  align-items: center; /* Centers content horizontally */
  z-index: 1000; /* Ensures it's on top of other elements */
}

.loading-text {
  color: white;
  font-size: 1.2em;
  margin-top: 20px;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
}

.tt {
  background-color: white;
  padding: 15px 15px 0px 15px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;
}
.ALINK {
  text-decoration: none;
  color: black;
  cursor: pointer;
  display: flex;
  transition: 0.2s;
}

.ALINK:hover {
  transform: scale(1.03);
  font-weight: 700;
}
table.table-bordered th {
  padding: 10px;
}
table.table-bordered {
  background-color: white;
}
table.table-bordered th:first-child,
table.table-bordered td:first-child {
  position: sticky;
  left: 0;
  background-color: white;
  z-index: 1;
}
.bg-success,
.bg-danger {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 5px; /* Add some spacing */
  border-radius: 5px;
}
.radio-label {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.hidden-radio {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ccc;
  margin-right: 5px;
  transition: border-color 0.3s, background-color 0.3s;
  background-color: transparent;
}

.custom-radio.active {
  border-color: blue;
  background-color: blue;
}

.radio-label {
  color: #333;
  transition: color 0.3s;
}

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
