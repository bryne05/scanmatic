<!-- professorSession.vue -->
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
              <RouterLink class="nav-link pointer curr" to="/professor/event">
                Events
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

  <div class="mt-2 text">
    <h2 class="text">Event Session</h2>

    <div class="container m-0 p-0">
      <div class="row">
        <div class="col-6 d-flex align-items-start flex-column">
          <h3 class="text-start">Event: {{ subjectName }}</h3>
        </div>
        <div class="col-6 d-flex align-items-center justify-content-end">
          <div class="bin-container">
            <div class="bin">
              <button
                class="btn-recycle btn btn-light"
                @click="enterRecycleBin()"
              >
                <img src="../assets/litter.png" alt="" height="40" width="40" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card -->
    <div>
      <button
        class="btnsyle mb-3"
        data-bs-toggle="modal"
        data-bs-target="#addsession"
      >
        Add Session
      </button>
      <div
        class="row scroll-container"
        :style="{ width: professorSession.length <= 2 ? '80vw' : 'auto' }"
      >
        <div
          class="col-md-4 col-sm-6 mt-3"
          v-for="session in professorSession"
          :key="session.class_id"
        >
          <div class="card h-100">
            <div class="card-body">
              <button
                class="btn btn-dark mar w-100 mb-3"
                @click="enterQR(session)"
              >
                Enter
              </button>
              <h4 class="card-title mb-3">
                {{ session.createdAt }}
              </h4>
              <!-- <h6>
                Start Time: {{ formatTime(session.start_time) }} &ensp; End
                Time: {{ formatTime(session.end_time) }}
              </h6> -->
              <p class="card-text">
                <!-- <div v-if="session.class_courseYearSection.trim() !== ''">
  Program Level: 
  {{ session.class_courseYearSection }}
</div>
<div v-else>
<b>Open Session </b> 
</div> -->

                Point Value:{{ session.clas_token }}<br />
                Exp: {{ session.class_exp }} <br />
              </p>
              <button
                class="btn btn-primary mar"
                data-bs-toggle="modal"
                data-bs-target="#updateSession"
                @click="setUpdateSession(session)"
              >
                Update
              </button>
              <button
                class="btn btn-danger mar"
                @click="deleteSession(session)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add session Modal -->
    <div
      class="modal fade"
      id="addsession"
      tabindex="-1"
      aria-labelledby="addCategory"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        style="color: black"
      >
        <div class="modal-content">
          <form>
            <div class="modal-header">
              <h5 class="modal-title" id="addsession">Session Details</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="col-md-12">
                <!-- Show Program Level only for Close Session
                <div v-if="!sessionType">
                  <label class="form-label fw-bold inv">Program Level</label>
                  <input
                    v-model="sessionCourseYearSection"
                    type="text"
                    class="form-control cus-border"
                    placeholder="Ex BSCS 4A, ABM 12B"
                  />
                </div> -->

                <label class="form-label fw-bold inv">Point Value</label>
                <input
                  v-model="sessionToken"
                  type="number"
                  class="form-control cus-border"
                  placeholder="Enter the Points gained by students"
                />

                <label class="form-label fw-bold inv">Experience Point</label>
                <input
                  v-model="sessionExp"
                  type="number"
                  class="form-control cus-border"
                  placeholder="Enter exp gained by students"
                />

                <!-- <label class="form-label fw-bold inv mt-2"
                  >Type of Session</label
                >
                <br />
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  :value="false"
                  v-model="sessionType"
                />
                <label class="form-check-label" for="flexRadioDefault1">
                  Close Session
                </label>

                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  :value="true"
                  v-model="sessionType"
                />
                <label class="form-check-label mb-2" for="flexRadioDefault2">
                  Open Session
                </label>

                <br />

                <label class="form-label fw-bold inv">Start Time</label>
                <VueDatePicker
                  v-model="sessionStartTime"
                  time-picker
                  placeholder="Start Time"
                  :is24="false"
                  auto-position="top"
                  :teleport="true"
                >
                  <template #input-icon>
                    <img class="input-slot-image" src="../assets/clock.png" />
                  </template>
                </VueDatePicker>

                <label class="form-label fw-bold inv">End Time</label>
                <VueDatePicker
                  v-model="sessionEndTime"
                  time-picker
                  placeholder="End Time"
                  :is24="false"
                  auto-position="top"
                  :teleport="true"
                >
                  <template #input-icon>
                    <img class="input-slot-image" src="../assets/clock.png" />
                  </template>
                </VueDatePicker> -->
              </div>
            </div>
            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="button" class="btn btn-primary" @click="addSession">
                Add Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Update session Modal -->
    <div
      class="modal fade"
      id="updateSession"
      tabindex="-1"
      aria-labelledby="addCategory"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        style="color: black"
      >
        <div class="modal-content">
          <form>
            <div class="modal-header">
              <h5 class="modal-title" id="updateSession">
                New Session Details
              </h5>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <h6 style="color: gray">
                <i
                  >"Leave other fields blank if you don't want to update them.
                  Time fields cannot be left blank."</i
                >
              </h6>
              <div class="col-md-12">
                <!-- <div v-if="!updateSessiontype">
                  <label class="form-label fw-bold inv">Program Level</label>
                  <input
                    v-model="updateCourseYearSection"
                    type="text"
                    class="form-control cus-border"
                    placeholder="Enter new Program Level and Year Ex BSCS 4A,ABM 12A"
                  />
                </div> -->
                <label class="form-label fw-bold inv">Point Value</label>
                <input
                  v-model="updateSessionToken"
                  type="number"
                  class="form-control cus-border"
                  placeholder="Enter new points"
                />
                <label class="form-label fw-bold inv">Experience Point</label>
                <input
                  v-model="updateSessionExp"
                  type="number"
                  class="form-control cus-border"
                  placeholder="Enter new Experience Point"
                />

                <!-- <label class="form-label fw-bold inv mt-2"
                  >Type of Session</label
                >
                <br />
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  :value="false"
                  v-model="updateSessiontype"
                />
                <label class="form-check-label" for="flexRadioDefault1">
                  Close Session
                </label>

                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  :value="true"
                  v-model="updateSessiontype"
                />
                <label class="form-check-label mb-2" for="flexRadioDefault2">
                  Open Session
                </label>
                <br />
                <label class="form-label fw-bold inv">Start Time</label>

                <VueDatePicker
                  v-model="updateStartTime"
                  time-picker
                  placeholder="Update Start Time"
                  :is24="false"
                  auto-position="top"
                  :teleport="true"
                >
                  <template #input-icon>
                    <img class="input-slot-image" src="../assets/clock.png" />
                  </template>
                </VueDatePicker>
                <label class="form-label fw-bold inv">End Time</label>
                <VueDatePicker
                  v-model="updateEndTime"
                  time-picker
                  placeholder="Update End Time"
                  :is24="false"
                  auto-position="top"
                  :teleport="true"
                >
                  <template #input-icon>
                    <img class="input-slot-image" src="../assets/clock.png" />
                  </template>
                </VueDatePicker> -->

                <input type="hidden" v-model="currentSessionID" />
              </div>
            </div>
            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="updateSubject"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const router = useRouter();

