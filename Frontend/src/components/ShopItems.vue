<script setup>
import { ring } from "ldrs";
import Swal from "sweetalert2";
import { onMounted } from "vue";
import { useShopData } from "../composables/useShopData";

ring.register();

const {
  studentData,
  filteredShopItems,
  loading,
  fetchStudentData,
  provideShopUpdate,
  buyItem,
} = useShopData();

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
  <div class="container-fluid">
    <div class="row">
      <div
        class="col-xl-6 d-flex justify-content-start align-items-center flex-column"
      >
        <div class="text">
          <h1>INCENTIVES HUB</h1>
          <h2 v-if="studentData" class="text-start">
            My Points: {{ studentData.current_token }}
          </h2>
        </div>
        <div class="claim-btn">
          <RouterLink to="/student/transaction">
            <button class="btnsyle mt-4">Claimed Incentives</button>
          </RouterLink>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="row scroll-container">
          <div
            class="col-xl-12 d-flex justify-content-start align-items-center t"
            v-for="item in filteredShopItems"
            :key="item.item_id"
          >
            <div class="card p-4">
              <div class="row">
                <div
                  class="col-2 d-flex justify-content-center align-items-center"
                >
                  <img src="../assets/Home/Idea.png" alt="idea icon" />
                </div>
                <div
                  class="col-6 d-flex align-items-start justify-content-center flex-column"
                >
                  <h5 class="card-title text-wrap">
                    {{ item.item_name }}
                  </h5>
                  <span>
                    Subject: {{ item.item_subject }} <br />
                    Instructor: {{ item.professor.first_name }}
                    {{ item.professor.middle_name }}
                    {{ item.professor.last_name }}
                  </span>
                </div>
                <div
                  class="col-4 d-flex justify-content-between align-items-end flex-column"
                >
                  <span style="color: #c14c00">
                    <b> {{ item.item_price }} Points </b>
                  </span>
                  <br />
                  <button class="btn" @click="handleBuyItem(item)">
                    Redeem Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 650px;

  max-height: 136px !important;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* Added shadow */
  overflow: hidden !important;
  margin: 10px;
  color: #464646;
}
.card .btn {
  background-color: #214280;
  color: white;
  border: #214280 1px solid;
  transition: 0.3s;
}

.card .btn:hover {
  color: #214280;
  background-color: white;
}
.card h5 {
  font-family: Outfit-bold;
  font-size: 20px;
}

.card span {
  font-family: Outfit-regular;
  font-size: 15px;
}
.btnsyle {
  background-color: black;
  color: white;
  width: 335px;
  height: 44px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
  margin: 3px;
  border: black 2px solid;
}
.text {
  margin-top: 100px;
  color: black;
  font-family: Outfit-regular;
}

.scroll-container {
  max-height: 700px;
  overflow-y: auto;
}
@media (max-height: 800px) {
  .scroll-container {
    max-height: 400px;
  }
}
@media (max-width: 1354px) {
  .card {
    max-width: 45vw;
  }
}

@media (max-width: 1200px) {
  .claim-btn {
    display: none;
  }

  .card {
    max-width: 700px;
  }

  .text {
    display: inline-block;
    margin: 0;
  }
  .t {
    justify-content: center !important;
  }

  .scroll-container {
    max-height: 500px;
  }
}

@media (max-width: 680px) {
  .card {
    max-width: 400px;
  }
}
</style>
