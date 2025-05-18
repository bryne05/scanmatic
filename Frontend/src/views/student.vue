<script setup>
import { useRouter } from "vue-router";
import { baseURL } from "../config";
import QrcodeVue from "qrcode.vue";
import axios from "axios";
import { ref, onMounted, onBeforeUnmount } from "vue";
import Swal from "sweetalert2";
import { useShopData } from "../composables/useShopData";

import navbar from "../components/studentNavBar.vue";
const { clearStateData } = useShopData();
const token = ref(localStorage.getItem("studtoken"));

import defaultimage from "../assets/profile-user.png";
const imageSrc = ref(null);

const fileInput = ref(null);
const imageFile = ref(null);

const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const courseYearSection = ref("");
const newPass = ref("");
const confirmPass = ref("");
const levelThreshold = ref("");
const setdefaultimage = () => {
  imageSrc.value = defaultimage;
};

const fetchLevelThreshold = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/api/admin/getLevelThreshold`,
      {}
    );

    levelThreshold.value = response.data.level_threshold;
  } catch (error) {
    console.error("Error fetching level threshold", error);
  }
};

const checkLevelUp = async () => {
  if (studentData.value.current_exp >= levelThreshold.value) {
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
          studtoken: token.value,
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
            studtoken: token.value,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      studentData.value = updatedStudent.data;
    }
    return true;
  } else {
    return false;
  }
};

const fetchStudent = async () => {
  // Make the API request when the component is mounted
  try {
    const getStudent = await axios.get(`${baseURL}/api/student/getStudent/`, {
      headers: {
        studtoken: token.value,
        "ngrok-skip-browser-warning": "69420",
      },
    });

    await fetchLevelThreshold();
    studentData.value = getStudent.data;

    fetchImage();
  } catch (error) {
    console.error("Error getting data:", error);
  }
};
onMounted(async () => {
  await fetchStudent();
});

const fileTrigger = async () => {
  // Access the hidden file input and trigger it
  fileInput.value.click();
};

// Handle image upload (sending to the server)
const uploadImage = async () => {
  if (!imageFile.value) return;

  const formData = new FormData();
  formData.append("image", imageFile.value);

  try {
    // Send the image to the server (replace with your API URL)
    const response = await axios.post(
      `${baseURL}/api/student/studentImgUpload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          studtoken: token.value,
        },
      }
    );

    if (response.status === 200) {
      console.log("Image uploaded successfully!");
      fetchImage();
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0]; // Get the first file selected

  if (file && file.type.startsWith("image")) {
    imageFile.value = file;
    uploadImage();
  }
};

