<script setup>
import { useRouter } from "vue-router";

import Box from "../components/box.vue";
const router = useRouter();
</script>
<template>
  <div class="container-fluid app">
    <Box />
    <div class="row white-bg">
      <div class="col-2"></div>
      <div class="col-md-8">
        <h1 class="text-start inv">Let's get Started!!</h1>
        <div class="text-center py-4 px-4 inv">
          <h2>I am a?</h2>

          <RouterLink
            to="/RegisterStudent"
            style="color: black; text-decoration: none; font-weight: bold"
          >
            <button class="btnsyle">Student</button>
          </RouterLink>

          <div class="py-3">
            <RouterLink
              to="/RegisterProfessor"
              style="color: black; text-decoration: none; font-weight: bold"
            >
              <button class="btnsyle">Professor</button>
            </RouterLink>

            <p class="mt-3 inv">
              Already have an account?
              <RouterLink
                to="/"
                style="color: black; text-decoration: none; font-weight: bold"
              >
                Login Here</RouterLink
              >
            </p>
          </div>
        </div>
      </div>
      <div class="col-2"></div>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.cus-border {
  border-width: 1px;
  border-color: black;
  padding-top: 10px;
}

.btnsyle {
  background-color: black;
  color: white;
  width: 335px;
  height: 44px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: white;
  color: black;
  border-color: black;
}

.white-bg {
  margin-top: 15px;
  background-color: white;
  border-radius: 20px;
  width: 700px;
  height: 30svh;
  overflow: hidden !important;
  margin-bottom: 80px;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }

  .white-bg {
    width: 80vw;
    height: 40svh;
  }
}

@media (max-width: 436px) {
  .btnsyle {
    width: 110px;
  }
}
</style>
