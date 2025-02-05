<template>
  <div class="container-1 col-12 d-flex justify-content-end">
    <button type="button" class="logout btn btn-danger" @click="logout">
      Logout
    </button>
  </div>

  <h1>{{ programlevel }} Master List</h1>
  <div class="return">
    <button class="btn-return" @click="back">
      <img src="../assets/return.png" alt="" width="28" height="40" />
    </button>
  </div>
  <br />
  <div class="container">
    <div class="col-12 overflow-auto d-flex justify-content-center">
      <div class="bg" v-if="studentsByProgram.length > 0">
        <div
          class="trubg text-start"
          v-for="(student, index) in studentsByProgram"
          :key="student.stud_id"
        >
          <h5 style="color: white; padding: 5px">
            {{ index + 1 }}. {{ student.first_name }} {{ student.middle_name }}
            {{ student.last_name }}
          </h5>
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
    console.log("students:", studentsByProgram.value);
  } catch (error) {
    console.error("Error fetching students", error);
  }
});

const back = async () => {
  router.back();
};
</script>
<style scoped>
.trubg {
  height: inherit;
}
.bg {
  width: 700px;
  max-height: 600px;
  overflow-x: hidden;
  background-color: rgba(255, 255, 255, 0.266);
  padding-right: 10px;
}
.container {
  margin-top: 90px;
}

h1 {
  margin-top: 50px;
  color: white;
}
.return {
  position: relative;
  z-index: 999;
  display: flex;
  margin-top: 30px;
  margin-bottom: -80px;
}
.btn-return {
  background-color: white;
  border-radius: 50%;
  transition: 0.5s;
  border: none;
}

.btn-return:hover {
  scale: 1.1;
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

@media (max-width: 900px) {
  .container-1 {
    margin-left: 0;
  }
}
@media (max-width: 1856px) {
  .container-1 {
    margin-left: 400px;
  }
}
@media (max-width: 1650px) {
  .container-1 {
    margin-left: 300px;
  }
}
@media (max-width: 1470px) {
  .container-1 {
    margin-left: 250px;
  }
}
@media (max-width: 1350px) {
  .container-1 {
    margin-left: 200px;
  }
}
@media (max-width: 1250px) {
  .container-1 {
    margin-left: 150px;
  }
}
@media (max-width: 1150px) {
  .container-1 {
    margin-left: 100px;
  }
}
@media (max-width: 1050px) {
  .container-1 {
    margin-left: 50px;
  }
  .card-col {
    width: 650px;
  }
}
@media (max-width: 950px) {
  .container-1 {
    margin-left: 20px;
  }
}

@media (max-width: 768px) {
  .card-col {
    width: 330px;
  }
}
@media (max-width: 612px) {
  .text {
    max-width: 400px !important;
  }
}
</style>
