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

        <h1 class="text-center mb-3">MASTER LIST</h1>

        <div class="col-12 mb-4 d-flex justify-content-start">
          <input
            type="text"
            class="form-control w-50"
            placeholder="Search program level..."
            v-model="searchQuery"
          />
        </div>
        <div
          class="col-12 card-col overflow-auto d-flex align-items-center justify-content-xl-start justify-content-center flex-wrap gap-3 p-3"
        >
          <div
            class="my-card d-flex align-items-center justify-content-center shadow-sm"
            v-for="programLevel in filteredProgramLevels"
            :key="programLevel"
            @click="enterProgramMasterList(programLevel)"
          >
            <h2>{{ programLevel }}</h2>
          </div>
          <div v-if="filteredProgramLevels.length === 0" class="text-center w-100 text-white">
            No program levels found.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

const studentsProgramLevel = ref([]);
const searchQuery = ref(""); 


const filteredProgramLevels = computed(() => {
  if (!searchQuery.value) {
    return studentsProgramLevel.value;
  }
  const query = searchQuery.value.toLowerCase();
  return studentsProgramLevel.value.filter((level) =>
    level.toLowerCase().includes(query)
  );
});

const enterProgramMasterList = (programLevel) => {
  console.log("Program Level:", programLevel);
  router.push({
    name: "AdminProgramMasterlist",
    params: {
      programlevel: programLevel,
    },
  });
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
  isLoading.value = true;
  try {
    const response = await axios.get(
      `${baseURL}/api/admin/getAllStudentProgramLevel`,
      {
        headers: {
          admintoken: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    studentsProgramLevel.value = response.data.programLevels;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error("Error fetching program levels", error);
    Swal.fire({
      title: "Error",
      text: "Failed to fetch program levels. Please try again.",
      icon: "error",
    });
  }
});

const back = async () => {
  router.back();
};
</script>

<style scoped>
.container {
  padding-top: 30px;
}

.my-card {
  height: 60px;
  width: 230px;
  background-color: white;
  border: white 2px solid;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  position: inherit;
}

.my-card:hover {
  scale: 1.06;
  border: rgb(70, 100, 24) 2px solid;
}

.btn {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 30px;
  padding-left: 30px;
  border-radius: 15px;
}
/* Existing .container-1 styles seem unused in this template, but keeping them just in case */
.container-1 {
  z-index: 999 !important;
  margin-left: 500px;
  position: relative !important;
}

/* Add some basic styling for the search input */
.form-control {
  max-width: 400px; /* Adjust as needed */
}
</style>