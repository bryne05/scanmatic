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
import AttendanceDetails from "../views/studentAttendanceDetails.vue";
import StudentLeaderboard from "../views/studentLeaderboard.vue";

//Professor
import ProfessorLogin from "../views/LoginViewProf.vue";
import Professor from "../views/professor.vue";
import ProfessorShop from "../views/professorShop.vue";
import ProfessorProfile from "../views/professorProfile.vue";
import ProfessorTransaction from "../views/professorTransaction.vue";
import ProfessorSession from "../components/professorSession.vue";
import ProfessorEventSession from "../components/professorEventSession.vue";
import ProfessorRecycleSession from "../components/classRecycleBin.vue";
import ProfessorEventRecycleSession from "../components/classRecycleBin.vue";
import ProfessorStudentParticipation from "../views/professorStudentParticipation.vue";
import ProfessorEvents from "../views/professorEvent.vue";
import EventQr from "../components/eventQR.vue";

//Admin
import LoginAdmin from "../views/LoginAdmin.vue";
import AdminDashboard from "../views/adminDashboard.vue";
import AdminStudentDashboard from "../views/adminStudentDashboard.vue";
import AdminProfessorDashboard from "../views/adminProfessorDashboard.vue";
import AdminMasterlistDashboard from "../views/adminMasterList.vue";
import AdminProgramMasterlist from "../components/adminProgramMasterlist.vue";
import AdminSettings from "../views/adminSettings.vue";
const routes = [
  {
    path: "/admin",
    name: "admin",
    component: LoginAdmin,
  },
  {
    path: "/adminDashboard",
    name: "adminDashboard",
    component: AdminDashboard,
  },
  {
    path: "/adminStudentDashboard",
    name: "adminStudentDashboard",
    component: AdminStudentDashboard,
  },
  {
    path: "/adminSettingsDashboard",
    name: "AdminSettings",
    component: AdminSettings,
  },
  {
    path: "/adminProfessorDashboard",
    name: "adminProfessorDashboard",
    component: AdminProfessorDashboard,
  },
  {
    path: "/adminMasterlistDashboard",
    name: "AdminMasterlistDashboard",
    component: AdminMasterlistDashboard,
  },
  {
    path: "/adminProgramMasterlist/:programlevel",
    name: "AdminProgramMasterlist",
    component: AdminProgramMasterlist,
    props: true,
  },
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/ZXNzb3IiLCJVfrvonD",
    name: "ProfessorLogin",
    component: ProfessorLogin,
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
    path: "/student/attendancedetails",
    name: "AttendanceDetails",
    component: AttendanceDetails,
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
    path: "/student/shop/transaction",
    name: "StudentTransaction",
    component: StudentTransaction,
  },
  {
    path: "/student/leaderboard",
    name: "StudentLeaderboard",
    component: StudentLeaderboard,
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
    path: "/professor/shop/Transaction",
    name: "ProfessorTransaction",
    component: ProfessorTransaction,
  },
  {
    path: "/professor/session/:subjectID/:subjectName/:subjectCourse/:startTime/:endTime",
    name: "ProfessorSession",
    component: ProfessorSession,
    props: true,
  },
  {
    path: "/professor/event/session/:subjectID/:subjectName/:startTime/:endTime",
    name: "ProfessorEventSession",
    component: ProfessorEventSession,
    props: true,
  },
  {
    path: "/professor/RecycleSession/:subjectID/:subjectName/:programlevel",
    name: "ProfessorRecycleSession",
    component: ProfessorRecycleSession,
    props: true,
  },
  {
    path: "/professor/event/RecycleSession/:subjectID/:subjectName/:programlevel",
    name: "ProfessorEventRecycleSession",
    component: ProfessorRecycleSession,
    props: true,
  },
  {
    path: "/professor/event",
    name: "ProfessorEvents",
    component: ProfessorEvents,
  },
  {
    path: "/professor/session/qrscanner/:subjectID/:sessionID/:programlevel",
    name: "QrScanner",
    component: QrScanner,
    props: true,
  },
  {
    path: "/professor/eventsession/qrscanner/:subjectID/:sessionID/:programlevel",
    name: "EventQr",
    component: EventQr,
    props: true,
  },
  {
    path: "/professor/studentParticipantsOverview/:subjectID/:subjectName/:subjectProgramLevel",
    name: "ParticipantsOverview",
    component: ProfessorStudentParticipation,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
