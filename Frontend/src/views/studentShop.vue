<script setup>
import { useRouter } from "vue-router";
import { useShopData } from "../composables/useShopData";
import Swal from "sweetalert2";
import ShopItems from '../components/ShopItems.vue';

const { clearStateData, fetchStudentData } = useShopData();
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
    localStorage.removeItem("studtoken");

    // Clear the student data and re-fetch
    clearStateData();
    

    router.push("/"); // Redirect to home or login
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
              <RouterLink class="nav-link pointer curr" to="/student">
                Qr Code
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                class="nav-link pointer curr active"
                to="/student/shop"
              >
                Incentives
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link pointer curr" to="/student/profile">
                Profile
              </RouterLink>
            </li>

            <li class="nav-item">
              <a
                class="nav-link pointer curr"
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

  <div class="mt-5 text">
    <div class="scroll-container">
      <ShopItems />
    </div>
    <RouterLink to="/student/transaction">
      <button class="btnsyle mt-4">Claimed Incentives</button>
    </RouterLink>
  </div>
</template>

<style scoped>
.text {
  margin-top: 100px;
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
