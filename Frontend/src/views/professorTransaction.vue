<template>
  <navbar />

  <div class="bg">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>

    <div v-else class="container">
      <div class="row">
        <div class="col-12 text-center mb-3">
          <h1>REDEEMED INCENTIVES</h1>
          <h5>
            This page allows you to view and verify all student incentive
            redemptions across various program levels.
          </h5>
        </div>

        <div
          class="col-12 mb-4 d-flex flex-wrap justify-content-center align-items-center gap-3"
        >
          <div
            class="input-group search-bar flex-grow-1"
            style="max-width: 300px"
          >
            <input
              type="text"
              class="form-control"
              placeholder="Search by student name..."
              v-model="searchStudentName"
            />
            <span class="input-group-text">
              <i class="fas fa-user"></i>
            </span>
          </div>

          <div class="flex-grow-1" style="max-width: 200px">
            <select class="form-select" v-model="selectedProgramFilter">
              <option value="">All Programs</option>
              <option
                v-for="program in uniquePrograms"
                :key="program"
                :value="program"
              >
                {{ program }}
              </option>
            </select>
          </div>

          <div class="flex-grow-1" style="max-width: 200px">
            <select class="form-select" v-model="selectedSubjectFilter">
              <option value="">All Subjects</option>
              <option
                v-for="subject in uniqueSubjects"
                :key="subject"
                :value="subject"
              >
                {{ subject }}
              </option>
            </select>
          </div>

          <div class="d-flex gap-3 mt-2 mt-md-0">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="statusFilter"
                id="statusAll"
                value="all"
                v-model="selectedStatusFilter"
              />
              <label class="form-check-label" for="statusAll"> All </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="statusFilter"
                id="statusVerified"
                value="verified"
                v-model="selectedStatusFilter"
              />
              <label class="form-check-label" for="statusVerified">
                Verified
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="statusFilter"
                id="statusPending"
                value="pending"
                v-model="selectedStatusFilter"
              />
              <label class="form-check-label" for="statusPending">
                Pending
              </label>
            </div>
          </div>
        </div>
        <div class="col-12 text-center">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr class="tr sticky-header">
                  <th scope="col" class="text-start">STUDENT NAME</th>
                  <th scope="col">PROGRAM</th>
                  <th scope="col">SUBJECT</th>
                  <th scope="col">INCENTIVE LABEL</th>
                  <th scope="col">POINT VALUE</th>
                  <th scope="col">DATE</th>
                  <th scope="col">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="filteredAndSortedTransactions.length > 0">
                  <tr
                    v-for="transaction in filteredAndSortedTransactions"
                    :key="transaction.transaction_id || transaction.createdAt"
                  >
                    <td class="text-start">
                      {{ transaction.student.first_name }}
                      {{ transaction.student.middle_name }}
                      {{ transaction.student.last_name }}
                    </td>
                    <td>{{ transaction.student.courseYearSection }}</td>
                    <td>{{ transaction.shopitem.item_subject }}</td>
                    <td>{{ transaction.shopitem.item_name }}</td>
                    <td>{{ transaction.shopitem.item_price }}</td>
                    <td>{{ formatDate(transaction.createdAt) }}</td>
                    <td>
                      {{ transaction.isVerified ? "Verified" : "Pending" }}
                      <button
                        v-if="!transaction.isVerified"
                        @click="approveTransaction(transaction.transaction_id)"
                        class="btn btn-sm btn-success ms-2"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                </template>

                <tr v-else>
                  <td colspan="7" class="text-center text-muted py-4">
                    No matching student redemption records found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="col-12 text-center">
          <button class="btnsyle" @click="goBack">Back</button>
          <button class="btnsyle" @click="downloadCSV">Download CSV</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useShopData } from "../composables/useShopData";
import { useSubjectData } from "../composables/useSubjectData";
import navbar from "../components/professorNavBar.vue";

import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);
const { clearStateDataProfessor } = useShopData();
const { clearStateSubject } = useSubjectData();
const router = useRouter();
const professorToken = localStorage.getItem("proftoken");
const professorTransactions = ref([]); // Holds the raw fetched data (array of arrays)

// Search and Filter Refs
const searchStudentName = ref("");
const selectedSubjectFilter = ref(""); // Empty string for "All Subjects"
const selectedProgramFilter = ref(""); // NEW: Empty string for "All Programs"
const selectedStatusFilter = ref("all"); // 'all', 'verified', 'pending'

// Computed property to flatten all transactions into a single array
const allFlattenedTransactions = computed(() => {
  return professorTransactions.value ? professorTransactions.value.flat() : [];
});

// Computed property for unique subjects for the dropdown
const uniqueSubjects = computed(() => {
  const subjects = new Set();
  allFlattenedTransactions.value.forEach((transaction) => {
    if (transaction.shopitem && transaction.shopitem.item_subject) {
      subjects.add(transaction.shopitem.item_subject);
    }
  });
  return Array.from(subjects).sort();
});

// NEW: Computed property for unique programs for the dropdown
const uniquePrograms = computed(() => {
  const programs = new Set();
  allFlattenedTransactions.value.forEach((transaction) => {
    if (transaction.student && transaction.student.courseYearSection) {
      programs.add(transaction.student.courseYearSection);
    }
  });
  return Array.from(programs).sort();
});

