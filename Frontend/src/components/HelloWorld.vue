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
            <button class="btnsyle mb-3" @click="seeMasterList">
              View Master list
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
const programlevel = ref(props.programlevel);
const rawValue = ref("");
const proftoken = localStorage.getItem("proftoken");

const isLoading = ref(null);
const singleClass = ref([]);
const attendance = ref([]);
const error = ref("");
const cameraConstraints = ref({ facingMode: "environment" }); // Set initial constraints

const qrloading = ref(null);
const studentsByProgram = ref([]);
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
    // Or using .at(-1) for modern JS:
    // return attendance.value.at(-1);
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

        console.log(attendance.value);
      } else if (response.status === 400) {
        isloading.value = false;
        console.log("create attendance respopnse", response);
        console.log("mais");
      }
    } else {
      isloading.value = false;
      Swal.fire("Error", "An error occurred", "error");
      console.log("create attendance respopnse", response);
      return;
    }
  } catch (error) {
    qrloading.value = false;
    if (error.response) {
      const errorMessage = error.response.data.message; // Access the "message" from the backend JSON

      console.error("Backend Error:", errorMessage); // Log the specific error

      // Display specific SweetAlert based on the message
      if (errorMessage === "Student Already In class") {
        Swal.fire({
          icon: "info", // Use 'info' for informative messages
          title: "Already Present",
          text: "This student is already recorded for this session.",
        });
      } else {
        // Fallback for other backend errors
        Swal.fire(
          "Error",
          errorMessage || "An unexpected server error occurred.",
          "error"
        );
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., network error, server down)
      console.error("Network Error:", error.message);
      Swal.fire(
        "Error",
        "Network error. Please check your internet connection.",
        "error"
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Axios Setup Error:", error.message);
      Swal.fire("Error", "An error occurred during request setup.", "error");
    }
  }
};

const seeMasterList = async () => {
  try {
    if (studentsByProgram.value.length === 0) {
      Swal.fire("No Students", "No students found for this program.", "info");
      return;
    }

    let htmlContent = `<ul style="list-style-type:none;">`;

    studentsByProgram.value.forEach((student, num) => {
      htmlContent += `
        <li class="text-start">

          <strong>${num + 1}. ${student.first_name} ${student.middle_name} ${
        student.last_name
      }</strong><br>


        </li>

      `;
    });

    htmlContent += `</ul>`;

    Swal.fire({
      position: "center",
      title: `Master List for ${programlevel.value}`,
      html: htmlContent,
      width: 600,
    });
  } catch (error) {
    console.error("Error fetching students:", error); // Important: Log the error!
    Swal.fire("Error", "An error occurred while fetching students.", "error"); // Show error Swal
  }
};

const fetchMasterList = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/api/admin/getClassStudentByProgram`,
      { courseYearSection: programlevel.value }
    );

    studentsByProgram.value = response.data.students;
  } catch (error) {
    console.error("Error fetching MasterList:", error); // Important: Log the error!
    Swal.fire("Error", "An error occurred while fetching students.", "error"); // Show error Swal
  }
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
    await fetchMasterList();
    isLoading.value = false;
    console.log("attendance:", attendance.value);
    console.log("Masterlist22:", studentsByProgram.value);
  } catch (error) {
    console.error("Error getting professor session data", error);
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

  if (error.name === "OverconstrainedError") {
    $refs.qrcodeStream.updateConstraints(cameraConstraints.value);
  }
};

const goBack = () => {
  router.go(-1);
};

const generateCSV = () => {
  if (studentsByProgram.value.length === 0) {
    Swal.fire("Error", "No student data available.", "error");
    return;
  }

  const datePart = new Date().toLocaleDateString("en-CA");
  const programLevel =
    studentsByProgram.value[0]?.courseYearSection?.replace(/\s/g, "") ||
    "noprogram";
  const filename = `Attendance_${datePart}_${programLevel}.csv`;

  const csvData = studentsByProgram.value.map((masterStudent) => {
    // Find the matching attendance record
    const attendanceRecord = attendance.value.find((attendant) => {
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

  const csv = Papa.unparse(csvData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
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
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
