<template>
  <div class="container-1 col-12 d-flex justify-content-end">
    <button type="button" class="logout btn btn-danger" @click="logout">
      Logout
    </button>
  </div>

  <div class="div">
    <div class="container-2 justify-content-center align-items-center">
      <div class="card d-flex justify-content-center align-items-center">
        <img
          src="../assets/reading.png"
          alt="student-reading"
          style="width: 40%; height: 50%"
        />
        <br />
        <h2>Student</h2>
      </div>
      <div class="card d-flex justify-content-center align-items-center">
        <img
          src="../assets/dean.png"
          alt="professor"
          style="width: 35%; height: 50%"
        /><br />
        <h2>Professor</h2>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
const router = useRouter();
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
  .container-2 {
    margin-top: 60px;
    flex-direction: column;
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
}
@media (max-width: 950px) {
  .container-1 {
    margin-left: 20px;
  }
}
</style>
