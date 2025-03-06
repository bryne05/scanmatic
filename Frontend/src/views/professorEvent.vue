<!-- professor.vue -->
<script setup>
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import ProfEvent from "../components/ProfessorEvents.vue";
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
  <div>
    <div class="pos">
      <nav class="navbar navbar-expand bg-light inv">
        <a class="navbar-brand left">ScanMatic</a>
        <div>
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr active" to="/professor">
                Class
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr" to="/professor/shop">
                Incentives
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr" to="/professor/profile">
                Profile
              </RouterLink>
            </li>
   <li class="nav-item">
              <RouterLink class="nav-link pointer curr" to="/professor/event">
                Events
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
  </div>

  <div class="mt-2 text">
    <h2 class="text">Events</h2>
    <ProfEvent />
  </div>
</template>

<style scoped>
.text {
  margin-top: 50px;
  color: white;
}
</style>
