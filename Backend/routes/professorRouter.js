const professorController = require("../controllers/professorController.js");
const shopController = require("../controllers/shopController");
const attendanceController = require("../controllers/attendanceController.js");

const {
  authenticateProfToken,
  authenticateStudToken,
} = require("../middleware/auth");

const router = require("express").Router();

router.post("/registerProfessor", professorController.registerProfessor);

router.post("/loginProfessor", professorController.loginProfessor);

router.get(
  "/getProfessor",
  authenticateProfToken,
  professorController.getProfessorProfile
);

router.put(
  "/updateProfessor",
  authenticateProfToken,
  professorController.updateProfessorProfile
);

router.put(
  "/updateProfessorPassword",
  authenticateProfToken,
  professorController.changeProfessorPassword
);

//Professor Shop
router.post(
  "/createItems/",
  authenticateProfToken,
  shopController.createShopItem
);

router.get("/getItems", authenticateProfToken, shopController.getShopItems);

router.put(
  "/updateProfessorShopItem/:item_id",
  authenticateProfToken,
  shopController.UpdateShopItems
);

router.delete(
  "/deleteProfessorShopItem/:item_id",
  authenticateProfToken,
  shopController.deleteShopItems
);

router.get(
  "/getProfessorTransaction",
  authenticateProfToken,
  shopController.getProfessorShopTransaction
);

//Subject
router.post(
  "/createSubject",
  authenticateProfToken,
  attendanceController.createSubject
);
router.get(
  "/getAllSubject",
  authenticateProfToken,
  attendanceController.getAllSubject
);
router.put(
  "/updateSubject/:subject_id",
  authenticateProfToken,
  attendanceController.updateSubject
);
router.delete(
  "/deleteSubject/:subject_id",
  authenticateProfToken,
  attendanceController.deleteSubject
);

//Class

router.post(
  "/createClass/:subject_id",
  authenticateProfToken,
  attendanceController.createClass
);

router.get(
  "/getClass/:subject_id",
  authenticateProfToken,
  attendanceController.getClass
);

router.get(
  "/getSingleClass/:subject_id/:class_id",
  authenticateProfToken,
  attendanceController.getSingleClass
);

router.put(
  "/updateClass/:subject_id/:class_id",
  authenticateProfToken,
  attendanceController.updateClass
);

//Class Deletion
router.get(
  "/getClassDeleted/:subject_id",
  authenticateProfToken,
  attendanceController.getClassDeleted
);

router.put(
  "/deleteClassRestore/:subject_id/:class_id",
  authenticateProfToken,
  attendanceController.deleteClassRestore
);

router.put(
  "/deleteClass/:subject_id/:class_id",
  authenticateProfToken,
  attendanceController.deleteClass
);

router.delete(
  "/deleteClassPerma/:subject_id/:class_id",
  authenticateProfToken,
  attendanceController.deleteClassPerma
);

//Attendance
router.post(
  "/createAttendance/:class_id",
  authenticateStudToken,
  attendanceController.createAttendance
);

router.get(
  "/getAttendance/:class_id",
  authenticateProfToken,
  attendanceController.getAttendance
);

router.get(
  "/getStudentEntry/:subject_id",
  authenticateProfToken,
  attendanceController.getStudentEntry
);

module.exports = router;