const subjectDetails = router.state;

const props = defineProps([
  "subjectID",
  "subjectName",
  "subjectCourse",
  "startTime",
  "endTime",
]);
const subjectID = ref(props.subjectID);
const subjectName = ref(props.subjectName);
const programlevel = ref(props.subjectCourse);
const startTime = ref(props.startTime);
const endTime = ref(props.endTime);
const proftoken = localStorage.getItem("proftoken");
const professorSession = ref([]);

//Current Session
const currentSessionID = ref(null);
const currentSessionToken = ref(null);
const currentSessionExp = ref(null);
const currentSessionCourseYearSection = ref(null);
const currentSessiontype = ref(null);

//Add Session
const sessionToken = ref("");
const sessionExp = ref("");
// const sessionCourseYearSection = ref("");
// const sessionStartTime = ref("");
// const sessionEndTime = ref("");
const sessionType = ref(false);
//Update Session
const updateSessionToken = ref("");
const updateSessionExp = ref("");

// const updateCourseYearSection = ref("");
// const updateStartTime = ref("");
// const updateEndTime = ref("");
// const updateSessiontype = ref();
// function formatTime(timeString) {
//   if (!timeString) return ""; // Handle null or undefined

//   const [hours, minutes, seconds] = timeString.split(":");
//   let formattedHours = parseInt(hours, 10);
//   const amPm = formattedHours >= 12 ? "PM" : "AM";

//   formattedHours = formattedHours % 12 || 12; // Convert to 12-hour format (0 becomes 12)

//   return `${formattedHours}:${minutes} ${amPm}`;
// }

