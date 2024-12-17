<!-- studentProfile.vue -->
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
              <RouterLink class="nav-link pointer curr" to="/student/shop">
                Incentives
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                class="nav-link pointer curr active"
                to="/student/profile"
              >
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
  </div>

  <div v-if="studentData" class="container-fluid text-start">
    <div class="white-bg">
      <h1 class="mt-2 mb-2 text-center">Student Profile</h1>
      <ul class="f-size">
        <li>First Name: {{ studentData.first_name }}</li>
        <li>Middle Name: {{ studentData.middle_name }}</li>
        <li>Last Name: {{ studentData.last_name }}</li>

        <li>Program Level: {{ studentData.courseYearSection }}</li>
        <li>Level: {{ studentData.current_level }}</li>
        <li>Exp: {{ studentData.current_exp }}</li>
        <li>Current Points: {{ studentData.current_token }}</li>
      </ul>
      <div
        class="mt-5 d-flex justify-content-center align-items-center flex-column"
      >
        <button
          class="btnsyle"
          data-bs-toggle="modal"
          data-bs-target="#updateStudent"
        >
          Update Profile
        </button>

        <button
          class="btnsyle2 bg-primary"
          data-bs-toggle="modal"
          data-bs-target="#changePassword"
        >
          Change Password
        </button>
      </div>
    </div>
  </div>

  <!-- Update Modal -->
  <div
    class="modal fade"
    id="updateStudent"
    tabindex="-1"
    aria-labelledby="addCategory"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <form>
          <div class="modal-header">
            <h5 class="modal-title">Update Profile</h5>

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
              <label class="form-label fw-bold inv">Program Level</label>
              <input
                v-model="courseYearSection"
                type="text"
                class="form-control cus-border"
                placeholder="Ex BSCS 4A,BSIT 3B, GAS 11A, STEM 12B"
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
              @click="updateStudent"
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
    class="modal fade"
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

<script setup>
import { useRouter } from "vue-router";
import { baseURL } from "../config";

import axios from "axios";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { useShopData } from "../composables/useShopData";


const { clearStateData } = useShopData();
const token = localStorage.getItem("studtoken");
const router = useRouter();

const studentData = ref(null);

const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const courseYearSection = ref("");
const newPass = ref("");
const confirmPass = ref("");

onMounted(async () => {
  // Make the API request when the component is mounted
  try {
    const getStudent = await axios.get(`${baseURL}/api/student/getStudent/`, {
      headers: {
        studtoken: `${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    });
    studentData.value = getStudent.data;

    // Check if stud_exp is greater than or equal to 1500
    if (studentData.value.current_exp >= 1500) {
      const updatedData = {
        current_exp: studentData.value.current_exp - 1500,
        current_token: studentData.value.current_token + 50,
        current_level: studentData.value.current_level + 1,
      };

      const response = await axios.put(
        `${baseURL}/api/student/updateStudent/`,
        updatedData,
        {
          headers: {
            studtoken: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "You leveled up!! You gained 50 points",
          width: 600,
          padding: "3em",
          color: "#716add",
          background: "#fff url(../assets/celeb.jpg)",
          backdrop: `
    rgba(0,0,123,0.4)
    url("../assets/congrats.gif")
    center top
    no-repeat
  `,
        });

        // Fetch and update the latest student data
        const updatedStudent = await axios.get(
          `${baseURL}/api/student/getStudent/`,
          {
            headers: {
              studtoken: `${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        studentData.value = updatedStudent.data;
      }
    }
  } catch (error) {
    console.error("Error getting data:", error);
  }
});

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

  if (confirmationResult.isConfirmed) {
    if (newPass.value === confirmPass.value) {
      try {
        const response = await axios.put(
          `${baseURL}/api/student/updateStudentPassword/`,
          { password: newPass.value },
          {
            headers: {
              studtoken: `${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        if (response.status === 200) {
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
        console.error("Error updating password:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to update password. Please try again.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "The passwords do not match. Please try again.",
        icon: "error",
      });
    }
  }
};

const updateStudent = async () => {
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
        first_name: firstName.value || studentData.value.first_name,
        middle_name: middleName.value || studentData.value.middle_name,
        last_name: lastName.value || studentData.value.last_name,
        courseYearSection:
          courseYearSection.value || studentData.value.courseYearSection,
      };

      const response = await axios.put(
        `${baseURL}/api/student/updateStudent/`,
        updatedData,
        {
          headers: {
            studtoken: `${token}`,
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

        // Fetch and update the latest student data
        const updatedStudent = await axios.get(
          `${baseURL}/api/student/getStudent/`,
          {
            headers: {
              studtoken: `${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        studentData.value = updatedStudent.data;

        // Set Modal inputs to blank
        firstName.value = "";
        middleName.value = "";
        lastName.value = "";
        firstName.value = "";
        courseYearSection.value = "";
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
        text: "An error occurred while updating student",
        icon: "error",
      });
    }
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
    localStorage.removeItem("studtoken");
    clearStateData();
    router.push("/");
  }
};
</script>

<style>
.text {
  margin-top: 100px;
  color: white;
}
.cus-border {
  border-width: 1px;
  border-color: black;
}
.btnsyle {
  background-color: black;
  color: white;
  width: 335px;
  height: 44px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
  margin: 3px;
}

.btnsyle2 {
  background-color: black;
  color: white;
  width: 335px;
  height: 44px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
  margin: 3px;
}

.btnsyle2:hover {
  background-color: white !important;
  color: black;
  border-color: black;
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
    width: 200px;
  }
  .white-bg {
    height: 65svh;
  }
}
</style>
