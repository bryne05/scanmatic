<!-- HelloWorld.vue -->
<template>
  <navbar />

  <div class="bg">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>

    <div v-else class="container-fluid">
      <div class="row">
        <div
          class="qr-loading d-flex justify-content-center align-items-center flex-column"
          v-if="qrloading"
        >
          <img src="../assets/qr-code.gif" alt="qr code scanner gif" />
          <h3>Processing QR code...</h3>
        </div>

        <div class="desc d-flex flex-wrap" v-else>
          <div class="col-12 text-center">
            <h1 style="font-family: Outfit-bold; letter-spacing: 1px">
              Attendance for {{ dateCreated }}
            </h1>
          </div>
          <div
            class="col-xl-4 col-lg-12 col-12 d-flex flex-column justify-content-center align-items-center"
            v-if="isWithinTimeRange"
          >
            <h2>SCANNING QR CODE</h2>
            <div class="size">
              <qrcode-stream
                @error="onError"
                @detect="onDetect"
                :constraints="cameraConstraints"
                ref="qrcodeStream"
                :disabled="!isWithinTimeRange || qrloading"
              ></qrcode-stream>
            </div>
          </div>
          <div
            class="col-xl-4 col-lg-12 col-12 d-flex flex-column justify-content-center align-items-center"
            v-if="isWithinTimeRange"
          >
            <div>
              <div
                v-if="attendance.length > 0"
                class="d-flex justify-content-center align-items-center flex-column"
              >
                <h2>WELCOME!</h2>

                <div class="cont">
                  <img :src="imageSrc || defaultimage" alt="" />
                </div>

                <h2 v-if="lastStudent">
                  {{ lastStudent.student.first_name }}
                  {{ lastStudent.student.middle_name }}
                  {{ lastStudent.student.last_name }}
                </h2>
              </div>

              <div class="alt-welcome text-center" v-else>
                <h2>AWAITING STUDENT QR CODE</h2>
                <img src="../assets/qr-code.png" alt="" />
              </div>
            </div>
          </div>

          <div v-else>
            <br />
            <br />
          </div>
          <div
            class="col-xl-4 col-lg-12 col-12 d-flex justify-content-start flex-column"
          >
            <h2 class="text-center">PRESENT STUDENTS</h2>
            <ol class="text-start">
              <li
                v-if="attendance.length > 0"
                v-for="student in attendance"
                :key="student.attendance_id"
              >
                {{ student.student.first_name }}
                {{ student.student.middle_name }}
                {{ student.student.last_name }}
              </li>
              <div v-else>
                <p>No students in the attendance list yet.</p>
              </div>
            </ol>
          </div>

          <div
            class="col-12 d-flex align-item-center justify-content-center pt-5"
          >
            <button class="btnsyle mb-3" @click="goBack">Back</button>
            <button class="btnsyle mb-3" @click="generateCSV">
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, onMounted, computed } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";
import { baseURL } from "../config";
import axios from "axios";
import Swal from "sweetalert2";
import Papa from "papaparse";
import { useRouter } from "vue-router";
import navbar from "../components/professorNavBar.vue";
import { MoonLoader } from "vue3-spinner";

const router = useRouter();
const props = defineProps(["subjectID", "sessionID", "programlevel"]);
const subjectID = ref(props.subjectID);
const sessionID = ref(props.sessionID);
const programlevel = ref(props.programlevel); // This prop might be less relevant for fetching all master lists now
const rawValue = ref("");
const proftoken = localStorage.getItem("proftoken");

const isLoading = ref(null);
const singleClass = ref([]);
const attendance = ref([]);
const error = ref("");
const cameraConstraints = ref({ facingMode: "environment" }); // Set initial constraints

const qrloading = ref(null);
const studentsByProgram = ref([]); // This will now accumulate students from all relevant programs
import defaultimage from "../assets/profile-user.png";
const imageSrc = ref(null);

const startTime = ref(null);
const endTime = ref(null);
const dateCreated = ref(null);
const isWithinTimeRange = ref(false);

const setdefaultimage = () => {
  imageSrc.value = defaultimage;
};

const lastStudent = computed(() => {
  if (attendance.value.length > 0) {
    return attendance.value.at(-1);
  }
  return null; // Return null if the list is empty
});