const fetchSessions = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/api/professor/getClass/${props.subjectID}`,
      {
        headers: {
          proftoken: proftoken,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    professorSession.value = response.data.classes;
    console.log(professorSession.value);
  } catch (error) {
    console.error("Error getting sessions:", error);
    Swal.fire("Error", "Failed to fetch sessions", "error");
  }
};

const setUpdateSession = (session) => {
  currentSessionID.value = session.class_id;
  currentSessionToken.value = session.class_token;
  currentSessionExp.value = session.class_exp;
  // currentSessionCourseYearSection.value = session.class_courseYearSection;

  // // Ensure the session start and end time are parsed correctly
  // updateStartTime.value = session.start_time
  //   ? {
  //       hours: parseInt(session.start_time.split(":")[0]),
  //       minutes: parseInt(session.start_time.split(":")[1]),
  //     }
  //   : null;

  // updateEndTime.value = session.end_time
  //   ? {
  //       hours: parseInt(session.end_time.split(":")[0]),
  //       minutes: parseInt(session.end_time.split(":")[1]),
  //     }
  //   : null;

  // // Set the session type correctly
  // updateSessiontype.value = session.isOpen; // This should match the sessionType value
};

const updateSubject = async () => {
  const confirmationResult = await Swal.fire({
    title: "Update Session",
    text: "Are you sure you want to update this Session?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    try {
      // // Determine the value for class_courseYearSection based on isOpen
      // let classCourseYearSection = "";

      // // Check if session is open (isOpen === true)
      // if (updateSessiontype.value === true) {
      //   classCourseYearSection = ""; // Open session will have empty class_courseYearSection
      // } else {
      //   // If session is not open, use the provided value or the current session value
      //   classCourseYearSection =
      //     updateCourseYearSection.value ||
      //     currentSessionCourseYearSection.value;

      //   // If class_courseYearSection is still empty or null, it is required
      //   if (!classCourseYearSection) {
      //     Swal.fire({
      //       title: "Error",
      //       text: "Program Level is required.",
      //       icon: "error",
      //     });
      //     return; // Stop the update process if the field is empty or null
      //   }
      // }

      const updatedData = {
        // class_courseYearSection: classCourseYearSection, // Value determined based on isOpen and requirement
        class_courseYearSection: "",
        class_token: updateSessionToken.value || currentSessionToken.value,
        class_exp: updateSessionExp.value || currentSessionExp.value,
        // start_time: updateStartTime.value
        //   ? `${updateStartTime.value.hours}:${updateStartTime.value.minutes}`
        //   : null, // Key change!
        // end_time: updateEndTime.value
        //   ? `${updateEndTime.value.hours}:${updateEndTime.value.minutes}`
        //   : null, // Key change!
        start_time: startTime.value,
        end_time: endTime.value,
        isOpen: false,
      };
      // console.log("isOpen Update data:", updatedData.isOpen);
      const response = await axios.put(
        `${baseURL}/api/professor/updateClass/${subjectID.value}/${currentSessionID.value}`,
        updatedData,
        {
          headers: {
            proftoken: proftoken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Sessions updated successfully",
          icon: "success",
        });

        await fetchSessions();

        updateSessionToken.value = "";
        updateSessionExp.value = "";
        // updateCourseYearSection.value = "";
      } else {
        console.error("Failed to update Sessions:", response.statusText);
        Swal.fire({
          title: "Error",
          text: `"Failed to update Sessions"`,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating Sessions:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating Sessions",
        icon: "error",
      });
    }
  }
};

const addSession = async () => {
  if (
    !sessionToken.value ||
    !sessionExp.value
    // !sessionExp.value ||
    // !sessionStartTime.value ||
    // !sessionEndTime
  ) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }

  try {
    const response = await axios.post(
      `${baseURL}/api/professor/createClass/${subjectID.value}`,
      {
        // class_courseYearSection: sessionCourseYearSection.value,
        class_courseYearSection: " ",
        class_token: sessionToken.value,
        class_exp: sessionExp.value,
        start_time: startTime.value,
        end_time: endTime.value,
        isdeleted: false,
        isOpen: true,
      },
      {
        headers: {
          proftoken: `${proftoken}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    // Handle success or show a notification
    if (response.status === 200) {
      Swal.fire("Success", "Session has been added successfully!", "success");
      await fetchSessions();

      sessionToken.value = "";
      sessionExp.value = "";
      // sessionCourseYearSection.value = "";
      // sessionStartTime.value = "";
      // sessionEndTime.value = "";
      sessionType.value = false;
    }
  } catch (error) {
    console.error("Error adding item:", error);
    Swal.fire(
      "Error",
      "A session with that Program Level already Exist. Please, wait 6 hours to add the same Program Level",
      "error"
    );
  }
};

const deleteSession = async (session) => {
  const sessionID = session.class_id;
  const confirmationResult = await Swal.fire({
    title: "Delete Session",
    text: "Are you sure you want to delete this session item?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    try {
      const archiveDelete = {
        isdeleted: true,
      };
      const response = await axios.put(
        `${baseURL}/api/professor/deleteClass/${subjectID.value}/${sessionID}`,
        archiveDelete,
        {
          headers: {
            proftoken: proftoken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Session deleted successfully",
          icon: "success",
        });

        await fetchSessions();
      } else {
        console.error("Failed to delete  shopitem:", response.statusText);
        Swal.fire({
          title: "Error",
          text: "Failed to delete session",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting shop item:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating this session",
        icon: "error",
      });
    }
  }
};

onMounted(() => {
  console.log("subjectDetails: ", subjectDetails);
  fetchSessions();
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
    router.push("/ZXNzb3IiLCJVfrvonD");
  }
};

const enterQR = (session) => {
  router.push({
    name: "EventQr",
    params: {
      subjectID: subjectID.value,
      sessionID: session.class_id,
      programlevel: session.class_courseYearSection,
    },
  });
};

const enterRecycleBin = () => {
  router.push({
    name: "ProfessorRecycleSession",
    params: {
      subjectID: subjectID.value,
    },
  });
};
</script>

<style scoped>
.form-check-input {
  border: 2px solid gray;
  margin-right: 5px;
  margin-left: 10px;
}

body {
  margin: 0;
  padding: 0;
}

.scroll-container {
  max-height: 570px;
  overflow-y: auto;
  overflow-x: hidden;
}

.btnsyle {
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

@media (max-height: 800px) {
  .scroll-container {
    max-height: 400px;
  }
}
</style>
