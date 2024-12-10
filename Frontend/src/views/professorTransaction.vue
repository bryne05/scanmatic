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

  <div class="text">
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr class="tr">
            <th scope="col">First Name</th>
            <th scope="col">Middle Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Incentive Label</th>
            <th scope="col">Point Value</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="transactionSet in professorTransactions">
            <tr
              v-for="transaction in transactionSet"
              :key="transaction.createdAt"
            >
              <td>{{ transaction.student.first_name }}</td>
              <td>{{ transaction.student.middle_name }}</td>
              <td>{{ transaction.student.last_name }}</td>
              <td>{{ transaction.shopitem.item_name }}</td>
              <td>{{ transaction.shopitem.item_price }}</td>
              <td>{{ formatDate(transaction.createdAt) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const professorToken = localStorage.getItem("proftoken");
const professorTransactions = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get(
      `${baseURL}/api/professor/getProfessorTransaction/`,
      {
        headers: {
          proftoken: professorToken,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    professorTransactions.value = response.data.filteredShopTransactions;
  } catch (error) {
    console.error("Error fetching professor transactions:", error);
  }
});

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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
    router.push("/ZXNzb3IiLCJVfrvonD");
  }
};
</script>

<style scoped>
.text {
  max-width: fit-content;
  max-height: 650px;
  overflow-y: auto;
  margin-top: 50px;
  color: white;
}
.tr {
  position: relative;
}

@media (max-width: 550px) {
  .text {
    max-width: 270px;
    overflow-x: auto;
  }
}

@media (max-height: 720px) {
  .text {
    max-height: 550px;
  }
}
</style>
