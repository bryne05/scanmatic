<template>
  <div class="bg">
    <navbar />
    <div v-if="isLoading" class="loading-overlay">
      <moon-loader :loading="isLoading" color="white" size="150px" />
    </div>
    <div v-else class="container">
      <div class="row">
        <div class="col-12 text-center text">
          <h1 style="font-family: Outfit-bold">RECYCLE BIN</h1>
          <h5>
            Deleted <b> {{ subjectName }} </b> sessions are shown here. You have
            the option to permanently delete or restore these records.
          </h5>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-6 d-flex gap-2">
          <div class="int-2 d-flex justify-content-center align-items-center">
            <img
              @click="goBack"
              src="../assets/Prof-Class/back.png"
              alt="back png"
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
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-responsive tab">
            <table class="table table-hover">
              <thead>
                <tr class="text-center sticky-header">
                  <th>VIEW DETAILS</th>
                  <th @click="sortTable('createdAt')">
                    DATE <i :class="sortIcon('createdAt')"></i>
                  </th>
                  <th>POINT VALUE</th>
                  <th>EXP</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="session in filteredSessions"
                  :key="session.class_id"
                  class="text-center icons"
                >
                  <td>
                    <img
                      @click="enterQR(session)"
                      src="../assets/Prof-Class/enter.png"
                      alt=""
                    />
                  </td>
                  <td>{{ formatDate(session.createdAt) }}</td>
                  <td>{{ session.clas_token }}</td>
                  <td>{{ session.class_exp }}</td>
                  <td>
                    <div class="d-flex justify-content-center gap-3">
                      <img
                        @click="restoreClass(session)"
                        src="../assets/Prof-Class/history.png"
                        alt="recycle icon"
                      />

                      <img
                        @click="deleteRecycleSession(session)"
                        src="../assets/Prof-Class/Delete.png"
                        alt="delete icon"
                      />
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredSessions.length === 0">
                  <td colspan="5" class="text-center">No sessions found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2 text">
      <div></div>
      <br />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import axios from "axios";
import navbar from "../components/professorNavBar.vue";
import { MoonLoader } from "vue3-spinner";
import { format } from "date-fns";

const isLoading = ref(true);
const router = useRouter();
const props = defineProps(["subjectID", "subjectName"]);
const subjectID = ref(props.subjectID);
const subjectName = ref(props.subjectName);
const programlevel = ref(props.programlevel);
const proftoken = localStorage.getItem("proftoken");
const professorSession = ref([]);
const searchQuery = ref("");
const sortConfig = ref({ key: "createdAt", direction: "desc" }); // Default sort

const fetchSessions = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/api/professor/getClassDeleted/${props.subjectID}`,
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
  } finally {
    isLoading.value = false;
  }
};

const restoreClass = async (session) => {
  const currentSessionID = session.class_id;
  const confirmationResult = await Swal.fire({
    title: "Restore Session",
    text: "Are you sure you want to restore this class? ",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    isLoading.value = true;
    try {
      const response = await axios.put(
        `${baseURL}/api/professor/deleteClassRestore/${subjectID.value}/${currentSessionID}`,
        {},

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
          text: "Class Data Restored successfully",
          icon: "success",
        });
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

const deleteRecycleSession = async (session) => {
  const currentSessionID = session.class_id;
  const confirmationResult = await Swal.fire({
    title: "Delete Session",
    html: `Are you sure you want to <span style="color: red; font-weight: bold;">PERMANENTLY DELETE</span> this class?`,
    icon: "warning",
    confirmButtonColor: "#d33",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmationResult.isConfirmed) {
    isLoading.value = true;
    try {
      const response = await axios.delete(
        `${baseURL}/api/professor/deleteClassPerma/${subjectID.value}/${currentSessionID}`,
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
          text: "Class Data Deleted successfully",
          icon: "success",
        }); // 2000 milliseconds = 2 seconds
      } else {
        isLoading.value = false;
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
onMounted(async () => {
  try {
    isLoading.value = true;
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
      programlevel: programlevel.value,
    },
  });
};

const goBack = () => {
  router.go(-1);
};

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "PPP"); // Format date as "Jan 1, 2024"
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

const filteredSessions = computed(() => {
  const search = searchQuery.value.toLowerCase();
  const sessions = professorSession.value;

  const filtered = sessions.filter((session) => {
    return (
      formatDate(session.createdAt).toLowerCase().includes(search) ||
      String(session.point_value).toLowerCase().includes(search) ||
      String(session.session_exp).toLowerCase().includes(search)
    );
  });

  // Perform sorting
  const sorted = [...filtered].sort((a, b) => {
    const keyA = a[sortConfig.value.key];
    const keyB = b[sortConfig.value.key];

    if (sortConfig.value.key === "createdAt") {
      // Handle date sorting
      const dateA = new Date(keyA).getTime();
      const dateB = new Date(keyB).getTime();
      return sortConfig.value.direction === "asc"
        ? dateA - dateB
        : dateB - dateA;
    } else {
      // Handle numeric and string sorting
      if (typeof keyA === "number" && typeof keyB === "number") {
        return sortConfig.value.direction === "asc" ? keyA - keyB : keyB - keyA;
      } else {
        const stringA = String(keyA).toLowerCase();
        const stringB = String(keyB).toLowerCase();
        return sortConfig.value.direction === "asc"
          ? stringA.localeCompare(stringB)
          : stringB.localeCompare(stringA);
      }
    }
  });
  return sorted;
});

const sortTable = (key) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction =
      sortConfig.value.direction === "asc" ? "desc" : "asc";
  } else {
    sortConfig.value.key = key;
    sortConfig.value.direction = "desc"; // Default direction for new key
  }
};

const sortIcon = (key) => {
  if (sortConfig.value.key === key) {
    return sortConfig.value.direction === "asc"
      ? "bi bi-arrow-up-short"
      : "bi bi-arrow-down-short";
  }
  return "";
};
</script>

<style scoped>
table {
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2) !important;
}

.tab {
  max-height: 500px !important;

  padding: 6px;
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
  width: 50px;
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
}
.icons img:hover {
  transform: scale(1.2);
}
.card-color {
  background-color: lightcyan;
}
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

.table-responsive {
  overflow-x: auto;
  margin-top: 20px;
}

.table-striped > tbody > tr:nth-child(odd) > td,
.table-striped > tbody > tr:nth-child(odd) > th {
  background-color: #f9f9f9; /* Light background for odd rows */
}

.table-hover > tbody > tr:hover > td,
.table-hover > tbody > tr:hover > th {
  background-color: greenyellow; /* Slightly darker on hover */
}

.table thead tr th {
  background-color: rgb(16, 118, 16); /* Header background */
  color: white; /* Header text color */
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

.sticky-header {
  position: sticky;
  top: 0;
  background-color: #e0e0e0; /* Consistent header background */
  z-index: 1;
}

.text {
  color: #464646;
  padding-top: 100px;
  margin-bottom: 10px;
}
</style>
