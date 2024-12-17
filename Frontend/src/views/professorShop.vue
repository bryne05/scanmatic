<!-- professorShop.vue -->
<script setup>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

import ProfItems from "../components/ProfessorShopItems.vue";
import { useShopData } from "../composables/useShopData";
import { useSubjectData } from "../composables/useSubjectData";

const { clearStateDataProfessor } = useShopData();
const { clearStateSubject } = useSubjectData();
const router = useRouter();

const logout = async () => {
  const result = await Swal.fire({
    title: "Do you want to log out?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("proftoken");
    clearStateDataProfessor();
    clearStateSubject();
    router.push("/ZXNzb3IiLCJVfrvonD");
  }
};
</script>
<template>
  <div class="pos">
    <nav class="navbar navbar-expand bg-light inv">
      <a class="navbar-brand left">ScanMatic</a>
      <div>
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link pointer curr" to="/professor">
              Class
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link pointer curr active"
              to="/professor/shop"
            >
              Incentives
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link pointer curr" to="/professor/profile">
              Profile
            </RouterLink>
          </li>

          <li class="nav-item">
            <a
              class="nav-link pointer curr"
              to="/ZXNzb3IiLCJVfrvonD"
              style="color: red"
              @click="logout"
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
  <div class="mt-2 text">
    <h2 class="text">My Incentives Inventory</h2>
    <ProfItems />

    <RouterLink to="/professorTransaction">
      <button class="btnsyle mt-4">Students Incentives Log</button>
    </RouterLink>
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
