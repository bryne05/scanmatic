<template>
  <div v-if="loading || isLoading" class="loading-overlay">
    <moon-loader :loading="loading || isLoading" color="white" size="150px" />
  </div>

  <div v-else class="container">
    <div class="row">
      <div class="col-xl-6 col-12 text-xl-start text-center text">
        <h1>INCENTIVES CATALOG</h1>
        <h5>
          Manage your incentives here: create, update, or delete them. Each
          incentive is unique to its subject and program level.
        </h5>
      </div>
      <div class="col-xl-6 col-12 text-xl-end text-center">
        <button
          class="btnsyle mb-3"
          data-bs-toggle="modal"
          data-bs-target="#addItem"
        >
          Add Incentive
        </button>
      </div>

      <div
        class="col-12 d-flex flex-wrap justify-content-center justify-content-xl-start align-items-center gap-3 mb-3"
      >
        <div class="int search flex-grow-1" style="max-width: 350px">
          <img src="../assets/Prof-Class/search.png" alt="search icon" />
          <input
            type="text"
            class="form-control search"
            placeholder="Search Incentive Label..."
            v-model="searchQuery"
          />
        </div>

        <div class="flex-grow-1" style="max-width: 200px">
          <select
            class="form-select cus-border"
            v-model="selectedFilterSubject"
          >
            <option value="">All Subjects</option>
            <option
              v-for="subject in uniqueFilterSubjects"
              :key="subject"
              :value="subject"
            >
              {{ subject }}
            </option>
          </select>
        </div>

        <div class="flex-grow-1" style="max-width: 200px">
          <select
            class="form-select cus-border"
            v-model="selectedFilterProgram"
          >
            <option value="">All Programs</option>
            <option
              v-for="program in uniqueFilterPrograms"
              :key="program"
              :value="program"
            >
              {{ program }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12">
        <div class="table-responsive text-center tab">
          <table class="table table-striped table-hover icons">
            <thead class="sticky-header">
              <tr style="font-family: Outfit-bold">
                <th>INCENTIVE LABEL</th>
                <th>SUBJECT</th>
                <th>PROGRAM LEVEL</th>
                <th>QUANTITY</th>
                <th>POINT VALUE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredShopItems" :key="item.item_id">
                <td class="text-start">{{ item.item_name }}</td>
                <td>{{ item.item_subject }}</td>
                <td>{{ item.item_classSection }}</td>
                <td>{{ item.item_quantity }}</td>
                <td>{{ item.item_price }} Points</td>

                <td
                  class="d-flex gap-2 justify-content-center align-items-center"
                >
                  <img
                    data-bs-toggle="modal"
                    data-bs-target="#updateItem"
                    @click="setUpdateItemData(item)"
                    src="../assets/Prof-Class/create.png"
                    alt="update icon"
                  />
                  <img
                    @click="deleteItem(item)"
                    src="../assets/Prof-Class/Delete.png"
                    alt="delete icon"
                  />
                </td>
              </tr>
              <tr v-if="!filteredShopItems || filteredShopItems.length === 0">
                <td colspan="6" class="text-center">
                  {{
                    searchQuery ||
                    selectedFilterSubject ||
                    selectedFilterProgram
                      ? "No matching items found."
                      : "No shop items available."
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-12 d-flex justify-content-center align-items-center">
        <RouterLink to="/professor/shop/Transaction">
          <button class="btnsyle mt-4">Students Incentives Log</button>
        </RouterLink>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="addItem"
    tabindex="-1"
    aria-labelledby="addCategory"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      style="color: black"
    >
      <div class="modal-content">
        <form>
          <div class="modal-header">
            <h5 class="modal-title" id="addItem">Add Incentive</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12">
              <label class="form-label fw-bold inv">Incentive Label</label>
              <input
                v-model="itemName"
                type="text"
                class="form-control cus-border"
                placeholder="Enter item Name"
              />

              <label class="form-label fw-bold inv">Quantity</label>
              <input
                v-model="quantity"
                type="number"
                class="form-control cus-border"
                placeholder="Enter quantity of the incentive"
              />

              <label class="form-label fw-bold inv">Point value</label>

              <input
                v-model="price"
                type="number"
                class="form-control cus-border"
                placeholder="Enter the point value for this incentive"
              />

              <label class="form-label fw-bold inv">Subject Name</label><br />
              <select class="form-control cus-border" v-model="selectedSubject">
                <option value="">Choose...</option>
                <option
                  v-for="subject in professorSubject"
                  :key="subject.subject_name"
                  :value="subject.subject_name"
                >
                  {{ subject.subject_name }}
                </option>
              </select>

              <label class="form-label fw-bold inv">Program Level</label>

              <input
                v-model="courseYear"
                type="text"
                class="form-control cus-border"
                placeholder="Enter Program Level for this incentive: Ex BSCS 4A,STEM 11A"
              />
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="addItem">
              Add item
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div
    class="modal fade"
    id="updateItem"
    tabindex="-1"
    aria-labelledby="addCategory"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      style="color: black"
    >
      <div class="modal-content">
        <form>
          <div class="modal-header">
            <h5 class="modal-title" id="updateItem">Update Incentive</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h6 style="color: gray">
              <i
                >"Leave it blank if you don't want to update certain details"</i
              >
            </h6>
            <div class="col-md-12">
              <label class="form-label fw-bold inv">Incentive Label</label>
              <input
                v-model="updateitemName"
                type="text"
                class="form-control cus-border"
                placeholder="Enter new name for this item"
              />

              <label class="form-label fw-bold inv">Quantity</label>
              <input
                v-model="updatequantity"
                type="number"
                class="form-control cus-border"
                placeholder="Enter new quantity for this incentive"
              />

              <label class="form-label fw-bold inv">Point Value</label>

              <input
                v-model="updateprice"
                type="number"
                class="form-control cus-border"
                placeholder="Enter new the price for this incentive"
              />
              <label class="form-label fw-bold inv">Subject Name</label><br />
              <select class="form-control cus-border" v-model="updatesubject">
                <option value="">Choose...</option>
                <option
                  v-for="subject in professorSubject"
                  :key="subject.subject_name"
                  :value="subject.subject_name"
                >
                  {{ subject.subject_name }}
                </option>
              </select>
              <label class="form-label fw-bold inv">Program Level</label>

              <input
                v-model="updatecourseYear"
                type="text"
                class="form-control cus-border"
                placeholder="Enter new Program Level for this icentive: Ex BSCS 4A,BSIT 3B"
              />
              <input type="hidden" v-model="currentItemId" />
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="updateItem">
              Update Incentive
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import { useShopData } from "../composables/useShopData";
import { useRouter } from "vue-router";

import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);

const { professorShopItems, loading, refreshAllData } = useShopData();

const proftoken = localStorage.getItem("proftoken");

const searchQuery = ref("");

const selectedFilterSubject = ref("");
const selectedFilterProgram = ref("");

// Default sorting to latest created incentive (by item_id descending)
// No need for sortColumn and sortDirection refs if not exposing sorting UI.
// We will directly apply this sort in filteredShopItems.
const defaultSortColumn = "item_id";
const defaultSortDirection = "desc";

// Computed property for unique subjects for the *table filter* dropdown
const uniqueFilterSubjects = computed(() => {
  const subjects = new Set();
  professorShopItems.value.forEach((item) => {
    if (item.item_subject) {
      subjects.add(item.item_subject);
    }
  });
  return Array.from(subjects).sort();
});

// Computed property for unique program levels for the *table filter* dropdown
const uniqueFilterPrograms = computed(() => {
  const programs = new Set();
  professorShopItems.value.forEach((item) => {
    if (item.item_classSection) {
      programs.add(item.item_classSection);
    }
  });
  return Array.from(programs).sort();
});

// Combined filtered and sorted items
const filteredShopItems = computed(() => {
  let items = professorShopItems.value;

  // 1. Apply Search Query Filter
  if (searchQuery.value) {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    items = items.filter((item) => {
      const matchesName = item.item_name.toLowerCase().includes(lowerCaseQuery);
      const matchesSubject = item.item_subject
        .toLowerCase()
        .includes(lowerCaseQuery);
      const matchesProgramLevel = item.item_classSection
        .toLowerCase()
        .includes(lowerCaseQuery);
      return matchesName || matchesSubject || matchesProgramLevel;
    });
  }

  // 2. Apply Subject Filter
  if (selectedFilterSubject.value) {
    items = items.filter(
      (item) => item.item_subject === selectedFilterSubject.value
    );
  }

  // 3. Apply Program Level Filter
  if (selectedFilterProgram.value) {
    items = items.filter(
      (item) => item.item_classSection === selectedFilterProgram.value
    );
  }

  // 4. Apply Default Sorting (Latest Created Incentive)
  items.sort((a, b) => {
    let valA = a[defaultSortColumn];
    let valB = b[defaultSortColumn];

    // Ensure numerical comparison for item_id
    valA = Number(valA);
    valB = Number(valB);

    if (valA < valB) return defaultSortDirection === "asc" ? -1 : 1;
    if (valA > valB) return defaultSortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return items;
});

// Removed sortTable function as it's no longer needed for UI-driven sorting.

//CurrentItem (for update modal)
const currentItemId = ref(null);
const currentItemName = ref(null);
const currentQuantity = ref(null);
const currentPrice = ref(null);
const currentCourseYear = ref(null);
const currentSubject = ref(null);

// Professor's subjects (for add/update modals)
const professorSubject = ref([]);

//AddShop (for add modal inputs)
const itemName = ref("");
const quantity = ref("");
const price = ref("");
const courseYear = ref("");
const selectedSubject = ref(""); // for add modal dropdown

//UpdateShop (for update modal inputs)
const updateitemName = ref("");
const updatequantity = ref("");
const updateprice = ref("");
const updatecourseYear = ref("");
const updatesubject = ref(""); // for update modal dropdown

const setUpdateItemData = (item) => {
  currentItemId.value = item.item_id;
  updateitemName.value = item.item_name; // Prefill update fields with current data
  updatequantity.value = item.item_quantity;
  updateprice.value = item.item_price;
  updatecourseYear.value = item.item_classSection;
  updatesubject.value = item.item_subject; // *** IMPORTANT: Prefill subject in update modal ***
};

const fetchSubjects = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${baseURL}/api/professor/getAllSubject`, {
      headers: {
        proftoken: `${proftoken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    });
    const subjects = response.data.subject;

    const uniqueSubjectsMap = new Map();
    subjects.forEach((subject) => {
      if (!uniqueSubjectsMap.has(subject.subject_name)) {
        uniqueSubjectsMap.set(subject.subject_name, subject);
      }
    });
    const uniqueAndSortedSubjects = Array.from(uniqueSubjectsMap.values()).sort(
      (a, b) => {
        const nameA = a.subject_name.toLowerCase();
        const nameB = b.subject_name.toLowerCase();

        const partsA = nameA.match(/([a-z]+|\d+)/g);
        const partsB = nameB.match(/([a-z]+|\d+)/g);

        if (!partsA || !partsB) {
          return nameA.localeCompare(nameB);
        }

        for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
          const partA = partsA[i];
          const partB = partsB[i];

          const numA = Number(partA);
          const numB = Number(partB);

          if (!isNaN(numA) && !isNaN(numB)) {
            if (numA !== numB) {
              return numA - numB;
            }
          } else if (!isNaN(numA)) {
            return -1;
          } else if (!isNaN(numB)) {
            return 1;
          } else {
            const comparison = partA.localeCompare(partB);
            if (comparison !== 0) {
              return comparison;
            }
          }
        }
        return partsA.length - partsB.length;
      }
    );

    professorSubject.value = uniqueAndSortedSubjects;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error("Error getting subjects:", error);
    Swal.fire("Error", "Failed to fetch subjects", "error");
  }
};

