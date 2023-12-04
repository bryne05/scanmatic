<template>
  <div class="col-xl-12 d-flex justify-content-center">
    <div class="row">
      <div class="logo">
        <img class="image-logo" src="../assets/logo.png" alt="Logo" />
      </div>
    </div>
  </div>
</template>

<script setup></script>
<style scoped>
.logo {
  width: 100%;
  height: 100%;
  /* animation:spin 15s infinite linear;
   cursor: pointer; */
}

.image-logo {
  width: clamp(5rem, 5vw + 10rem, 60rem) !important;
  height: clamp(5rem, 5vw + 10rem, 60rem) !important;
  cursor: pointer;
  animation: spin 15s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
