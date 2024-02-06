<template>
  <div>
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
  </div>

  <div class="mm">
    <h1 style="color: white">Scanning Qr Codes</h1>
    <div class="size">
      {{ error }}
      <qrcode-stream
        @error="onError"
        @detect="onDetect"
        :constraints="cameraConstraints"
        ref="qrcodeStream"
      ></qrcode-stream>
    </div>
  </div>
  <div class="text">
    <h2>Attendance</h2>
    <ol class="text-start">
      <li v-for="student in attendance" :key="student.attendance_id">
        {{ student.student.first_name }} {{ student.student.middle_name }}
        {{ student.student.last_name }}
      </li>
    </ol>
  </div>
  <button class="btnsyle mb-3" @click="goBack">Back</button>
  <button class="btnsyle mb-3" @click="generateCSV">Download CSV</button>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";
import { baseURL } from "../config";
import axios from "axios";
import Swal from "sweetalert2";
import Papa from "papaparse";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps(["subjectID", "sessionID"]);
const subjectID = ref(props.subjectID);
const sessionID = ref(props.sessionID);
const rawValue = ref("");
const proftoken = localStorage.getItem("proftoken");

const attendance = ref([]);
const error = ref("");
const cameraConstraints = ref({ facingMode: "user" }); // Set initial constraints

const onDetect = async (result) => {
  try {
    if (result && result.length > 0 && result[0].rawValue) {
      rawValue.value = result[0].rawValue;

      const response = await axios.post(
        `${baseURL}/api/professor/createAttendance/${sessionID.value}`,
        {},
        {
          headers: {
            studtoken: rawValue.value,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      if (response.status === 200) {
        Swal.fire("Success", "Enjoy your class!!", "success");
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
        console.log(attendance.value);
      }
    } else {
      Swal.fire("Error", "An error occurred", "error");
    }
  } catch (error) {
    console.error("Error in onDetect:", error);
    // Handle the error or show an appropriate message to the user
    Swal.fire("Error", "An error occurred", "error");
  }
};

onMounted(async () => {
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
  } catch (error) {
    console.error("Error getting professor session data", error);
  }
});
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
  if (attendance.value.length === 0) {
    Swal.fire("Error", "No attendance data to download", "error");
    return;
  }

  const csvData = attendance.value.map((student) => ({
    Date: new Date(student.createdAt).toLocaleDateString(),
    "First Name": student.student.first_name,
    "Middle Name": student.student.middle_name,
    "Last Name": student.student.last_name,
    Course: student.student.courseYearSection,
  }));

  const csv = Papa.unparse(csvData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "attendance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    Swal.fire(
      "Error",
      "Your browser doesn't support downloading files",
      "error"
    );
  }
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
  color: white;
  margin-top: 0px;
  overflow-y: auto;
  max-height: 250px;
}
.mm {
  margin-top: 25px;
}

.btnsyle {
  margin-left: 6px;
  margin-top: 10px;
  background-color: white;
  color: black;
  width: 335px;
  height: 44px;
  border-radius: 30px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: gray;
  color: white;
  border-color: white;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
}

@media (min-width: 862px) {
  .size {
    margin-left: 100px;
    width: 500px;
    height: 400px;
  }
}

@media (max-height: 800px) {
  .mm {
    margin-top: 45px;
  }
  .size {
    margin-left: 10px;
    margin-top: 20px;
    width: 300px;
    height: 300px;
  }

  .text {
    height: 200px;
  }
}
</style>
