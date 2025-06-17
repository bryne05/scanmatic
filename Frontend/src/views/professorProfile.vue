<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { baseURL } from "../config";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { useShopData } from "../composables/useShopData";
import { useSubjectData } from "../composables/useSubjectData";
import navbar from "../components/professorNavBar.vue";
import { MoonLoader } from "vue3-spinner";
import { Modal } from "bootstrap";

const isLoading = ref(false);
const { clearStateDataProfessor } = useShopData();
const { clearStateSubject } = useSubjectData();
const router = useRouter();
const proftoken = localStorage.getItem("proftoken");

const profData = ref(null);
const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const newPass = ref("");
const confirmPass = ref("");

function closeModalById(id) {
  const el = document.getElementById(id);
  const modal = Modal.getInstance(el) || new Modal(el);
  modal.hide();
}

const updatePassword = async () => {
  if (!newPass.value || !confirmPass.value) {
    Swal.fire({
      title: "Error",
      text: "Please fill in both password fields",
      icon: "error",
    });
    return;
  }

  const confirmationResult = await Swal.fire({
    title: "Update Password",
    text: "Are you sure you want to update your password?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });
  closeModalById("changePassword");
  if (confirmationResult.isConfirmed) {
    if (newPass.value === confirmPass.value) {
      isLoading.value = true;
      try {
        const response = await axios.put(
          `${baseURL}/api/professor/updateProfessorPassword/`,
          { password: newPass.value },
          {
            headers: {
              proftoken: `${proftoken}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        if (response.status === 200) {
          isLoading.value = false;
          Swal.fire({
            title: "Success",
            text: "Password updated successfully",
            icon: "success",
          });
          // Clear the password fields after successful update
          newPass.value = "";
          confirmPass.value = "";
        }
      } catch (error) {
        isLoading.value = false;
        console.error("Error updating password:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to update password. Please try again.",
          icon: "error",
        });
      }
    } else {
      isLoading.value = false;
      Swal.fire({
        title: "Error",
        text: "The passwords do not match. Please try again.",
        icon: "error",
      });
    }
  }
};

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
    closeModalById("updateProfessor");
    isLoading.value = true;
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
        await getProfessor();
        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "Profile updated successfully",
          icon: "success",
        });

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

const getProfessor = async () => {
  try {
    isLoading.value = true;
    const getProfessor = await axios.get(
      `${baseURL}/api/professor/getProfessor/`,
      {
        headers: {
          proftoken: `${proftoken}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    isLoading.value = false;
    profData.value = getProfessor.data;
  } catch (error) {
    isLoading.value = false;
    console.error("Error getting data:", error);
  }
};
onMounted(async () => {
  await getProfessor();
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
    clearStateDataProfessor();
    clearStateSubject();
    router.push("/ZXNzb3IiLCJVfrvonD");
  }
};
</script>

<template>
  <navbar />

  <div class="bg">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>

    <div v-else class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-center align-items-center">
          <div v-if="profData" class="text-start">
            <div class="white-bg p-5 shadow">
              <div class="row">
                <div
                  class="col-xl-6 col-12 d-flex justify-content-xl-start justify-content-center align-items-center"
                >
                  <h1>PROFESSOR PROFILE</h1>
                </div>
                <div
                  class="col-xl-6 col-12 d-flex justify-content-center align-items-start"
                >
                  <img
                    class="prof"
                    src="../assets/Prof-Class/professor.png"
                    alt="professor icon"
                  />
                </div>
              </div>

              <div class="col-12 mt-2">
                <h4 class="text-start">Full Name</h4>
                <div class="text-box border d-flex p-2">
                  <p>
                    <img src="../assets/Home/User.png" alt="user icon" />
                    {{ profData.first_name }}
                    {{ profData.middle_name }}
                    {{ profData.last_name }}
                  </p>
                </div>
              </div>
              <div
                class="mt-5 d-flex justify-content-center align-items-center flex-column"
              >
                <button
                  class="btnsyle"
                  data-bs-toggle="modal"
                  data-bs-target="#updateProfessor"
                >
                  Update Profile
                </button>
                <button
                  class="btnsyle2"
                  data-bs-toggle="modal"
                  data-bs-target="#changePassword"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Update Modal -->
  <div
    class="modal"
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

  <!-- Change Password -->
  <div
    class="modal"
    id="changePassword"
    tabindex="-1"
    aria-labelledby="changePassword"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <form>
          <div class="modal-header">
            <h5 class="modal-title">Change Password</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12">
              <label class="form-label fw-bold inv">New Password</label>
              <input
                v-model="newPass"
                type="text"
                class="form-control cus-border"
                placeholder="Enter new Password"
              />

              <label class="form-label fw-bold inv">Confirm Password</label>
              <input
                v-model="confirmPass"
                type="text"
                class="form-control cus-border"
                placeholder="Confirm new Password"
              />
            </div>
          </div>
          <div class="modal-footer">
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
              @click="updatePassword"
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
.text-box img {
  width: 30px;
  height: 30px;
}

p {
  margin: 0;
}
.prof {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: black 5px solid;
  padding: 10px;
}
.container {
  padding-top: 80px;
}
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
  border: black 2px solid;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: white;
  color: black;
}

.btnsyle2 {
  background-color: white;
  color: black;
  width: 335px;
  height: 44px;
  border-radius: 5px;
  border: black 2px solid;
  transition: 0.3s ease-in-out;
}

.btnsyle2:hover {
  background-color: rgb(69, 69, 69) !important;
  color: white;
  border: rgb(69, 69, 69) 2px solid;
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

@media (max-width: 1199px) {
  .white-bg {
    height: 80svh;
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
