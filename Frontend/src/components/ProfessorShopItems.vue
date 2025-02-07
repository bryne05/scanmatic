<!-- ProfessorShopItems.vue -->
<template>
  <div>
    <button
      class="btnsyle mb-3"
      data-bs-toggle="modal"
      data-bs-target="#addItem"
    >
      Add Incentive
    </button>
    <div
      class="row scroll-container"
      :style="{ width: professorShopItems.length <= 2 ? '80vw' : 'auto' }"
    >
      <div
        class="col-md-4 col-sm-6 mt-3"
        v-for="item in professorShopItems"
        :key="item.item_id"
      >
        <div class="card h-100 w-100">
          <div class="card-body">
            <h5 class="card-title">{{ item.item_name }}</h5>

            <p class="card-text">
              Quantity: {{ item.item_quantity }}<br />
              Point Value: {{ item.item_price }} Points <br />
              Subject: {{ item.item_subject }} <br />
              Program Level: {{ item.item_classSection }}
            </p>

            <button
              class="btn btn-primary mar"
              data-bs-toggle="modal"
              data-bs-target="#updateItem"
              @click="setUpdateItemData(item)"
            >
              Update
            </button>
            <button class="btn btn-danger mar" @click="deleteItem(item)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Modal -->
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
                  :key="subject.id"
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

  <!-- Update Shop Item Modal -->
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
                  :key="subject.id"
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
import { ref, onMounted } from "vue";
import axios from "axios";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import { useShopData } from "../composables/useShopData";

const { professorShopItems, loading, refreshAllData } = useShopData();

const proftoken = localStorage.getItem("proftoken");

//CurrentItem
const currentItemId = ref(null);
const currentItemName = ref(null);
const currentQuantity = ref(null);
const currentPrice = ref(null);
const currentCourseYear = ref(null);
const currentSubject = ref(null);
const professorSubject = ref([]);
//AddShop
const itemName = ref("");
const quantity = ref("");
const price = ref("");
const courseYear = ref("");
const selectedSubject = ref("");
//UpdateShop
const updateitemName = ref("");
const updatequantity = ref("");
const updateprice = ref("");
const updatecourseYear = ref("");
const updatesubject = ref("");
const setUpdateItemData = (item) => {
  currentItemId.value = item.item_id;
  currentItemName.value = item.item_name;
  currentQuantity.value = item.item_quantity;
  currentPrice.value = item.item_price;
  currentCourseYear.value = item.item_classSection;
  currentSubject.value = item.item_subject;
};

const fetchSubjects = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/professor/getAllSubject`, {
      headers: {
        proftoken: `${proftoken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    });
    const subjects = response.data.subject;

    subjects.sort((a, b) => {
      const nameA = a.subject_name.toLowerCase();
      const nameB = b.subject_name.toLowerCase();

      // Extract alphanumeric parts (letters and numbers)
      const partsA = nameA.match(/([a-z]+|\d+)/g); // Matches letters or numbers
      const partsB = nameB.match(/([a-z]+|\d+)/g);

      if (!partsA || !partsB) {
        // Handle cases where no alphanumeric parts are found
        return nameA.localeCompare(nameB); // Fallback to basic string compare
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

      return partsA.length - partsB.length; // If all parts are equal, compare length
    });

    professorSubject.value = subjects;
  } catch (error) {
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
    try {
      const updatedData = {
        item_name: updateitemName.value || currentItemName.value,
        item_quantity: updatequantity.value || currentQuantity.value,
        item_price: updateprice.value || currentPrice.value,
        item_classSection: updatecourseYear.value || currentCourseYear.value,
        item_subject: updatesubject.value || currentSubject.value,
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
        await refreshAllData();

        Swal.fire({
          title: "Success",
          text: "Incentive updated successfully",
          icon: "success",
        });

        updateitemName.value = "";
        updatequantity.value = "";
        updateprice.value = "";
        updatecourseYear.value = "";
        updatesubject.value = "";
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to update incentive",
          icon: "error",
        });
      }
    } catch (error) {
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
      await refreshAllData();

      Swal.fire("Success", "Incentive added successfully!", "success");

      // Clear form fields
      itemName.value = "";
      quantity.value = "";
      price.value = "";
      courseYear.value = "";
    } else {
      Swal.fire("Error", "Failed to add incentive", "error");
    }
  } catch (error) {
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
        await refreshAllData();

        Swal.fire({
          title: "Success",
          text: "Incentive Deleted successfully",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to delete incentive",
          icon: "error",
        });
      }
    } catch (error) {
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
  refreshAllData();
  fetchSubjects();
});
</script>

<style scoped>
.subject-selector {
  background-color: white;
}
body {
  margin: 0;
  padding: 0;
}

.scroll-container {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
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

@media (max-height: 800px) {
  .scroll-container {
    max-height: 400px;
  }
}
</style>
