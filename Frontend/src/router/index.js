import { createRouter, createWebHistory } from "vue-router";

import QrScanner from "../components/HelloWorld.vue";
import whoAreYou from "../views/WhoAreYou.vue";
import RegisterStudent from "../views/RegisterStudent.vue";
import RegisterProfessor from "../views/RegisterProfessor.vue";
import LoginView from "../views/LoginView.vue";

//Student
import Student from "../views/student.vue";
import StudentShop from "../views/studentShop.vue";
import StudentProfile from "../views/studentProfile.vue";
import StudentTransaction from "../views/studentTransaction.vue";

//Professor
import Professor from "../views/professor.vue";
import ProfessorShop from "../views/professorShop.vue";
import ProfessorProfile from "../views/professorProfile.vue";
import ProfessorTransaction from "../views/professorTransaction.vue";
import ProfessorSession from "../components/professorSession.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/whoAreYou",
    name: "whoAreYou",
    component: whoAreYou,
  },
  {
    path: "/RegisterStudent",
    name: "RegisterStudent",
    component: RegisterStudent,
  },
  {
    path: "/RegisterProfessor",
    name: "RegisterProfessor",
    component: RegisterProfessor,
  },
  {
    path: "/student",
    name: "Student",
    component: Student,
  },
  {
    path: "/student/shop",
    name: "Shop",
    component: StudentShop,
  },
  {
    path: "/student/profile",
    name: "StudentProfile",
    component: StudentProfile,
  },
  {
    path: "/student/transaction",
    name: "StudentTransaction",
    component: StudentTransaction,
  },
  {
    path: "/professor",
    name: "Professor",
    component: Professor,
  },
  {
    path: "/professor/shop",
    name: "ProfessorShop",
    component: ProfessorShop,
  },
  {
    path: "/professor/profile",
    name: "ProfessorProfile",
    component: ProfessorProfile,
  },
  {
    path: "/professorTransaction",
    name: "ProfessorTransaction",
    component: ProfessorTransaction,
  },
  {
    path: "/professor/session/:subjectID/:subjectName",
    name: "ProfessorSession",
    component: ProfessorSession,
    props: true,
  },
  {
    path: "/professor/session/qrscanner/:subjectID/:sessionID",
    name: "QrScanner",
    component: QrScanner,
    props: true,
  },
  // Add other routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
