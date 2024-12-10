<script setup>
import { ring } from "ldrs";
import Swal from "sweetalert2";
import { onMounted } from "vue";
import { useShopData } from '../composables/useShopData';

ring.register();

const { studentData, filteredShopItems, loading, fetchStudentData, provideShopUpdate, buyItem } = useShopData();

// Register the update callback
provideShopUpdate(() => {
  fetchStudentData();
});

const handleBuyItem = async (item) => {
  try {
    const result = await Swal.fire({
      title: "Would you like to redeem this incentive?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const success = await buyItem(item);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Redeemed Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Insufficient Points",
      showConfirmButton: false,
      timer: 1500,
    });
    console.error(error);
  }
};

onMounted(() => {
  fetchStudentData();
});

</script>

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
            <button class="btn btn-primary" @click="handleBuyItem(item)">
              Redeem
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


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
