<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios"; // Removed ', all' as it's not used directly from axios import

const router = useRouter();
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);
// Assuming 'loading' from a parent component, otherwise remove if not used
// const loading = ref(false); // If loading isn't from parent, initialize here

const token = localStorage.getItem("admintoken");

const allStudent = ref([]);
const searchQuery = ref("");
const sortByProgram = ref(""); // To store the selected program for sorting
const sortByValidated = ref(""); // To store the validated status for sorting

// Computed property for total students count
const totalStudentsCount = computed(() => allStudent.value.length);

const validateStudent = async (data) => {
  const result = await Swal.fire({
    title: "Do you want to approve this Student?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (result.isConfirmed) {
    try {
      const stud_id = data;
      console.log(stud_id);
      const response = await axios.post(
        `${baseURL}/api/admin/validateStudent/${stud_id}`,
        null,
        {
          headers: {
            admintoken: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Student Approved!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Update allStudent ref directly in the frontend
        const index = allStudent.value.findIndex((p) => p.stud_id === stud_id);
        if (index !== -1) {
          allStudent.value[index].isValidated = true; // Mark as validated
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message || "Failed to approve student",
          icon: "error",
        });
        console.error("API Error:", response.data);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred during validation.",
        icon: "error",
      });
      console.error("Validation Error:", error);
    }
  }
};

// NEW FUNCTION: Decline Student
const declineStudent = async (
  stud_id,
  first_name,
  middle_name,
  last_name,
  courseYearSection
) => {
  const result = await Swal.fire({
    title:
      "Are you sure you want to DECLINE the account of\n " +
      "<p style='color:red'>" +
      ` ${courseYearSection} \n ${first_name} ${middle_name} ${last_name}` +
      "</p>",
    icon: "warning", // Use warning icon for decline/removal
    showCancelButton: true,
    confirmButtonText: "Yes, Decline and Remove",
    cancelButtonText: "No, Keep",
  });

  if (result.isConfirmed) {
    try {
      isLoading.value = true;
      // Assuming your deleteStudent API endpoint handles both validated and non-validated students
      const deleteStud = await axios.delete(
        `${baseURL}/api/admin/deleteStudent/${stud_id}`, // Reusing deleteStudent API
        {
          headers: {
            adminToken: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (deleteStud.status === 200) {
        Swal.fire({
          title: "Student Declined and Removed!",
          text: "The student's account has been successfully removed.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Remove the student from the allStudent ref immediately
        allStudent.value = allStudent.value.filter(
          (s) => s.stud_id !== stud_id
        );
      } else {
        Swal.fire({
          title: "Error",
          text:
            deleteStud.data.message || "Failed to decline and remove student.",
          icon: "error",
        });
        console.error("API Error:", deleteStud.data);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while declining and removing the student.",
        icon: "error",
      });
      console.error("Decline Error:", error);
    } finally {
      isLoading.value = false;
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
    localStorage.removeItem("admintoken");
    router.push("/admin");
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${baseURL}/api/admin/getAllStudent`, {
      headers: {
        admintoken: `${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    });

    allStudent.value = response.data.students;
    console.log(allStudent.value);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error("Error fetching student transactions:", error);
  }
});

const resetPassword = async (
  stud_id,
  first_name,
  middle_name,
  last_name,
  courseYearSection
) => {
  try {
    const resetPass = await Swal.fire({
      title:
        "Are you sure you want to reset the password for \n " +
        "<p style='color:red'>" +
        ` ${courseYearSection} \n ${first_name} ${middle_name} ${last_name}` +
        "</p>",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (resetPass.isConfirmed) {
      isLoading.value = true;
      const reset = await axios.post(
        `${baseURL}/api/admin/resetStudentPassword/${stud_id}`,
        {},
        {
          headers: {
            adminToken: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (reset.status === 200) {
        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "The password has been reset successfully.",
          icon: "success",
        });
      }
    }
  } catch (error) {
    isLoading.value = false;
    console.error("Error resetting password", error);
    Swal.fire({
      title: "Error",
      text: "An error occurred while resetting the password.",
      icon: "error",
    });
  }
};

const deleteStudent = async (
  stud_id,
  first_name,
  middle_name,
  last_name,
  courseYearSection
) => {
  try {
    const deleteStudentConfirm = await Swal.fire({
      // Renamed variable to avoid conflict
      title:
        "Are you sure you want to DELETE the account of\n " +
        "<p style='color:red'>" +
        ` ${courseYearSection} \n ${first_name} ${middle_name} ${last_name}` +
        "</p>",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (deleteStudentConfirm.isConfirmed) {
      // Used renamed variable
      isLoading.value = true;
      const deleteStud = await axios.delete(
        `${baseURL}/api/admin/deleteStudent/${stud_id}`,
        {
          headers: {
            adminToken: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      if (deleteStud.status === 200) {
        // Instead of re-fetching all students, filter out the deleted one
        allStudent.value = allStudent.value.filter(
          (s) => s.stud_id !== stud_id
        );
        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "Student has been deleted",
          icon: "success",
        });
      }
    }
  } catch (error) {
    isLoading.value = false;
    console.error("Error deleting student", error);
    Swal.fire({
      title: "Error",
      text: "An error occurred while deleting the student.",
      icon: "error",
    });
  }
};

// NEW FUNCTION: Download CSV
const downloadCsv = () => {
  if (allStudent.value.length === 0) {
    Swal.fire({
      title: "No Data to Download",
      text: "There are no students in the list to download.",
      icon: "info",
    });
    return;
  }

  // Define CSV headers (columns)
  const headers = [
    "Student ID",
    "First Name",
    "Middle Name",
    "Last Name",
    "Program Level",
    "Validated",
    "Date Registered",
  ];

  // Map student data to CSV rows
  const rows = allStudent.value.map((student) => {
    return [
      student.stud_id,
      student.first_name,
      student.middle_name,
      student.last_name,
      student.courseYearSection,

      student.isValidated ? "Yes" : "No", // Corrected field name here
      new Date(student.createdAt).toLocaleDateString(),
    ]
      .map(
        (field) =>
          `"${
            field !== null && field !== undefined
              ? String(field).replace(/"/g, '""')
              : ""
          }"`
      )
      .join(",");
  });

  const csvContent = [headers.map((h) => `"${h}"`).join(","), ...rows].join(
    "\n"
  );

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "student_data.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  Swal.fire({
    title: "Download Complete!",
    text: "Student data has been downloaded as CSV.",
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
  });
};

const back = async () => {
  router.back();
};

const filteredStudents = computed(() => {
  let students = allStudent.value;

  // Filter by search query
  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase().trim(); // Trim whitespace from search query

    students = students.filter((student) => {
      // Create a full name string, converting all parts to lowercase and handling potential null/undefined names
      const fullName = `${student.first_name || ""} ${
        student.middle_name || ""
      } ${student.last_name || ""}`.toLowerCase();

      // Check if the normalized full name includes the normalized search query
      return fullName.includes(searchLower);
    });
  }

  // Filter by program level
  if (sortByProgram.value) {
    students = students.filter(
      (student) => student.courseYearSection === sortByProgram.value
    );
  }

  // Filter by validated status
  if (sortByValidated.value !== "") {
    const targetStatus = sortByValidated.value === "true";
    students = students.filter(
      (student) => student.isValidated === targetStatus
    );
  }

  return students;
});
</script>

<template>
  <div class="bg">
    <div v-if="isLoading" class="loading-overlay">
      <moon-loader :loading="isLoading" color="white" size="150px" />
    </div>
    <div v-else class="container">
      <div class="row">
        <div class="col-6">
          <button class="btn-return" @click="back">
            <img src="../assets/return.png" alt="" width="28" height="40" />
          </button>
        </div>
        <div
          class="col-6 text-end d-flex justify-content-end align-items-center"
        >
          <button type="button" class="btn btn-info me-2" @click="downloadCsv">
         
            Download CSV
          </button>
          <button type="button" class="btn btn-danger" @click="logout">
            Logout
          </button>
        </div>

        <div class="col-12 pt-3 text-center pd-3">
          <h1>STUDENT LIST</h1>
          <p class="total-students-count">
            Total Students: <strong>{{ totalStudentsCount }}</strong>
          </p>
        </div>

        <div class="col-12 mb-3">
          <div class="row">
            <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                placeholder="Search by name..."
                v-model="searchQuery"
              />
            </div>
            <div class="col-md-4">
              <select class="form-select" v-model="sortByProgram">
                <option value="">Sort by Program Level</option>
                <option
                  v-for="program in [
                    ...new Set(allStudent.map((s) => s.courseYearSection)),
                  ].sort()"
                  :key="program"
                  :value="program"
                >
                  {{ program }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <select class="form-select" v-model="sortByValidated">
                <option value="">Sort by Validation Status</option>
                <option value="true">Approved</option>
                <option value="false">Not Approved</option>
              </select>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr class="tr text-center">
                  <th scope="col">STUDENT NAME</th>
                  <th scope="col">PROGRAM LEVEL</th>
                  <th scope="col">VALIDATE</th>
                  <th scope="col">RESET PASSWORD</th>
                  <th scope="col">REMOVE STUDENT</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="students in filteredStudents"
                  :key="students.stud_id"
                  class="text-center"
                >
                  <td class="text-start">
                    {{ students.first_name }} {{ students.middle_name }}
                    {{ students.last_name }}
                  </td>

                  <td>{{ students.courseYearSection }}</td>
                  <td>
                    <template v-if="!students.isValidated">
                      <button
                        class="btn btn-success me-2"
                        @click="validateStudent(students.stud_id)"
                      >
                        Approve
                      </button>
                      <button
                        class="btn btn-warning"
                        @click="
                          declineStudent(
                            students.stud_id,
                            students.first_name,
                            students.middle_name,
                            students.last_name,
                            students.courseYearSection
                          )
                        "
                      >
                        Decline
                      </button>
                    </template>
                    <span v-else class="text-success fw-bold">Approved</span>
                  </td>
                  <td>
                    <button
                      class="btn btn-primary"
                      @click="
                        resetPassword(
                          students.stud_id,
                          students.first_name,
                          students.middle_name,
                          students.last_name,
                          students.courseYearSection
                        )
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-bootstrap-reboot"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.8 6.8 0 0 0 1.16 8z"
                        />
                        <path
                          d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324z"
                        />
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button
                      class="btn btn-danger"
                      @click="
                        deleteStudent(
                          students.stud_id,
                          students.first_name,
                          students.middle_name,
                          students.last_name,
                          students.courseYearSection
                        )
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-person-dash"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
                        />
                        <path
                          d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-responsive {
  max-height: 700px !important;
}
.container {
  padding-top: 30px;
}
.text {
  margin-top: 100px !important;
  max-width: fit-content;
  max-height: 650px;
  overflow-y: auto;
  margin-top: 50px;
  color: white;
}
.tr {
  position: relative;
}

.card:hover {
  scale: 1.03;
}

.btn {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 30px;
  padding-left: 30px;
  border-radius: 15px;
}
.container-1 {
  z-index: 999 !important;
  margin-left: 500px;
  position: relative !important;
}
</style>
