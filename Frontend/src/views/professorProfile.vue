<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { baseURL } from "../config";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

const router = useRouter();
const proftoken = localStorage.getItem("proftoken");

const profData = ref(null);
const firstName = ref("");
const middleName = ref("");
const lastName = ref("");

const updateProfessor = async () => {
  const confirmationResult = await Swal.fire({
    title: "Update Profile",
    text: "Are you sure you want to update your profile?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    try {
      const updatedData = {
        first_name: firstName.value || profData.value.first_name,
        middle_name: middleName.value || profData.value.middle_name,
        last_name: lastName.value || profData.value.last_name,
      };

      const response = await axios.put(
        `${baseURL}/api/professor/updateProfessor`,
        updatedData,
        {
          headers: {
            proftoken: `${proftoken}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Profile updated successfully",
          icon: "success",
        });

        const updatedProfessor = await axios.get(
          `${baseURL}/api/professor/getProfessor/`,
          {
            headers: {
              proftoken: `${proftoken}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        profData.value = updatedProfessor.data;

        firstName.value = "";
        middleName.value = "";
        lastName.value = "";
      } else {
        console.error("Failed to update profile:", response.statusText);
        Swal.fire({
          title: "Error",
          text: "Failed to update profile",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating profile",
        icon: "error",
      });
    }
  }
};
onMounted(async () => {
  try {
    const getProfessor = await axios.get(
      `${baseURL}/api/professor/getProfessor/`,
      {
        headers: {
          proftoken: `${proftoken}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    profData.value = getProfessor.data;
  } catch (error) {
    console.error("Error getting data:", error);
  }
});

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

<template>
  <div>
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
              <RouterLink class="nav-link pointer curr" to="/professor/shop">
                Incentives
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                class="nav-link pointer curr active"
                to="/professor/profile"
              >
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
  </div>

  <div v-if="profData" class="container-fluid text-start">
    <div class="white-bg">
      <h1 class="mt-2 mb-2 text-center">Professor Profile</h1>
      <ul class="f-size">
        <li>First Name: {{ profData.first_name }}</li>
        <li>Middle Name: {{ profData.middle_name }}</li>
        <li>Last Name: {{ profData.last_name }}</li>
      </ul>
      <div class="mt-5 d-flex justify-content-center align-items-center">
        <button
          class="btnsyle"
          data-bs-toggle="modal"
          data-bs-target="#updateProfessor"
        >
          Update Profile
        </button>
      </div>
    </div>
  </div>

  <!-- Update Modal -->
  <div
    class="modal fade"
    id="updateProfessor"
    tabindex="-1"
    aria-labelledby="addCategory"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <form>
          <div class="modal-header">
            <h5 class="modal-title" id="updateProfessor">Update Professor</h5>

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
              <label class="form-label fw-bold inv">First Name</label>
              <input
                v-model="firstName"
                type="text"
                class="form-control cus-border"
                placeholder="Enter new First Name"
              />

              <label class="form-label fw-bold inv">Middle Name</label>
              <input
                v-model="middleName"
                type="text"
                class="form-control cus-border"
                placeholder="Enter new Middle Name"
              />

              <label class="form-label fw-bold inv">Last Name</label>

              <input
                v-model="lastName"
                type="text"
                class="form-control cus-border"
                placeholder="Enter new Last Name"
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
            <button
              type="button"
              class="btn btn-primary"
              @click="updateProfessor"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text {
  margin-top: 100px;
  color: white;
}

.btnsyle {
  background-color: black;
  color: white;
  width: 335px;
  height: 44px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: white;
  color: black;
  border-color: black;
}

.white-bg {
  margin-top: 50px;
  background-color: white;
  border-radius: 20px;
  width: 700px;
  height: 60svh;
  overflow: hidden !important;
  margin-bottom: 80px;
}

.f-size {
  font-size: large;
  list-style: none;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
  .white-bg {
    width: 80vw;
    height: 60svh;
  }
}

@media (max-width: 436px) {
  .btnsyle {
    width: 110px;
  }
  .white-bg {
    height: 65svh;
  }
}
</style>
