<template>
  <div class="container-1 col-12 d-flex justify-content-end">
    <button type="button" class="logout btn btn-danger" @click="logout">
      Logout
    </button>
  </div>

  <h1>Master List</h1>
  <div class="return">
    <button class="btn-return" @click="back">
      <img src="../assets/return.png" alt="" width="28" height="40" />
    </button>
  </div>
  <br />
  <div class="container">
    <div
      class="col-12 card-col overflow-auto d-flex align-items-center justify-content-start flex-wrap gap-3"
    >
      <div
        class="my-card d-flex align-items-center justify-content-center"
        v-for="programLevel in studentsProgramLevel"
        :key="programLevel"
        @click="enterProgramMasterList(programLevel)"
      >
        <h2>{{ programLevel }}</h2>
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

const studentsProgramLevel = ref([]);

const enterProgramMasterList = (programLevel) => {
  console.log("Program Level:", programLevel);
  router.push({
    name: "AdminProgramMasterlist",
    params: {
      programlevel: programLevel,
    },
  });
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
  try {
    const response = await axios.get(
      `${baseURL}/api/admin/getAllStudentProgramLevel`,
      {
        headers: {
          admintoken: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    studentsProgramLevel.value = response.data.programLevels;
    console.log("levels:", studentsProgramLevel.value);
  } catch (error) {
    console.error("Error fetching professor", error);
  }
});

const back = async () => {
  router.back();
};
</script>
<style scoped>
.container {
  margin-top: 90px;
}

.col-12 {
  width: auto;
}
.card-col {
  width: 1000px;
  max-height: 600px;
  padding: 20px;
}

.my-card {
  height: 200px;
  width: 300px;
  background-color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
  position: inherit;
}

.my-card:hover {
  scale: 1.03;
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
