<template>
  <div class="bg">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>

    <div v-else class="container">
      <div class="row">
        <div class="col-6">
          <button class="btn-return" @click="back">
            <img src="../assets/return.png" alt="" width="28" height="40" />
          </button>
        </div>
        <div class="col-6 text-end">
          <button type="button" class="logout btn btn-danger" @click="logout">
            Logout
          </button>
        </div>
        <div
          class="col-12 d-flex justify-content-center flex-column align-items-center"
        >
          <h1 class="text-center">
            <i class="text-decoration-underline"> {{ programlevel }}</i> MASTER
            LIST
          </h1>

          <div class="row w-100 mb-3 justify-content-center align-items-center">
            <div class="col-md-5 mb-2 mb-md-0">
              <input
                type="text"
                class="form-control"
                placeholder="Search students by name..."
                v-model="searchQuery"
              />
            </div>
            <div class="col-md-3">
              <button class="btn btn-info w-100" @click="downloadCSV">
                Download CSV
              </button>
            </div>
          </div>

          <p class="text-start text-black mb-2">
            Total Students: <strong>{{ filteredStudents.length }}</strong>
          </p>

          <div class="pt-3" v-if="filteredStudents.length > 0">
            <div class="table-responsive">
              <table class="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">STUDENT NAME</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(student, index) in filteredStudents"
                    :key="student.stud_id"
                  >
                    <th scope="row">{{ index + 1 }}</th>
                    <td>
                      {{ student.first_name }}
                      {{ student.middle_name }}
                      {{ student.last_name }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center text-white mt-3">
            No students found for this program level or matching your search.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue"; // Import 'computed'
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios";
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);
const router = useRouter();

const token = localStorage.getItem("admintoken");

const props = defineProps(["programlevel"]);
const programlevel = ref(props.programlevel); // Program level from route params

const studentsByProgram = ref([]); // Holds all students fetched from API
const searchQuery = ref(""); // New ref for search input

// Computed property to filter students based on search query
const filteredStudents = computed(() => {
  let students = studentsByProgram.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    students = students.filter(
      (student) =>
        student.first_name.toLowerCase().includes(query) ||
        (student.middle_name &&
          student.middle_name.toLowerCase().includes(query)) ||
        student.last_name.toLowerCase().includes(query)
    );
  }
  return students;
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
    localStorage.removeItem("admintoken");
    router.push("/admin");
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.post(
      `${baseURL}/api/admin/getClassStudentByProgram`,
      { courseYearSection: programlevel.value },
      {
        headers: {
          admintoken: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    studentsByProgram.value = response.data.students;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error("Error fetching students", error);
    Swal.fire({
      title: "Error",
      text: "Failed to fetch student data.",
      icon: "error",
    });
  }
});

const back = async () => {
  router.back();
};

//Format CSV field because theres "" in the names without this
const formatCsvField = (value) => {
  if (value === null || value === undefined) return "";
  let stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    stringValue = stringValue.replace(/"/g, '""');
    // Enclose the entire field in double quotes
    return `"${stringValue}"`;
  }

  return stringValue;
};

// Download the filtered student data as CSV
const downloadCSV = () => {
  const studentsToExport = filteredStudents.value; // Use the filtered list

  if (studentsToExport.length === 0) {
    Swal.fire({
      title: "No Data",
      text: "No students to download in the current view.",
      icon: "info",
    });
    return;
  }

  const totalStudentsLine = `Total Students: ${studentsToExport.length}`;

  // Define CSV headers
  const headers = ["First Name", "Middle Name", "Last Name"];

  // Map student data to CSV rows, using the formatCsvField helper
  const csvRows = studentsToExport.map((student) => {
    return [
      formatCsvField(student.first_name), // Will NOT have quotes unless necessary
      formatCsvField(student.middle_name || ""), // Will NOT have quotes unless necessary
      formatCsvField(student.last_name), // Will NOT have quotes unless necessary
    ].join(",");
  });

  // Combine total students line, headers, and rows
  const csvContent = [
    totalStudentsLine,
    headers.map((header) => formatCsvField(header)).join(","), // Headers also use the formatter for safety
    ...csvRows,
  ].join("\n");

  // Create a Blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  if (link.download !== undefined) {
    // Check for download attribute support
    link.setAttribute("href", url);
    // Dynamic filename based on program level
    link.setAttribute(
      "download",
      `${programlevel.value.replace(/\s+/g, "_")}_students_master_list.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Fallback for browsers that don't support the download attribute
    window.open(url);
  }
};
</script>

<style scoped>
.container {
  padding-top: 30px;
}
.table-responsive {
  cursor: default;
  width: 60vw;
  max-height: 650px;
  overflow-y: auto;
}
</style>
