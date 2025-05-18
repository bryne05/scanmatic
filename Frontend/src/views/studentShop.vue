<script setup>
import { useRouter } from "vue-router";
import { useShopData } from "../composables/useShopData";

import ShopItems from "../components/ShopItems.vue";
import navbar from "../components/studentNavBar.vue";
const { clearStateData, fetchStudentData } = useShopData();
const router = useRouter();
</script>

<template>
  <div
    :style="{
      backgroundColor: '#c7c7c7',
      fontFamily: 'Outfit-Regular',
      minHeight: '100vh',
    }"
  >
    <navbar />

    <div class="text">
      <ShopItems />

      <div class="claim-btn d-flex justify-content-center align-items-center">
        <RouterLink to="/student/transaction">
          <button class="btnsyle mt-4">Claimed Incentives</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
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
.text {
  margin-top: 100px !important;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
}
@media (min-width: 1200px) {
  .claim-btn {
    display: none !important;
  }
}
</style>
