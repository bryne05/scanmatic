<template>
  <div class="bg">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>
    <div class="container">
      <div class="row">
        <div class="col-6">
          <button class="btn-return" @click="back">
            <img src="../assets/return.png" alt="" width="28" height="40" />
          </button>
        </div>
        <div class="col-6 text-end">
          <button type="button" class="logout btn btn-danger" @click="logout">
            Logout
          </button>
        </div>
        <h1 class="text-center mb-4">Settings</h1>
      </div>

      <div class="row">
        <div class="col-xl-6 col-12">
          <h3>Current Level Threshold: {{ levelThreshold }}</h3>
        </div>
        <div
          class="col-xl-6 col-12 d-flex justify-content-start gap-2 align-items-center"
        >
          <label for="level-threshold"><b>Level Threshold</b></label>
          <input
            type="number"
            class="form-control"
            id="level-threshold"
            v-model="newlevelThreshold"
            placeholder="set new level threshold"
          />

          <button class="btn btn-primary" @click="updateLevelThreshold">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios";
const router = useRouter();
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);
const token = localStorage.getItem("admintoken");
const newlevelThreshold = ref("");
const levelThreshold = ref("");

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

const updateLevelThreshold = async () => {
  try {
    const confirmationResult = await Swal.fire({
      title: "Update Level Threshold",
      text: "Are you sure you want to update the level threshold?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (confirmationResult.isConfirmed) {
      isLoading.value = true;
      const response = await axios.put(
        `${baseURL}/api/admin/updateLevelThreshold`,
        { level_threshold: newlevelThreshold.value },
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
          title: "Success",
          text: "Level Threshold updated successfully",
          icon: "success",
        });

        levelThreshold.value = newlevelThreshold.value;
        newlevelThreshold.value = "";
      }
    }
  } catch (error) {
    isLoading.value = false;
    console.error("Error updating level threshold:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to update level threshold. Please try again.",
      icon: "error",
    });
  }
};

const fetchLevelThreshold = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${baseURL}/api/admin/getLevelThreshold`, {
      headers: {
        admintoken: `${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    });

    levelThreshold.value = response.data.level_threshold;
    console.log(levelThreshold.value);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error("Error fetching professor", error);
  }
};

onMounted(async () => {
  try {
    await fetchLevelThreshold();
  } catch (error) {
    console.error("Error", error);
  }
});

const back = async () => {
  router.back();
};
</script>
<style scoped>
.form-control {
  width: 300px !important;
}
.btn {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 30px;
  padding-left: 30px;
  border-radius: 15px;
}
label {
  font-size: 20px !important;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.container {
  padding-top: 30px;
}
</style>
