<template>
  <div class="container-1 col-12 d-flex justify-content-end">
    <button type="button" class="logout btn btn-danger" @click="logout">
      Logout
    </button>
  </div>

  <div class="div">
    <div class="container-2 justify-content-center align-items-center">
      <div
        class="card d-flex justify-content-center align-items-center"
        @click="studentDashboard"
      >
        <img src="../assets/reading.png" alt="student-reading" />
        <br />
        <h2>Students List</h2>
      </div>
      <div
        class="card d-flex justify-content-center align-items-center"
        @click="professorDashboard"
      >
        <img src="../assets/dean.png" alt="professor" /><br />
        <h2>Professors List</h2>
      </div>
      <div
        class="card d-flex justify-content-center align-items-center"
        @click="masterlistDashboard"
      >
        <img src="../assets/list.png" alt="professor" /><br />
        <h2>Master List</h2>
      </div>
      <div
        class="card d-flex justify-content-center align-items-center"
        @click="settingsDashboard"
      >
        <img src="../assets/setting.png" alt="professor" /><br />
        <h2>Settings</h2>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
const router = useRouter();

const studentDashboard = async () => {
  router.push("/adminStudentDashboard");
};

const professorDashboard = async () => {
  router.push("/adminProfessorDashboard");
};

const masterlistDashboard = async () => {
  router.push("/adminMasterlistDashboard");
};

const settingsDashboard = async () => {
  router.push("/adminSettingsDashboard");
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
</script>

<style scoped>
img {
  width: 130px;
  height: 130px;
}
.card {
  height: 300px;
  width: 400px;
  margin: 10px;
  cursor: pointer;
  transition: 0.3s;
}
.card:hover {
  scale: 1.03;
}
.container-2 {
  margin-top: 250px;
  display: flex;
  flex-direction: row;
  max-height: 800px;
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

  position: relative !important;
}

@media (max-width: 900px) {
  .container-1 {
    margin-left: 0;
  }
  .container-2 {
    margin-top: 60px;
    flex-direction: column;
  }
}
@media (max-width: 1856px) {
  .container-1 {
    margin-left: 200px;
  }
}
@media (max-width: 1650px) {
  .container-1 {
    margin-left: 100px;
  }
}
@media (max-width: 1470px) {
  .container-1 {
    margin-left: 50px;
  }
}
@media (max-width: 1350px) {
  .container-1 {
    margin-left: 0;
  }
}
@media (max-width: 1250px) {
  .container-1 {
    margin-left: 0;
  }
  .container-2 {
    padding-top: 370px;
    margin-top: 10px;
    flex-direction: column;
    overflow-y: scroll;
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
}
@media (max-width: 950px) {
  .container-1 {
    margin-left: 20px;
  }
}
</style>
