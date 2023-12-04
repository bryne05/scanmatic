<!-- ShopItems.vue -->
<template>
  <div class="mt-5 text">
    <h2 v-if="studentData" class="text-start">
      My Token: {{ studentData.current_token }}
    </h2>
  </div>
  <div>
    <h2>Shop Items</h2>
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
              Price: {{ item.item_price }} Tokens <br>
              Creator: {{ item.professor.first_name }} {{ item.professor.middle_name }} {{ item.professor.last_name }}
            </p>
            <!-- Add Buy button -->
            <button class="btn btn-primary" @click="buyItem(item)">Buy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import { ref, onMounted } from "vue";

const studentData = ref(null);
const filteredShopItems = ref([]);

const token = localStorage.getItem("studtoken");

const buyItem = async (item) => {
  try {
    const result = await Swal.fire({
      title: "Do you want to buy this item?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const itemId = item.item_id;
      const buyItems = await axios.post(
        `http://localhost:5000/api/student/buyStudentShopItems/${itemId}`,
        {},
        {
          headers: {
            studtoken: `${token}`,
          },
        }
      );

      if (buyItems.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Purchased Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        const updatedShopItems = await axios.get(
          "http://localhost:5000/api/student/getStudentShopItems/",
          {
            headers: {
              studtoken: `${token}`,
            },
          }
        );
        filteredShopItems.value = updatedShopItems.data.filteredShopItems;

        const getStudent = await axios.get(
          "http://localhost:5000/api/student/getStudent/",
          {
            headers: {
              studtoken: `${token}`,
            },
          }
        );
        studentData.value = getStudent.data;
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Insufficient Token",
      showConfirmButton: false,
      timer: 1500,
    });
    console.log("error purchase");
    console.error(error);
  }
};

onMounted(async () => {
  try {
    const getStudent = await axios.get(
      "http://localhost:5000/api/student/getStudent/",
      {
        headers: {
          studtoken: `${token}`,
        },
      }
    );
    studentData.value = getStudent.data;
    const getShopItems = await axios.get(
      "http://localhost:5000/api/student/getStudentShopItems/",
      {
        headers: {
          studtoken: `${token}`,
        },
      }
    );
    filteredShopItems.value = getShopItems.data.filteredShopItems;
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
