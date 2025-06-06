<template>
  <navbar />
  <div class="bg">
    <div class="container">
      <div class="row">
        <div class="col-xl-6 text-xl-start text-center">
          <h1>Event Sessions</h1>

          <h5>
            Manage your <b> Events </b> sessions for all students. Actions
            include adding, viewing, updating, deleting, and checking the
            recycle bin.
          </h5>
        </div>
        <div class="col-xl-6 text-xl-end text-center">
          <button
            class="btnsyle mb-3"
            data-bs-toggle="modal"
            data-bs-target="#addsession"
          >
            Add Session
          </button>
        </div>

        <div class="col-12">
          <div class="mb-3 d-flex gap-3">
            <div
              class="int-2 d-flex justify-content-center align-items-center gap-3"
            >
              <img
                @click="goBack()"
                src="../assets/Prof-Class/back.png"
                alt="back icon"
              />
              <img
                @click="enterRecycleBin()"
                src="../assets/Prof-Class/trash.png"
                alt="thrash icon"
              />
            </div>
            <div class="int search">
              <img src="../assets/Prof-Class/search.png" alt="" />
              <input
                type="text"
                class="form-control search"
                placeholder="Search here by Date..."
                v-model="searchQuery"
              />
            </div>
          </div>
          <div>
            <div class="table-responsive">
              <table class="table table-striped table-hover icons">
                <thead>
                  <tr class="text-center">
                    <th scope="col">VIEW DETAILS</th>
                    <th scope="col">DATE</th>
                    <th scope="col">POINT VALUE</th>
                    <th scope="col">EXP</th>
                    <th scope="col">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="session in filteredSessions"
                    :key="session.class_id"
                    class="text-center"
                  >
                    <td>
                      <img
                        @click="enterQR(session)"
                        src="../assets/Prof-Class/enter.png"
                        alt=""
                      />
                    </td>
                    <td>{{ session.createdAt }}</td>
                    <td>{{ session.clas_token }}</td>
                    <td>{{ session.class_exp }}</td>
                    <td>
                      <img
                        data-bs-toggle="modal"
                        data-bs-target="#updateSession"
                        @click="setUpdateSession(session)"
                        src="../assets/Prof-Class/Create.png"
                        alt="update icon"
                      />
                      <img
                        @click="deleteSession(session)"
                        src="../assets/Prof-Class/Delete.png"
                        alt="update icon"
                      />
                    </td>
                  </tr>
                  <tr v-if="filteredSessions.length === 0">
                    <td colspan="5">No sessions found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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
            <h5 class="modal-title" id="updateSession">New Session Details</h5>

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
</template>

<style scoped>
.int {
  display: flex;

  align-items: center;
  background-color: white;
  width: 320px;
  border-radius: 8px;
  gap: 3px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}
.int img {
  margin-left: 10px;
  width: 25px;
  height: 25px;
}

.int-2 {
  background-color: white;
  border-radius: 8px;
  width: 100px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.int-2 img {
  width: 25px;
  height: 25px;
  cursor: pointer;
  transition: 0.3s;
}
.int-2 img:hover {
  transform: scale(1.2);
}

.search {
  border: none;
}

.search input:focus {
  border: none !important; /* Change border */
  box-shadow: none !important; /* Add a shadow */
  outline: none !important;
}

.icons img {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: 0.3s;
  margin-left: 5px;
  margin-right: 5px;
}
.icons img:hover {
  transform: scale(1.2);
}

.table {
  margin: 0;
}

.table-responsive {
  padding: 0;
  margin: 0;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2) !important;
}
table {
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2) !important;
}

th,
tr {
  cursor: default;
}

.table-striped > tbody > tr:nth-child(odd) > td,
.table-striped > tbody > tr:nth-child(odd) > th {
  background-color: #f9f9f9; /* Light background for odd rows */
}

.table-hover > tbody > tr:hover > td,
.table-hover > tbody > tr:hover > th {
  background-color: #f0f0f0; /* Slightly darker on hover */
}

.table thead tr th {
  background-color: #e0e0e0; /* Header background */
  color: #333; /* Header text color */
  font-weight: bold;
  padding: 12px;
  border-bottom: 2px solid #ccc;
}

.table tbody tr td,
.table tbody tr th {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.table tfoot tr td,
.table tfoot tr th {
  padding: 5px;
  border-top: 2px solid #ccc;
  background-color: #f0f0f0;
  font-weight: bold;
}

.container {
  padding-top: 100px;
}
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

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import navbar from "../components/professorNavBar.vue";

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

// Current Session
const currentSessionID = ref(null);
const currentSessionToken = ref(null);
const currentSessionExp = ref(null);
const currentSessionCourseYearSection = ref(null);
const currentSessiontype = ref(null);

// Add Session
const sessionToken = ref("");
const sessionExp = ref("");
const sessionType = ref(false);

// Update Session
const updateSessionToken = ref("");
const updateSessionExp = ref("");

// Search and Sort
const searchQuery = ref("");

// Filtered and Sorted Sessions
const filteredSessions = computed(() => {
  let sessions = [...professorSession.value];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    sessions = sessions.filter((session) =>
      session.createdAt.toLowerCase().includes(query)
    );
  }

  // Sort by createdAt in descending order (latest first)
  sessions.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return sessions;
});

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
        class_courseYearSection: " ",
        class_token: updateSessionToken.value || currentSessionToken.value,
        class_exp: updateSessionExp.value || currentSessionExp.value,
        start_time: startTime.value,
        end_time: endTime.value,
        isOpen: false,
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

        await fetchSessions();

        updateSessionToken.value = "";
        updateSessionExp.value = "";
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
  if (!sessionToken.value || !sessionExp.value) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }

  try {
    const response = await axios.post(
      `${baseURL}/api/professor/createClass/${subjectID.value}`,
      {
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

const enterQR = (session) => {
  router.push({
    name: "EventQr",
    params: {
      subjectID: subjectID.value,
      sessionID: session.class_id,
      programlevel: " ",
    },
  });
};

const enterRecycleBin = () => {
  router.push({
    name: "ProfessorEventRecycleSession",
    params: {
      subjectID: subjectID.value,
      programlevel: " ",
    },
  });
};

const goBack = () => {
  router.go(-1);
};

</script>
