<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue"; // Import 'computed'
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios";
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);
const router = useRouter();

const token = localStorage.getItem("admintoken");

const allProfessor = ref([]);
const searchQuery = ref(""); // New: for search input
const sortByValidation = ref(null); // New: for sorting (null, 0, or 1)

// New: Computed property for filtering and sorting
const filteredAndSortedProfessors = computed(() => {
  let filtered = allProfessor.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (professor) =>
        professor.first_name.toLowerCase().includes(query) ||
        professor.middle_name.toLowerCase().includes(query) ||
        professor.last_name.toLowerCase().includes(query)
    );
  }

  // Apply sort by validation status
  if (sortByValidation.value !== null) {
    filtered = filtered.filter(
      (professor) => professor.isValidated === (sortByValidation.value === 1)
    );
  }

  // Optional: You can add another level of sorting here, e.g., by name
  filtered.sort((a, b) => {
    const nameA = `${a.last_name}, ${a.first_name}`.toLowerCase();
    const nameB = `${b.last_name}, ${b.first_name}`.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  return filtered;
});

const validateProfessor = async (data) => {
  const result = await Swal.fire({
    title: "Do you want to approve this Professor?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (result.isConfirmed) {
    const prof_id = data;

    isLoading.value = true;
    try {
      const response = await axios.post(
        `${baseURL}/api/admin/validateProfessor/${prof_id}`,
        null,
        {
          headers: {
            admintoken: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (response.status === 200) {
        isLoading.value = false;
        Swal.fire({
          title: "Professor Approved!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Update allProfessor ref
        const index = allProfessor.value.findIndex(
          (p) => p.prof_id === prof_id
        );
        if (index !== -1) {
          allProfessor.value[index].isValidated = true;
        }
      } else {
        isLoading.value = false;
        Swal.fire({
          title: "Error",
          text: response.data.message || "Failed to approve professor.", // Show error message from API if available
          icon: "error",
        });
        console.error("API Error:", response.data); // Log the error for debugging
      }
    } catch (error) {
      isLoading.value = false;
      Swal.fire({
        title: "Error",
        text: "An error occurred during validation.",
        icon: "error",
      });
      console.error("Validation Error:", error);
    }
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
    localStorage.removeItem("admintoken");
    router.push("/admin");
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${baseURL}/api/admin/getAllProfessor`, {
      headers: {
        admintoken: `${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    });

    allProfessor.value = response.data.professors;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;

    console.error("Error fetching professor", error);
  }
});

const resetPassword = async (prof_id, first_name, middle_name, last_name) => {
  try {
    const resetPass = await Swal.fire({
      title:
        "Are you sure you want to reset the password for \n " +
        "<p style='color:red'>" +
        `   \n   ${first_name} ${middle_name} ${last_name}` +
        "</p>",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (resetPass.isConfirmed) {
      isLoading.value = true;

      const reset = await axios.post(
        `${baseURL}/api/admin/resetProfessorPassword/${prof_id}`,
        {},
        {
          headers: {
            adminToken: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (reset.status === 200) {
        isLoading.value = false;

        Swal.fire({
          title: "Success",
          text: "The password has been reset successfully.",
          icon: "success",
        });
      }
    }
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;

    console.error("Error resetting password", error);
    Swal.fire({
      title: "Error",
      text: "An error occurred while resetting the password.",
      icon: "error",
    });
  }
};

const deleteProfessor = async (prof_id, first_name, middle_name, last_name) => {
  try {
    const deleteProfessor = await Swal.fire({
      title:
        "Are you sure you want to DELETE the account of \n " +
        "<p style='color:red'>" +
        `    ${first_name} ${middle_name} ${last_name}` +
        "</p>",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (deleteProfessor.isConfirmed) {
      isLoading.value = true;

      const deleteProf = await axios.delete(
        `${baseURL}/api/admin/deleteProfessor/${prof_id}`,
        {
          headers: {
            adminToken: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (deleteProf.status === 200) {
        const response = await axios.get(
          `${baseURL}/api/admin/getAllProfessor`,
          {
            headers: {
              admintoken: `${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        allProfessor.value = response.data.professors;
        isLoading.value = false;

        Swal.fire({
          title: "Success",
          text: "The account has been deleted",
          icon: "success",
        });
      }
    }
  } catch (error) {
    console.error("Error deleting student", error);
    Swal.fire({
      title: "Error",
      text: "An error occurred while deleting the Professor.",
      icon: "error",
    });
  }
};

const back = async () => {
  router.back();
};
</script>

<template>
  <div class="bg">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>

    <div v-else class="container">
      <div class="row">
        <div class="col-6">
          <button class="btn-return" @click="back">
            <img src="../assets/return.png" alt="" width="28" height="40" />
          </button>
        </div>
        <div class="col-6 text-end">
          <button type="button" class="btn btn-danger" @click="logout">
            Logout
          </button>
        </div>

        <div class="col-12 text-center">
          <h1>PROFESSOR LIST</h1>

          <div class="row mb-3 justify-content-start">
            <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                placeholder="Search by name"
                v-model="searchQuery"
              />
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="sortByValidation">
                <option :value="null">All Professors</option>
                <option :value="1">Approved</option>
                <option :value="0">Pending Approval</option>
              </select>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr class="tr">
                  <th scope="col">PROFESSOR NAME</th>
                  <th scope="col">VALIDATE</th>
                  <th scope="col">RESET PASSWORD</th>
                  <th scope="col">REMOVE PROFESSOR</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="professor in filteredAndSortedProfessors"
                  :key="professor.prof_id"
                >
                  <td class="text-start">
                    {{ professor.first_name }} {{ professor.middle_name }}
                    {{ professor.last_name }}
                  </td>

                  <td>
                    <button
                      class="btn btn-success"
                      v-if="!professor.isValidated"
                      @click="validateProfessor(professor.prof_id)"
                    >
                      Approve
                    </button>
                    <span v-else>Approved</span>
                  </td>
                  <td>
                    <button
                      class="btn btn-primary"
                      @click="
                        resetPassword(
                          professor.prof_id,
                          professor.first_name,
                          professor.middle_name,
                          professor.last_name
                        )
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-bootstrap-reboot"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.8 6.8 0 0 0 1.16 8z"
                        />
                        <path
                          d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324z"
                        />
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button
                      class="btn btn-danger"
                      @click="
                        deleteProfessor(
                          professor.prof_id,
                          professor.first_name,
                          professor.middle_name,
                          professor.last_name,
                          professor.courseYearSection
                        )
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-person-dash"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
                        />
                        <path
                          d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedProfessors.length === 0">
                  <td colspan="4">No professors found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding-top: 30px;
}
.table-responsive {
  max-height: 700px !important;
}
.text {
  margin-top: 100px !important;
  max-width: fit-content;
  max-height: 650px;
  overflow-y: auto;
  margin-top: 50px;
  color: white;
}
.tr {
  position: relative;
}

.card:hover {
  scale: 1.03;
}

.btn {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 30px;
  padding-left: 30px;
  border-radius: 15px;
}
.container-1 {
  z-index: 999 !important;
  margin-left: 500px;
  position: relative !important;
}
</style>
