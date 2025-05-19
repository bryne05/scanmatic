<script setup>
import { useRouter } from "vue-router";
import { baseURL } from "../config";
import axios from "axios";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { useShopData } from "../composables/useShopData";
import navbar from "../components/studentNavBar.vue";
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
    <navbar />
    <div
     class="bg-2"
    >
      <div class="container cont">
        <div class="row">
          <div class="col-12 text-center"><h1>Claimed Incentives</h1></div>
          <div class="col-12 text-center">
            <div
              class="table-responsive bg-t d-flex justify-content-center align-items-center"
            >
              <table class="table">
                <thead>
                  <tr class="tr">
                    <th scope="col">INCENTIVE LABEL</th>

                    <th scope="col">POINT VALUE</th>
                    <th scope="col">DATE</th>
                    <th scope="col">STATUS</th>
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
                    <td>
                      {{ transaction.isVerified ? "Verified" : "Pending" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-12">
              <button class="btnsyle" @click="goBack">Back</button>
              <button class="btnsyle" @click="downloadCSV">Download CSV</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btnsyle {
  margin-left: 6px;
  margin-top: 10px;
  background-color: black;
  color: white;
  width: 335px;
  height: 44px;
  border: black 2px solid;
  border-radius: 30px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: white;
  color: black;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
}
.text {
  max-width: 60vw;
  max-height: 650px;
  overflow-y: auto;
  margin-top: 50px;
  color: white;
}
.tr {
  position: relative;
  font-size: 20px;
  font-family: Outfit-Bold;
}
td {
  color: rgb(41, 41, 41) !important;
  font-family: Outfit-regular;
  font-size: 16px;
}

.bg-t {
  background-color: white;
  padding: 15px 15px 0px 15px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
}
.cont {
  padding-top: 100px;
}

.table-responsive {
  margin: 10px;
}
</style>
