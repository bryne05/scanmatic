<!-- ShopItems.vue -->
<template>
  <div class="mt-5 text">
    <h2 v-if="studentData" class="text-start">
      My Points: {{ studentData.current_token }}
    </h2>
  </div>
  <div>
    <h2>Incentives Hub</h2>

    <div
      class="row scroll-container"
      :style="{ width: filteredShopItems.length <= 2 ? '80vw' : 'auto' }"
    >
      <div
        class="col-md-4 col-sm-6 mt-3"
        v-for="item in filteredShopItems"
        :key="item.item_id"
      >
        <div class="card h-100 w-100">
          <div class="card-body">
            <h5 class="card-title">{{ item.item_name }}</h5>
            <p class="card-text">
              Quantity: {{ item.item_quantity }}<br />
              Point Value: {{ item.item_price }} Points <br />
              Creator: {{ item.professor.first_name }}
              {{ item.professor.middle_name }} {{ item.professor.last_name }}
            </p>
            <!-- Add Buy button -->
            <button class="btn btn-primary" @click="buyItem(item)">
              Redeem
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ring } from "ldrs";

ring.register();

import axios from "axios";
import Swal from "sweetalert2";
import { baseURL } from "../config";
import { ref, onMounted } from "vue";

const loading = ref(false);
const studentData = ref(null);
const filteredShopItems = ref([]);

const token = localStorage.getItem("studtoken");

const buyItem = async (item) => {
  try {
    const result = await Swal.fire({
      title: "Would you like to redeem this incentive?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      loading.value = true;
      const itemId = item.item_id;
      const buyItems = await axios.post(
        `${baseURL}/api/student/buyStudentShopItems/${itemId}`,
        {},
        {
          headers: {
            studtoken: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      loading.value = false;
      if (buyItems.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Redeemed Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        loading.value = true;
        const updatedShopItems = await axios.get(
          `${baseURL}/api/student/getStudentShopItems/`,
          {
            headers: {
              studtoken: `${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        filteredShopItems.value = updatedShopItems.data.filteredShopItems;
        loading.value = false;
        const getStudent = await axios.get(
          `${baseURL}/api/student/getStudent/`,
          {
            headers: {
              studtoken: `${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        studentData.value = getStudent.data;

        loading.value = false;
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Insufficient Points",
      showConfirmButton: false,
      timer: 1500,
    });
    loading.value = false;
    console.log("error purchase");
    console.error(error);
  }
};

onMounted(async () => {
  try {
    loading.value = true;

    const getStudent = await axios.get(`${baseURL}/api/student/getStudent/`, {
      headers: {
        studtoken: `${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    });
    studentData.value = getStudent.data;

    const getShopItems = await axios.get(
      `${baseURL}/api/student/getStudentShopItems/`,
      {
        headers: {
          studtoken: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    filteredShopItems.value = getShopItems.data.filteredShopItems;
    loading.value = false;
  } catch (error) {
    console.error("Error getting data:", error);
  }
});
</script>

<style scoped>
.text {
  margin-top: 100px;
  color: white;
}

.scroll-container {
  max-height: 600px;
  overflow-y: auto;
}
@media (max-height: 800px) {
  .scroll-container {
    max-height: 400px;
  }
}
</style>