const updateItem = async () => {
  const confirmationResult = await Swal.fire({
    title: "Update incentive",
    text: "Are you sure you want to update this incentive?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    isLoading.value = true;
    try {
      const updatedData = {
        item_name: updateitemName.value, // Use the update refs directly
        item_quantity: updatequantity.value,
        item_price: updateprice.value,
        item_classSection: updatecourseYear.value,
        item_subject: updatesubject.value,
      };

      const response = await axios.put(
        `${baseURL}/api/professor/updateProfessorShopItem/${currentItemId.value}`,
        updatedData,
        {
          headers: {
            proftoken: proftoken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      if (response.status === 200) {
        await refreshAllData(); // Refresh the main shop items list
        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "Incentive updated successfully",
          icon: "success",
        });

        // Optionally clear update form fields or close modal
        // (Modal closing is usually handled by Bootstrap's data-bs-dismiss if needed)
      } else {
        isLoading.value = false;
        Swal.fire({
          title: "Error",
          text: "Failed to update incentive",
          icon: "error",
        });
      }
    } catch (error) {
      isLoading.value = false;
      console.error("Error updating shop item:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating incentive",
        icon: "error",
      });
    }
  }
};

const addItem = async () => {
  if (
    !itemName.value ||
    !quantity.value ||
    !price.value ||
    !courseYear.value ||
    !selectedSubject.value
  ) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }
  isLoading.value = true;
  try {
    const response = await axios.post(
      `${baseURL}/api/professor/createItems/`,
      {
        item_name: itemName.value,
        item_quantity: quantity.value,
        item_price: price.value,
        item_classSection: courseYear.value,
        item_subject: selectedSubject.value,
      },
      {
        headers: {
          proftoken: proftoken,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    if (response.status === 200) {
      await refreshAllData(); // Refresh the main shop items list
      isLoading.value = false;
      Swal.fire("Success", "Incentive added successfully!", "success");

      // Clear form fields
      itemName.value = "";
      quantity.value = "";
      price.value = "";
      courseYear.value = "";
      selectedSubject.value = ""; // Clear subject selection
    } else {
      isLoading.value = false;
      Swal.fire("Error", "Failed to add incentive", "error");
    }
  } catch (error) {
    isLoading.value = false;
    console.error("Error adding item:", error);
    Swal.fire("Error", "An error occurred", "error");
  }
};

const deleteItem = async (item) => {
  const itemId = item.item_id;
  const confirmationResult = await Swal.fire({
    title: "Delete Incentive",
    text: "Are you sure you want to delete this incentive?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    isLoading.value = true;
    try {
      const response = await axios.delete(
        `${baseURL}/api/professor/deleteProfessorShopItem/${itemId}`,
        {
          headers: {
            proftoken: proftoken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (response.status === 200) {
        await refreshAllData(); // Refresh the main shop items list
        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "Incentive Deleted successfully",
          icon: "success",
        });
      } else {
        isLoading.value = false;
        Swal.fire({
          title: "Error",
          text: "Failed to delete incentive",
          icon: "error",
        });
      }
    } catch (error) {
      isLoading.value = false;
      console.error("Error deleting shop item:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting incentive",
        icon: "error",
      });
    }
  }
};

onMounted(() => {
  refreshAllData(); // Fetch initial shop items
  fetchSubjects(); // Fetch subjects for modal dropdowns
});
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

.container {
  padding-top: 100px;
}
.subject-selector {
  background-color: white;
}
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.text {
  color: #464646;
  margin-bottom: 40px;
}
.text h1 {
  font-weight: bold;
  letter-spacing: 2px;
  font-family: Outfit-bold;
}
.table {
  margin: 0;
}
.table thead {
  background-color: rgb(16, 118, 16) !important;
  color: white;
}
.table th {
  color: white;
  cursor: default; /* Changed from pointer as sorting is removed */
  position: relative;
}
/* Removed sorting icon styles as sorting UI is removed */

.table-responsive {
  padding: 0;
  margin: 0;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2) !important;
}
table {
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2) !important;
}
.scroll-container {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}
.int {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 2px;
  border-radius: 8px;
  gap: 3px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}
.int img {
  margin-left: 10px;
  width: 25px;
  height: 25px;
}

.search {
  border: none;
}
.icons img {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: 0.3s;
}
.icons img:hover {
  transform: scale(1.2);
}

.search input:focus {
  border-color: none !important;
  box-shadow: none;
  outline: none !important;
}

.search input {
  font-size: 18px;
}

th,
tr {
  cursor: default;
}
.table th {
  background-color: #222831;
}
.table tr td,
.table tr th {
  padding: 13px;
  margin: 0;
}
.table thead tr th {
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
}
.btnsyle {
  background-color: white;
  color: black;
  width: 260px;
  height: 50px;
  border: black 2px solid;
  border-radius: 16px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: black;
  color: white;
}

.tab {
  max-height: 500px !important;
}

.form-select.cus-border {
  border: 1px solid #ced4da;
  border-radius: 0.375rem; /* Bootstrap's default radius */
  padding: 0.375rem 2.25rem 0.375rem 0.75rem; /* Standard Bootstrap padding */
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
}

@media (max-height: 800px) {
  .scroll-container {
    max-height: 400px;
  }
}
</style>
