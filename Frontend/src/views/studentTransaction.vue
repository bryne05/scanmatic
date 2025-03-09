<script setup>
import { useRouter } from "vue-router";
import { baseURL } from "../config";
import axios from "axios";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { useShopData } from "../composables/useShopData";

const { clearStateData } = useShopData();
const router = useRouter();
const token = localStorage.getItem("studtoken");
const downloadCSV = () => {
  if (!studentTransactions.value || studentTransactions.value.length === 0) {
    Swal.fire(
      "No data to download",
      "Please ensure there is data to download.",
      "info"
    );
    return;
  }

  let csvContent = "Incentive Label,Point Value,Date,Status\n";

  studentTransactions.value.forEach((transaction) => {
    csvContent += `${transaction.item_name},${
      transaction.item_price
    },${formatDatecsv(transaction.createdAt)},${
      transaction.isVerified ? "Verified" : "Pending"
    }\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  Swal.fire({
    position: "bottom-end",
    icon: "success",
    title: "Downloaded Successfully",
    showConfirmButton: false,
    timer: 1500,
    toast: true,
    width: "350px",
    height: "auto",
  });
  link.setAttribute("download", "Claimed_Incentives.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const formatDatecsv = (dateString) => {
  if (!dateString) return "-";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" }; // Explicitly include year
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const goBack = () => {
  router.go(-1);
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
    localStorage.removeItem("studtoken");
    clearStateData();
    router.push("/");
  }
};

const studentTransactions = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get(
      `${baseURL}/api/student/getStudentTransactions`,
      {
        headers: {
          studtoken: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    studentTransactions.value = response.data.studentTransaction;
  } catch (error) {
    console.error("Error fetching student transactions:", error);
  }
});

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
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
                to="/"
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
      <h1>Claimed Incentives</h1>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr class="tr">
              <th scope="col">Incentive Label</th>

              <th scope="col">Point Value</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in studentTransactions"
              :key="transaction.createdAt"
            >
              <td>{{ transaction.item_name }}</td>

              <td>{{ transaction.item_price }}</td>
              <td>{{ formatDate(transaction.createdAt) }}</td>
              <td>{{ transaction.isVerified ? "Verified" : "Pending" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btnsyle" @click="goBack">Back</button>
      <button class="btnsyle" @click="downloadCSV">Download CSV</button>
    </div>
  </div>
</template>

<style scoped>
.btnsyle {
  margin-left: 6px;
  margin-top: 10px;
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
</style>