// Fetch the image from the backend
const fetchImage = async () => {
  try {
    // Make the GET request using axios with responseType set to 'blob'
    const response = await axios.get(
      `${baseURL}/api/student/studentImgRetrieve`,
      {
        headers: {
          studtoken: token.value, // Add any necessary authorization token here
        },
        responseType: "blob", // Set response type to 'blob' for binary data
      }
    );

    // Check if the response is successful
    if (response.status === 200) {
      // Create an object URL from the Blob data and assign it to imageSrc
      const imageURL = URL.createObjectURL(response.data);
      imageSrc.value = imageURL; // Use object URL for the image source
    } else {
      setdefaultimage();
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    setdefaultimage();
  }
};

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
              studtoken: token.value,
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
            studtoken: token.value,
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
              studtoken: token.value,
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

// Qr Coders

const size = 370;
const qrToken = ref("");
const router = useRouter();
const studentData = ref(null);
const showQrCode = ref(false);
const timer = ref(25);
const intervalId = ref(null);
const subjectID = ref("");
const ws = ref(null);
const studentId = ref("");

onBeforeUnmount(() => {
  if (ws.value) ws.value.close();
});

const triggerStudentAction = async () => {
  try {
    const response = await axios.post(
      `${baseURL}/api/student/getStudentSingleClassAndSubject`,
      { subject_id: subjectID.value },
      {
        headers: {
          studtoken: token.value, // Use token.value
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    if (response.status === 200) {
      if (ws.value) ws.value.close();
      console.log("response", response.data);
      const streak = response.data.attendanceStreak;
      console.log(streak);
      await fetchStudent();

      if ((await checkLevelUp()) === true) {
        console.log("You Leveled Up");
      } else if (streak % 5 === 0) {
        const studentNewToken = studentData.value.current_token + 50;

        console.log("studentNewToken:", studentNewToken);

        studentData.value.current_token = studentNewToken;

        const updateStudent = await axios.put(
          `${baseURL}/api/student/updateStudent`,
          { current_token: studentNewToken },
          {
            headers: {
              studtoken: token.value,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        if (updateStudent.status === 200) {
          Swal.fire({
            title: `You're on fire with a ${streak} streak! 50 points earned!`,
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
        }
      } else {
        Swal.fire({
          title: `Enjoy your class`,
          width: 600,
          confirmButtonText: "Let's go!",
          timer: 5000, // Optional: Auto-close after 5 seconds
          timerProgressBar: true,
          showCloseButton: true,
          showConfirmButton: true,
          allowOutsideClick: false,
        });
      }
    }
  } catch (error) {
    ws.value.close();
    console.error("Error fetching student streak data:", error);
  }
};

// const fetchStudent = async () => {
//   try {
//     const getStudent = await axios.get(`${baseURL}/api/student/getStudent`, {
//       headers: {
//         studtoken: token.value, // Use token.value
//         "ngrok-skip-browser-warning": "69420",
//       },
//     });
//     studentData.value = getStudent.data;
//   } catch (error) {
//     console.error("Error fetching student data:", error);
//   }
// };

const goToAttendanceDetails = () => {
  router.push({ name: "AttendanceDetails" });
};

const showQRCodeAndStartTimer = async () => {
  try {
    ws.value = new WebSocket("ws://localhost:6543");

    ws.value.onopen = () => {
      console.log("Connected to WebSocket server");

      // ✅ Access ws.value before calling send()
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        console.log("student token:", token.value);
        ws.value.send(JSON.stringify({ token: token.value }));
      } else {
        console.error("WebSocket is not ready to send messages.");
      }
    };

    // ✅ Listen for WebSocket messages in real-time
    ws.value.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.qrCode && data.subject_id) {
        studentId.value = data.qrCode; // Update student ID in real-time
        subjectID.value = data.subject_id;
        console.log("QR Code Detected:", studentId.value);
        console.log("subject ID Detected:", subjectID.value);
        await triggerStudentAction();
      }
    };

    ws.value.onerror = (error) => console.error("WebSocket Error:", error);
    ws.value.onclose = () => console.log("WebSocket disconnected");
    const response = await axios.post(
      `${baseURL}/api/student/generateNewToken`,
      {
        oldToken: token.value,
      }
    );

    if (response.data) {
      qrToken.value = response.data.QrToken; // Update token.value

      showQrCode.value = true;
      timer.value = 10;

      intervalId.value = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) {
          clearInterval(intervalId.value);

          showQrCode.value = false;
          ws.value.close();
        }
      }, 1000);
    } else {
      console.error("Failed to generate new token");
    }
  } catch (error) {
    console.error("Error generating new token:", error);
  }
};
</script>
<!-- studentProfile.vue -->
<template>
  <div
    :style="{
      backgroundColor: '#c7c7c7',
      fontFamily: 'Outfit-Regular',
      minHeight: '100vh',
      overflow: 'visible',
  
    }"
  >
    <navbar />
    <div>
      <div class="container-fluid " style="padding-top: 80px;"  >
        <div class="row"><div class="col-4"></div></div>
      </div>
    </div>
    <div class="container-fluid mt-3">
      <div class="row">
        <div class="col-xxl-2 order-1"></div>

        <!-- Student Profile -->
        <div
          class="col-xxl-4 col-xl-12 order-2 order-xxl-1 d-flex justify-content-center align-items-center flex-column"
        >
          <div v-if="studentData">
            <div
              class="profile-holder d-flex justify-content-center align-items-center flex-column"
            >
              <div class="row">
                <div class="col-xxl-6 col-lg-12 d-flex align-items-center">
                  <span style="font-size: 40px"
                    >PERSONAL <br />
                    SPACE</span
                  >
                </div>
                <div class="col-xxl-6 col-lg-12 d-flex justify-content-center">
                  <div class="imgdiv text-center">
                    <button @click="fileTrigger">Upload</button>
                    <img
                      :src="imageSrc || '/profile-user.png'"
                      alt="Student Image"
                      width="200"
                      height="200"
                      v-if="imageSrc || !imageSrc"
                      style="border-radius: 50%"
                    />

                    <br />

                    <input
                      type="file"
                      ref="fileInput"
                      accept="image/*"
                      style="display: none"
                      @change="handleFileChange"
                    />
                  </div>
                </div>
                <div class="col-12 mt-2">
                  <h5 class="text-start">Full Name</h5>
                  <div class="text-box">
                    <p>
                      <img src="../assets/Home/User.png" alt="user icon" />
                      {{ studentData.first_name }}
                      {{ studentData.middle_name }}
                      {{ studentData.last_name }}
                    </p>
                  </div>
                </div>

                <div class="container">
                  <div class="row">
                    <div class="col-xxl-6 col-lg-12">
                      <h5>Program Level</h5>
                      <p>
                        <img src="../assets/Home/Book.png" alt="book icon" />
                        {{ studentData.courseYearSection }}
                      </p>
                    </div>
                    <div class="col-xxl-6 col-lg-12">
                      <h5>Level</h5>
                      <p>
                        <img
                          src="../assets/Home/Stairs.png"
                          alt="level icon"
                        />{{ studentData.current_level }}
                      </p>
                    </div>
                    <div class="col-xxl-6 col-lg-12">
                      <h5>Experience</h5>
                      <p>
                        <img
                          src="../assets/Home/Develop.png"
                          alt="experience icon"
                        />{{ studentData.current_exp }}
                      </p>
                    </div>
                    <div class="col-xxl-6 col-lg-12">
                      <h5>Current Points</h5>
                      <p>
                        <img
                          src="../assets/Home/Rating.png"
                          alt="rating icon"
                        />{{ studentData.current_token }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div class="student-details mb-2">
                <button class="details-btn" @click="goToAttendanceDetails">
                  Check Attendance Details
                </button>
              </div>

              <button
                class="changePass-btn mb-2"
                data-bs-toggle="modal"
                data-bs-target="#changePassword"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
        <!-- Qr Code -->
        <div
          class="col-xxl-4 col-xl-12 order-1 order-xxl-2 d-flex justify-content-center align-items-center flex-column mb-3"
        >
          <h2><b>SCAN HERE</b></h2>
          <div
            class="qr-holder d-flex justify-content-center align-items-center shadow-lg"
          >
            <svg
              v-if="!showQrCode"
              xmlns="http://www.w3.org/2000/svg"
              width="150"
              height="150"
              fill="currentColor"
              class="bi bi-qr-code-scan"
              viewBox="0 0 16 16"
            >
              <path
                d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5M.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5M4 4h1v1H4z"
              />
              <path d="M7 2H2v5h5zM3 3h3v3H3zm2 8H4v1h1z" />
              <path d="M7 9H2v5h5zm-4 1h3v3H3zm8-6h1v1h-1z" />
              <path
                d="M9 2h5v5H9zm1 1v3h3V3zM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8zm2 2H9V9h1zm4 2h-1v1h-2v1h3zm-4 2v-1H8v1z"
              />
              <path d="M12 9h2V8h-2z" />
            </svg>
            <div
              v-if="showQrCode"
              class="d-flex justify-content-center align-items-center flex-column"
            >
              <qrcode-vue :value="qrToken" :size="size" level="H" />

              <p class="mt-3">
                QR Code will disappear in
                <span style="color: red">{{ timer }} </span> seconds
              </p>
            </div>
          </div>

          <button
            class="attendance-btn mt-4"
            v-if="!showQrCode"
            @click="showQRCodeAndStartTimer"
          >
            Generate QR Code
          </button>
        </div>
        <div class="col-xxl-2 order-4"></div>
      </div>
    </div>

    <!-- Profile Update Modal -->
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
                  >"Leave it blank if you don't want to update certain
                  details"</i
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
    <!-- Profile Change Password -->
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
  </div>
</template>

<style scoped>

hr {
  color: #8e8e8e;
  height: 20px !important;
  width: 100%;
}
.qr-holder {
  width: 446px;
  height: 483px;
  background-color: white;
  border-radius: 16px;
}

.profile-holder {
  width: 650px;
  height: 820px;
  padding: 60px;
  background-color: white;
  border-radius: 16px;
  z-index: 2 !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
  margin-top: 15px;
}

.profile-holder h5 {
  font-size: clamp(15px, 22px, 26px);
  color: #8e8e8e;
}

.profile-holder p {
  font-size: clamp(13px, 18px, 24px);
  border: #dbdbdb 1px solid;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  align-items: center;
}

.profile-holder p img {
  width: 25px !important;
  margin-right: 5px;
}

.uploadimage {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 30px;
  color: white;
  transition: 0.5s;
}

.uploadimage:hover {
  background-color: white;
  border-color: black;
  color: black;
}
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
  background-color: red;
  border-radius: 20px;
  width: 700px;
  height: 75vh;
  overflow: visible !important;
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
    height: 75svh;
  }
}

@media (max-width: 436px) {
  .btnsyle {
    width: 200px;
  }
  .white-bg {
    height: 75svh;
  }
}
.attendance-btn {
  background-color: #214280;
  color: white;
  border-radius: 4px;
  transition: 0.3s;
  border: #214280 2px solid;
  padding-top: 13px;
  padding-bottom: 13px;
  width: 446px;
  height: 55px;
}

.details-btn {
  background-color: white;
  color: black;
  border-radius: 4px;
  transition: 0.3s;
  border: black 2px solid;
  padding-top: 13px;
  padding-bottom: 13px;
  width: 446px;
  height: 55px;
}

.changePass-btn {
  background-color: black;
  color: white;
  border-radius: 4px;
  transition: 0.3s;
  border: black 2px solid;
  padding-top: 13px;
  padding-bottom: 13px;
  width: 446px;
  height: 55px;
}
.changePass-btn:hover {
  background-color: white;
  color: black;
}
.details-btn:hover {
  background-color: black;
  color: white;
}
.attendance-btn:hover {
  background-color: white;
  color: black;
}
.text {
  color: white;
  list-style: none;
}

.bg-white {
  margin: 0;
  background-color: white;
  width: 105%;
}

.imgdiv {
  position: relative;

}

.imgdiv img {
  object-fit: cover;
  border: black 5px solid;
}
.imgdiv button {
  position: absolute;
  left: 140px;
  border-radius: 30px;
  background-color: black;
  color: white;
  border: none;
  padding: 10px;
  width: 90px;
  transition: 0.3s;
  border: black 1px solid;
}

.imgdiv button:hover {
  background-color: white;
  color: black;
  border: black 1px solid;
}
@media (max-width: 366px) {
  .bg-white {
    background-color: white;
    overflow: visible !important;
    position: fixed !important;
    left: 0 !important;
    width: 100% !important;
  }
  .student-details {
    margin-top: 400px;
  }
}

@media (max-width: 922px) {
  .profile-holder {
    width: 400px;
    height: 1050px;
    margin-bottom: 12px;
  }
  .details-btn {
    width: 250px;
  }
  .changePass-btn {
    width: 250px;
  }
}
</style>