const ws = new WebSocket("ws://localhost:6543");

ws.onopen = () => {
  console.log("WebSocket connected!");
  ws.send(JSON.stringify({ type: "scanner" }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received WebSocket message:", data);

  if (data.success) {
    Swal.fire({
      title: "Student Attendance Recorded",
      text: "Attendance has been successfully marked!",
      icon: "success",
    });
  }
};

ws.onerror = (error) => {
  console.error("WebSocket Error:", error);
};

ws.onclose = () => {
  console.log("WebSocket connection closed.");
};

const onDetect = async (result) => {
  try {
    qrloading.value = true;

    console.log("qr load change to true", qrloading.value);
    if (result && result.length > 0 && result[0].rawValue) {
      rawValue.value = result[0].rawValue;
      console.log("qrcode:", rawValue.value);
      console.log("subjectID:", subjectID.value);

      const response = await axios.post(
        `${baseURL}/api/professor/createAttendance/${sessionID.value}`,
        null,
        {
          headers: {
            studtoken: rawValue.value,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (response.status === 200) {
        ws.send(
          JSON.stringify({
            qrCode: rawValue.value,
            subject_id: subjectID.value,
          })
        );
        await fetchImage(rawValue.value);

        const getAttend = await axios.get(
          `${baseURL}/api/professor/getAttendance/${sessionID.value}`,
          {
            headers: {
              proftoken: proftoken,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        attendance.value = getAttend.data.attend;

        // After updating attendance, re-fetch master lists
        await fetchAllMasterListsBasedOnAttendance();

        setTimeout(() => {
          qrloading.value = false; // Hide loading after 3 seconds
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Student marked as present.",
            showConfirmButton: false,
            timer: 1500,
            width: "550px",
            height: "auto",
          });
        }, 3000);

        console.log(attendance.value);
      } else if (response.status === 400) {
        isLoading.value = false; // Note: Corrected to isLoading.value
        console.log("create attendance response", response);
        console.log("mais");
      }
    } else {
      isLoading.value = false; // Note: Corrected to isLoading.value
      Swal.fire("Error", "An error occurred", "error");
      // console.log("create attendance response", response); // 'response' is not defined in this block
      return;
    }
  } catch (error) {
    qrloading.value = false;
    if (error.response) {
      const errorMessage = error.response.data.message;

      console.error("Backend Error:", errorMessage);

      if (errorMessage === "Student Already In class") {
        Swal.fire({
          icon: "info",
          title: "Already Present",
          text: "This student is already recorded for this session.",
        });
      } else {
        Swal.fire(
          "Error",
          errorMessage || "An unexpected server error occurred.",
          "error"
        );
      }
    } else if (error.request) {
      console.error("Network Error:", error.message);
      Swal.fire(
        "Error",
        "Network error. Please check your internet connection.",
        "error"
      );
    } else {
      console.error("Axios Setup Error:", error.message);
      Swal.fire("Error", "An error occurred during request setup.", "error");
    }
  }
};

// Modified fetchMasterList to accept a programLevel
const fetchMasterList = async (programLevelToFetch) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/admin/getClassStudentByProgram`,
      { courseYearSection: programLevelToFetch }
    );
    // console.log(`Fetched master list for ${programLevelToFetch}:`, response.data.students);
    return response.data.students; // Return the fetched students
  } catch (error) {
    console.error(
      `Error fetching MasterList for ${programLevelToFetch}:`,
      error
    );
    // Do not show Swal here directly, let the calling function handle aggregated errors
    return []; // Return an empty array on error
  }
};

// New function to fetch all master lists based on current attendance
const fetchAllMasterListsBasedOnAttendance = async () => {
  const uniqueProgramLevels = new Set();
  attendance.value.forEach((attendant) => {
    if (attendant.student?.courseYearSection) {
      uniqueProgramLevels.add(attendant.student.courseYearSection);
    }
  });

  // Also include the programLevel prop in case no students are yet present
  if (programlevel.value) {
    uniqueProgramLevels.add(programlevel.value);
  }

  console.log(
    "Unique Program Levels found in attendance:",
    Array.from(uniqueProgramLevels)
  );

  const allStudents = [];
  for (const pLevel of uniqueProgramLevels) {
    const students = await fetchMasterList(pLevel);
    if (Array.isArray(students)) {
      allStudents.push(...students);
    }
  }
  // Clear and then assign the combined list
  studentsByProgram.value = allStudents;
  console.log(
    "Combined studentsByProgram.value after fetching all master lists:",
    studentsByProgram.value
  );
};

const fetchImage = async (qr) => {
  try {
    const response = await axios.get(
      `${baseURL}/api/student/studentImgRetrieve`,
      {
        headers: {
          studtoken: qr,
        },
        responseType: "blob", //response type to 'blob' for binary data
      }
    );

    // Check if the response is successful
    if (response.status === 200) {
      // Create an object URL from the Blob data and assign it to imageSrc
      const imageURL = URL.createObjectURL(response.data);
      imageSrc.value = imageURL; // Use object URL for the image source
    } else {
      setdefaultimage();
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    setdefaultimage();
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const getAttend = await axios.get(
      `${baseURL}/api/professor/getAttendance/${sessionID.value}`,
      {
        headers: {
          proftoken: proftoken,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    attendance.value = getAttend.data.attend;

    const singleClassResponse = await axios.get(
      `${baseURL}/api/professor/getSingleClass/${subjectID.value}/${sessionID.value}`,
      {
        headers: {
          proftoken: proftoken,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    singleClass.value = singleClassResponse.data.classes;
    startTime.value = singleClass.value[0]?.start_time;
    endTime.value = singleClass.value[0]?.end_time;
    dateCreated.value = singleClass.value[0]?.createdAt;

    const now = new Date();
    checkTimeRange();

    // Call the new function to fetch master lists for all relevant programs
    await fetchAllMasterListsBasedOnAttendance();

    isLoading.value = false;
    console.log("attendance:", attendance.value);
    console.log("Masterlist (studentsByProgram):", studentsByProgram.value); // This will now be combined
    console.log("program level prop value:", programlevel.value);
  } catch (error) {
    console.error("Error getting professor session data", error);
    Swal.fire("Error", "Failed to load session data or attendance.", "error");
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  if (ws) {
    ws.close();
    console.log("WebSocket closed on unmount");
  }
});

const checkTimeRange = () => {
  if (!startTime.value || !endTime.value || !dateCreated.value) {
    isWithinTimeRange.value = false;
    return;
  }

  const now = new Date(); // Current date and time (local)
  const classDate = new Date(dateCreated.value); // Class date (UTC or other)

  const [startHour, startMinute] = startTime.value.split(":");
  const [endHour, endMinute] = endTime.value.split(":");

  // 1. Convert classDate to local time (PST)
  const classDatePST = new Date(
    classDate.getFullYear(),
    classDate.getMonth(),
    classDate.getDate()
  );

  // 2. Create startTimeDate and endTimeDate (PST)
  const startTimePST = new Date(
    classDatePST.getFullYear(),
    classDatePST.getMonth(),
    classDatePST.getDate(),
    startHour,
    startMinute
  );

  const endTimePST = new Date(
    classDatePST.getFullYear(),
    classDatePST.getMonth(),
    classDatePST.getDate(),
    endHour,
    endMinute
  );

  const isSameDate =
    now.getFullYear() === classDatePST.getFullYear() &&
    now.getMonth() === classDatePST.getMonth() &&
    now.getDate() === classDatePST.getDate();

  isWithinTimeRange.value =
    isSameDate && now >= startTimePST && now <= endTimePST;

  console.log("Is within time range:", isWithinTimeRange.value);
};

const startFrontCamera = () => {
  cameraConstraints.value = { facingMode: "user" };
};

const onError = (error) => {
  if (error.name === "NotAllowedError") {
    error.value = "user denied camera access permission";
  } else if (error.name === "NotFoundError") {
    error.value = "no suitable camera device installed";
  } else if (error.name === "NotSupportedError") {
    error.value = "page is not served over HTTPS (or localhost)";
  } else if (error.name === "NotReadableError") {
    error.value = "camera is already in use";
  } else if (error.name === "OverconstrainedError") {
    error.value = "did you request the front camera although there is none?";
  } else if (error.name === "StreamApiNotSupportedError") {
    error.value = "browser seems to be lacking features";
  }

  // Assuming $refs.qrcodeStream exists, which it might not in Options API for setup script
  // if (error.name === "OverconstrainedError") {
  //   $refs.qrcodeStream.updateConstraints(cameraConstraints.value);
  // }
};

const goBack = () => {
  router.go(-1);
};

const generateCSV = () => {
  // If there are students in attendance, but studentsByProgram hasn't fully loaded,
  // we might still show an error. Ensure studentsByProgram is always populated.
  if (studentsByProgram.value.length === 0) {
    Swal.fire(
      "Error",
      "No student master list data available to generate CSV.",
      "error"
    );
    return;
  }

  const datePart = new Date().toLocaleDateString("en-CA"); // Gets date in YYYY-MM-DD format
  // Use the program level from the *first* student in the combined master list,
  // or a generic "allprograms" if there's no specific program level in the master list.
  const filenameProgramLevel =
    studentsByProgram.value[0]?.courseYearSection?.replace(/\s/g, "") ||
    "allprograms";
  const filename = `Attendance_${datePart}_event.csv`;

  const csvData = studentsByProgram.value.map((masterStudent) => {
    // Find the attendance record for this master student
    const attendanceRecord = attendance.value.find((attendant) => {
      // Ensure both stud_id are treated as strings for comparison
      return String(attendant.stud_id) === String(masterStudent.stud_id);
    });

    return {
      Date: datePart,
      "First Name": masterStudent.first_name,
      "Middle Name": masterStudent.middle_name || "",
      "Last Name": masterStudent.last_name,
      "Program Level": masterStudent.courseYearSection,
      "Time in": attendanceRecord
        ? new Date(attendanceRecord.createdAt).toLocaleTimeString()
        : "Absent",
      Status: attendanceRecord ? "Present" : "Absent",
    };
  });

  const csv = Papa.unparse(csvData); // Converts array of objects to CSV string

  // --- Crucial part for download ---
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    // Check if browser supports download attribute
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
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    link.setAttribute("href", url); // Set the URL as the link's target
    link.setAttribute("download", filename); // Set the filename for download
    document.body.appendChild(link); // Append link to the body (necessary for Firefox)
    link.click(); // Programmatically click the link to trigger download
    document.body.removeChild(link); // Clean up: remove the link element
    URL.revokeObjectURL(url); // Release the object URL
  } else {
    Swal.fire(
      "Error",
      "Your browser doesn't support downloading files.",
      "error"
    );
  }
};
</script>

<style scoped>
.cont {
  border-radius: 50% !important;
  border: #464646 5px solid;
}
.cont img {
  width: 200px;
  height: 200px;
  border-radius: 50% !important;
}
h2 {
  font-family: Outfit-bold;
  color: #464646;
}
.desc {
  padding-top: 100px;
  position: relative;
  z-index: 2;
}
.qr-code-disabled {
  margin-top: 200px;
}
.text {
  color: white;
  overflow-y: auto;
  max-height: 250px;
}

.size {
  width: 500px !important;
  height: 500px !important;
}

.btnsyle {
  margin-left: 6px;

  background-color: white;
  color: black;
  width: 335px;
  height: 44px;
  border: black 2px solid;
  border-radius: 30px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: black;
  color: white;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
}

@media (min-width: 862px) {
  h2 {
    font-size: 30px !important;
  }
  .size {
    width: 200px;
    height: 200px;
  }
}

@media (max-height: 800px) {
  .size {
    width: 300px;
    height: 300px;
  }
}

.qr-loading {
  background-color: rgba(61, 60, 60, 0.6);
  width: 100%;
  height: 100vh;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
}

.qr-loading img {
  width: 500px;
  height: 500px;
}

.qr-loading h3 {
  color: white;
  font-family: Outfit-regular;
  margin-top: 30px;
  font-size: 60px;
  text-shadow: -1px -1px 0 black, /* Top-left shadow */ 1px -1px 0 black,
    /* Top-right shadow */ -1px 1px 0 black,
    /* Bottom-left shadow */ 1px 1px 0 black; /* Bottom-right shadow */
}

.alt-welcome img {
  width: 300px;
  height: 300px;
}
@media (max-width: 627px) {
  .qr-loading img {
    width: 60vw;
    height: 40vh;
  }
}
</style>
