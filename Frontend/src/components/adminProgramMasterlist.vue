<template>
  <div class="bg">
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>

    <div class="container">
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

          <div class="pt-3" v-if="studentsByProgram.length > 0">
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
                    v-for="(student, index) in studentsByProgram"
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
            No students found for this program level.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { baseURL } from "../config";
import axios from "axios";
const router = useRouter();
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);

const token = localStorage.getItem("admintoken");

const props = defineProps(["programlevel"]);
const programlevel = ref(props.programlevel);

const studentsByProgram = ref([]);
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
  }
});

const back = async () => {
  router.back();
};
</script>
<style scoped>
.container {
  padding-top: 30px;
}
.table-responsive {
  cursor: default;

  width: 60vw;
  height: 650px !important;
}
</style>
