<template>
  <div class="bg">
    <navbar />
    <div v-if="isLoading" class="loading-overlay">
      <moon-loader :loading="isLoading" color="white" size="150px" />
    </div>
    <div v-else class="container desc">
      <div class="row">
        <div class="col-lg-6 col-12 text">
          <h1 class="text-start" style="font-family: Outfit-bold">SESSIONS</h1>
          <h5>
            Manage your <b> {{ subjectName }} </b> sessions for
            <b>{{ programlevel }}</b> students. Actions include adding, viewing,
            updating, deleting, and checking the recycle bin.
          </h5>
        </div>
        <div class="col-lg-6 col-12 d-flex justify-content-end add-btn">
          <button
            class="btnsyle"
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
          <div class="table-responsive tab">
            <table class="table table-striped table-hover">
              <thead>
                <tr
                  class="text-center sticky-header"
                  style="position: sticky; width: 100%"
                >
                  <th>VIEW DETAILS</th>
                  <th @click="sortTable('createdAt')">
                    DATE <i :class="sortIcon('createdAt')"></i>
                  </th>
                  <th>POINT VALUE</th>
                  <th>EXP</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr
                  v-for="session in filteredAndSortedSessions"
                  :key="session.class_id"
                >
                  <td class="icons">
                    <img
                      @click="enterQR(session)"
                      src="../assets/Prof-Class/enter.png"
                      alt="enter icon"
                    />
                  </td>
                  <td>{{ session.createdAt }}</td>
                  <td>{{ session.clas_token }}</td>
                  <td>{{ session.class_exp }}</td>
                  <td>
                    <div
                      class="icons d-flex gap-2 justify-content-center align-items-center"
                    >
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
                        alt="delete icon"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p
            v-if="filteredAndSortedSessions.length === 0"
            class="text-muted text-center"
          >
            No sessions found.
          </p>
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

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";
import "@vuepic/vue-datepicker/dist/main.css";
import { MoonLoader } from "vue3-spinner";

import navbar from "../components/professorNavBar.vue";
const isLoading = ref(true);
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

//Add Session
const sessionToken = ref("");
const sessionExp = ref("");
const sessionType = ref(false);
//Update Session
const updateSessionToken = ref("");
const updateSessionExp = ref("");

const searchQuery = ref("");
const sortConfig = ref({ key: "createdAt", direction: "desc" });

const filteredSessions = computed(() => {
  const search = searchQuery.value.toLowerCase();
  return search
    ? professorSession.value.filter((session) =>
        session.createdAt.toLowerCase().includes(search)
      )
    : professorSession.value;
});

const sortedSessions = computed(() => {
  const array = [...filteredSessions.value];
  if (!sortConfig.value.key) return array;

  array.sort((a, b) => {
    const valA = a[sortConfig.value.key];
    const valB = b[sortConfig.value.key];

    if (sortConfig.value.key === "createdAt") {
      const dateA = new Date(valA);
      const dateB = new Date(valB);
      return sortConfig.value.direction === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    } else {
      return sortConfig.value.direction === "asc" ? valA - valB : valB - valA;
    }
  });
  return array;
});

const filteredAndSortedSessions = sortedSessions;

const sortTable = (key) => {
  if (sortConfig.value.key !== key) {
    sortConfig.value = { key, direction: "asc" };
  } else {
    sortConfig.value.direction =
      sortConfig.value.direction === "asc" ? "desc" : "asc";
  }
};

const sortIcon = (key) => {
  if (sortConfig.value.key === key) {
    return sortConfig.value.direction === "asc"
      ? "bi bi-arrow-up"
      : "bi bi-arrow-down";
  }
  return "";
};

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
    isLoading.value = true;
    try {
      const updatedData = {
        class_courseYearSection: programlevel.value,
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
        await fetchSessions();

        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "Sessions updated successfully",
          icon: "success",
        });
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
    isLoading.value = true;
    const response = await axios.post(
      `${baseURL}/api/professor/createClass/${subjectID.value}`,
      {
        class_courseYearSection: programlevel.value,
        class_token: sessionToken.value,
        class_exp: sessionExp.value,
        start_time: startTime.value,
        end_time: endTime.value,
        isdeleted: false,
        isOpen: false,
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
      await fetchSessions();

      isLoading.value = false;
      Swal.fire("Success", "Session has been added successfully!", "success");

      sessionToken.value = "";
      sessionExp.value = "";
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
    isLoading.value = true;
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
        await fetchSessions();
        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "Session deleted successfully",
          icon: "success",
        });
      } else {
        console.error("Failed to delete  shopitem:", response.statusText);
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
    isLoading.value = true;
    console.log("subjectDetails: ", subjectDetails);
    await fetchSessions();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});

const enterQR = (session) => {
  router.push({
    name: "QrScanner",
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
      programlevel: programlevel.value,
    },
  });
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}
.tab {
  max-height: 500px !important;
  /* padding: 15px 15px 0px 15px;
  background-color: white;
  border-radius: 16px; */

  padding: 6px;
}
.text {
  color: #464646;

  margin-bottom: 40px;
}

table {
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2) !important;
}
.text h2 {
  font-weight: bold;
  letter-spacing: 2px;
}
.int {
  display: flex;

  align-items: center;
  background-color: white;
  width: 220px;
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
.desc {
  padding-top: 120px;
}
.form-check-input {
  border: 2px solid gray;
  margin-right: 5px;
  margin-left: 10px;
}

.icons img {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: 0.3s;
}
.icons img:hover {
  transform: scale(1.2);
}

.scroll-container {
  max-height: 570px;
  overflow-y: auto;
  overflow-x: hidden;
}

.btnsyle {
  background-color: #464646;
  color: white;
  width: 229px;
  height: 50px;
  border-radius: 8px;
  transition: 0.3s ease-in-out;
  border: none;
}

.btnsyle:hover {
  color: black;
  background-color: white;
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

th {
  cursor: pointer;
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
</style>
