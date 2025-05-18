<!-- professor.vue -->
<script setup>
import { nextTick } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import ProfSubject from "../components/ProfessorSubject.vue";
import { useShopData } from "../composables/useShopData";
import { useSubjectData } from "../composables/useSubjectData";
import student from "../views/student.vue";

import navbar from "../components/professorNavBar.vue";
const { clearStateDataProfessor } = useShopData();
const { clearStateSubject } = useSubjectData();
const router = useRouter();
</script>

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
      

      <ProfSubject />
    </div>
  </div>
</template>


