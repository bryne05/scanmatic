<!-- professorShop.vue -->
<script setup>
import { useRouter } from "vue-router";

import ProfItems from "../components/ProfessorShopItems.vue";
import navbar from "../components/professorNavBar.vue";

const router = useRouter();
</script>
<template>
  <navbar />
  <div class="bg">
    <ProfItems />
  </div>
</template>

<style scoped>
.text {
  margin-top: 50px;
  color: white;
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
</style>
