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

  <div class="text">
    <h1>Student Redeemed Incentives</h1>
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
            <th scope="col">Status</th>
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
              <td>
                {{ transaction.isVerified ? "Verified" : "Pending" }}
                <button
                  v-if="!transaction.isVerified"
                  @click="approveTransaction(transaction.transaction_id)"
                >
                  Approve
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <button class="btnsyle" @click="goBack">Back</button>
    <button class="btnsyle" @click="downloadCSV">Download CSV</button>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useShopData } from "../composables/useShopData";
import { useSubjectData } from "../composables/useSubjectData";

const { clearStateDataProfessor } = useShopData();
const { clearStateSubject } = useSubjectData();
const router = useRouter();
const professorToken = localStorage.getItem("proftoken");
const professorTransactions = ref([]);

const downloadCSV = () => {
  if (
    !professorTransactions.value ||
    professorTransactions.value.length === 0
  ) {
    Swal.fire(
      "No data to download",
      "Please ensure there is data to download.",
      "info"
    );
    return;
  }

  let csvContent =
    "First Name,Middle Name,Last Name,Incentive Label,Point Value,Date,Date,Status\n";

  professorTransactions.value.forEach((transactionSet) => {
    transactionSet.forEach((transaction) => {
      csvContent += `${transaction.student.first_name},${
        transaction.student.middle_name
      },${transaction.student.last_name},${transaction.shopitem.item_name},${
        transaction.shopitem.item_price
      },${formatDatecsv(transaction.createdAt)},${
        transaction.isVerified ? "Verified" : "Pending"
      }\n`;
    });
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
  link.setAttribute("download", "student_redeemed_incentives.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const goBack = () => {
  router.go(-1);
};

const fetchProfTransaction = async () => {
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
};

onMounted(async () => {
  try {
    await fetchProfTransaction();
  } catch (error) {
    console.error("Error fetching professor transactions:", error);
  }
});

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDatecsv = (dateString) => {
  if (!dateString) return "-";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" }; // Explicitly include year
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const approveTransaction = async (transactionID) => {
  try {
    const approve = await axios.put(
      `${baseURL}/api/professor/verifyTransaction`,
      { transaction_id: transactionID },
      {
        headers: {
          proftoken: professorToken,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    if (approve.status === 200) {
      // Update the local state without refetching
      professorTransactions.value = professorTransactions.value.map(
        (transactionSet) =>
          transactionSet.map((transaction) =>
            transaction.transaction_id === transactionID
              ? { ...transaction, isVerified: true }
              : transaction
          )
      );
    }
  } catch (error) {
    console.error("Error verifying transaction:", error);
  }
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
    clearStateDataProfessor();
    clearStateSubject();
    router.push("/ZXNzb3IiLCJVfrvonD");
  }
};
</script>

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