// Combined filtered and sorted transactions
const filteredAndSortedTransactions = computed(() => {
  let result = allFlattenedTransactions.value;

  // 1. Filter by Student Name
  if (searchStudentName.value) {
    const searchLower = searchStudentName.value.toLowerCase();
    result = result.filter((transaction) => {
      const student = transaction.student;
      const fullName = `${student?.first_name || ""} ${
        student?.middle_name || ""
      } ${student?.last_name || ""}`.toLowerCase();
      return fullName.includes(searchLower);
    });
  }

  // NEW: 2. Filter by Program
  if (selectedProgramFilter.value) {
    result = result.filter(
      (transaction) =>
        transaction.student?.courseYearSection?.toLowerCase() ===
        selectedProgramFilter.value.toLowerCase()
    );
  }

  // 3. Filter by Subject
  if (selectedSubjectFilter.value) {
    result = result.filter(
      (transaction) =>
        transaction.shopitem?.item_subject?.toLowerCase() ===
        selectedSubjectFilter.value.toLowerCase()
    );
  }

  // 4. Filter by Status
  if (selectedStatusFilter.value !== "all") {
    const isVerifiedStatus = selectedStatusFilter.value === "verified";
    result = result.filter(
      (transaction) => transaction.isVerified === isVerifiedStatus
    );
  }

  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return result;
});

const downloadCSV = () => {
  const dataToDownload = filteredAndSortedTransactions.value;

  if (!dataToDownload || dataToDownload.length === 0) {
    Swal.fire(
      "No data to download",
      "Please ensure there is data to download based on your current filters.",
      "info"
    );
    return;
  }

  let csvContent =
    "First Name,Middle Name,Last Name,Program,Subject,Incentive Label,Point Value,Date,Status\n";

  dataToDownload.forEach((transaction) => {
    csvContent +=
      `"${transaction.student?.first_name || ""}",` +
      `"${transaction.student?.middle_name || ""}",` +
      `"${transaction.student?.last_name || ""}",` +
      `"${transaction.student?.courseYearSection || ""}",` +
      `"${transaction.shopitem?.item_subject || ""}",` +
      `"${transaction.shopitem?.item_name || ""}",` +
      `${transaction.shopitem?.item_price || 0},` +
      `"${formatDatecsv(transaction.createdAt)}",` +
      `"${transaction.isVerified ? "Verified" : "Pending"}"\n`;
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
  isLoading.value = true;
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
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;

    console.error("Error fetching professor transactions:", error);
    Swal.fire("Error", "Failed to fetch transactions.", "error");
    professorTransactions.value = [];
  }
};

onMounted(async () => {
  await fetchProfTransaction();
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDatecsv = (dateString) => {
  if (!dateString) return "-";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const approveTransaction = async (transactionID) => {
  try {
    const result = await Swal.fire({
      title: "Approve Incentive?",
      text: "Are you sure you want to approve this redemption?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
        isLoading.value = true;

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
        professorTransactions.value = professorTransactions.value.map(
          (transactionSet) =>
            transactionSet.map((transaction) =>
              transaction.transaction_id === transactionID
                ? { ...transaction, isVerified: true }
                : transaction
            )
        );
          isLoading.value = false;

        Swal.fire("Approved!", "The incentive has been verified.", "success");
      } else {
          isLoading.value = false;

        Swal.fire("Error!", "Failed to approve incentive.", "error");
      }
    }
  } catch (error) {
      isLoading.value = false;

    console.error("Error verifying transaction:", error);
    Swal.fire(
      "Error!",
      "An error occurred while verifying the incentive.",
      "error"
    );
  }
};


</script>

<style scoped>
.search-bar .form-control {
  border-right: none;
}
.search-bar .input-group-text {
  background-color: #f8f9fa;
  border-left: none;
  color: #495057;
  border-top-right-radius: var(--bs-border-radius);
  border-bottom-right-radius: var(--bs-border-radius);
}
.search-bar input:focus {
  border-color: #80bdff !important;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25) !important;
  outline: none !important;
}

.form-select {
  border: 1px solid #ced4da;
  border-radius: var(--bs-border-radius);
}
.form-select:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.form-check-input {
  margin-top: 0.3em;
}
.form-check-label {
  margin-left: 0.25rem;
}
.d-flex.gap-3 {
  flex-wrap: wrap;
  justify-content: center;
}

.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.container {
  padding-top: 100px;
}
.btnsyle {
  margin-left: 6px;
  margin-top: 20px;
  background-color: white;
  color: black;
  width: 335px;
  height: 44px;
  border: black 2px solid;
  border-radius: 30px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: black;
  color: white;
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

.table {
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.table-responsive {
  padding: 0;
  margin: 0;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2) !important;
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  cursor: default;
  padding: 10px;
  text-align: center;
}

.text-start {
  text-align: left !important;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}

.table-hover > tbody > tr:hover {
  background-color: #f0f0f0;
}

.table thead tr th {
  background-color: #3f51b5;
  color: #ffffff;
  font-weight: bold;
  padding: 12px;
  border-bottom: 2px solid #303f9f;
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
}

.table tbody tr td {
  border-bottom: 1px solid #ddd;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tfoot tr td,
.table tfoot tr th {
  padding: 5px;
  border-top: 2px solid #ccc;
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>
