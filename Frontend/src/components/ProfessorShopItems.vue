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

const proftoken = localStorage.getItem("proftoken");
const professorShopItems = ref([]);

//CurrentItem
const currentItemId = ref(null);
const currentItemName = ref(null);
const currentQuantity = ref(null);
const currentPrice = ref(null);
const currentCourseYear = ref(null);

//AddShop
const itemName = ref("");
const quantity = ref("");
const price = ref("");
const courseYear = ref("");

//UpdateShop
const updateitemName = ref("");
const updatequantity = ref("");
const updateprice = ref("");
const updatecourseYear = ref("");

const setUpdateItemData = (item) => {
  currentItemId.value = item.item_id;
  currentItemName.value = item.item_name;
  currentQuantity.value = item.item_quantity;
  currentPrice.value = item.item_price;
  currentCourseYear.value = item.item_classSection;
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
        Swal.fire({
          title: "Success",
          text: "Incentive updated successfully",
          icon: "success",
        });

        const updatedItems = await axios.get(
          `${baseURL}/api/professor/getItems`,
          {
            headers: {
              proftoken: `${proftoken}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        professorShopItems.value = updatedItems.data.shopItem;

        updateitemName.value = "";
        updatequantity.value = "";
        updateprice.value = "";
        updatecourseYear.value = "";
      } else {
        console.error("Failed to update shop item:", response.statusText);
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
  if (!itemName.value || !quantity.value || !price.value || !courseYear.value) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }
  try {
    // Make a request to the createItems endpoint
    const response = await axios.post(
      `${baseURL}/api/professor/createItems/`,
      {
        item_name: itemName.value,
        item_quantity: quantity.value,
        item_price: price.value,
        item_classSection: courseYear.value,
      },
      {
        headers: {
          proftoken: `${proftoken}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    // Handle success or show a notification
    if (response.status === 200) {
      Swal.fire("Success", "Incentive added successfully!", "success");
      const response = await axios.get(` ${baseURL}/api/professor/getItems`, {
        headers: {
          proftoken: `${proftoken}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      professorShopItems.value = response.data.shopItem;

      itemName.value = "";
      quantity.value = "";
      price.value = "";
      courseYear.value = "";
    } else {
      Swal.fire("Error", "Failed to add incentive", "error");
    }
  } catch (error) {
    // console.error("Error adding item:", error);
    // Swal.fire("Error", "An error occurred", "error");
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
        Swal.fire({
          title: "Success",
          text: "Incentive Deleted successfully",
          icon: "success",
        });

        const updatedItems = await axios.get(
          `${baseURL}/api/professor/getItems`,
          {
            headers: {
              proftoken: `${proftoken}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        professorShopItems.value = updatedItems.data.shopItem;
      } else {
        console.error("Failed to delete shop item:", response.statusText);
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

onMounted(async () => {
  try {
    const response = await axios.get(`${baseURL}/api/professor/getItems`, {
      headers: {
        proftoken: `${proftoken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    });
    professorShopItems.value = response.data.shopItem;
  } catch (error) {
    console.error("Error getting professor shop items:", error);
  }
});
</script>

<style scoped>
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
