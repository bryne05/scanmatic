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
    <h2 class="text">Session</h2>
    <h3 class="text-start">Subject: {{ subjectName }}</h3>
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
              <h5 class="card-title mb-3">{{ session.createdAt }}</h5>
              <p class="card-text">
                Program Level: {{ session.class_courseYearSection }} <br />
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
                <label class="form-label fw-bold inv">Program Level</label>
                <input
                  v-model="sessionCourseYearSection"
                  type="text"
                  class="form-control cus-border"
                  placeholder="Ex BSCS 4A,ABM 12B"
                />

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
                  >"Leave it blank if you don't want to update certain
                  details"</i
                >
              </h6>
              <div class="col-md-12">
                <label class="form-label fw-bold inv">Program Level</label>
                <input
                  v-model="updateCourseYearSection"
                  type="text"
                  class="form-control cus-border"
                  placeholder="Enter new Program Level and Year Ex BSCS 4A,ABM 12A"
                />
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

const router = useRouter();
const props = defineProps(["subjectID", "subjectName"]);
const subjectID = ref(props.subjectID);
const subjectName = ref(props.subjectName);

const proftoken = localStorage.getItem("proftoken");
const professorSession = ref([]);

//Current Session
const currentSessionID = ref(null);
const currentSessionToken = ref(null);
const currentSessionExp = ref(null);
const currentSessionCourseYearSection = ref(null);

//Add Session
const sessionToken = ref("");
const sessionExp = ref("");
const sessionCourseYearSection = ref("");

//Update Session
const updateSessionToken = ref("");
const updateSessionExp = ref("");
const updateCourseYearSection = ref("");

const setUpdateSession = (session) => {
  currentSessionID.value = session.class_id;
  currentSessionToken.value = session.class_token;
  currentSessionExp.value = session.class_exp;
  currentSessionCourseYearSection.value = session.class_courseYearSection;
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
      const updatedData = {
        class_courseYearSection:
          updateCourseYearSection.value ||
          currentSessionCourseYearSection.value,
        class_token: updateSessionToken.value || currentSessionToken.value,
        class_exp: updateSessionExp.value || currentSessionExp.value,
      };

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

        const response = await axios.get(
          `${baseURL}/api/professor/getClass/${subjectID.value}`,
          {
            headers: {
              proftoken: proftoken,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        professorSession.value = response.data.classes;

        updateSessionToken.value = "";
        updateSessionExp.value = "";
        updateCourseYearSection.value = "";
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
    !sessionCourseYearSection.value ||
    !sessionToken.value ||
    !sessionExp.value
  ) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }
  try {
    const response = await axios.post(
      `${baseURL}/api/professor/createClass/${subjectID.value}`,
      {
        class_courseYearSection: sessionCourseYearSection.value,
        class_token: sessionToken.value,
        class_exp: sessionExp.value,
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
      const response = await axios.get(
        `${baseURL}/api/professor/getClass/${subjectID.value}`,
        {
          headers: {
            proftoken: proftoken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      professorSession.value = response.data.classes;

      sessionToken.value = "";
      sessionExp.value = "";
      sessionCourseYearSection.value = "";
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
      const response = await axios.delete(
        `${baseURL}/api/professor/deleteClass/${subjectID.value}/${sessionID}`,
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
          text: "Subject Deleted successfully",
          icon: "success",
        });

        const response = await axios.get(
          `${baseURL}/api/professor/getClass/${subjectID.value}`,
          {
            headers: {
              proftoken: proftoken,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        professorSession.value = response.data.classes;
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

onMounted(async () => {
  try {
    const response = await axios.get(
      `${baseURL}/api/professor/getClass/${subjectID.value}`,
      {
        headers: {
          proftoken: proftoken,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    professorSession.value = response.data.classes;
  } catch (error) {
    console.error("Error getting professor session data", error);
  }
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
    name: "QrScanner",
    params: {
      subjectID: subjectID.value,
      sessionID: session.class_id,
    },
  });
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

.scroll-container {
  max-height: 600px;
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
