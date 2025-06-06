const { authenticateAdminToken } = require("../middleware/auth");
const adminController = require("../controllers/adminController.js");
const { admin } = require("../models/index.js");
const router = require("express").Router();

router.post("/loginAdmin", adminController.loginAdmin);

router.get(
  "/getAllProfessor",
  authenticateAdminToken,
  adminController.getAllProfessors
);

router.get(
  "/getAllStudent",
  authenticateAdminToken,
  adminController.getAllStudent
);

router.get(
  "/getAllStudentProgramLevel",
  adminController.getStudentProgramLevel
);

router.post(
  "/getClassStudentByProgram",
  adminController.getClassStudentByProgram
);

router.post(
  "/validateStudent/:stud_id",
  authenticateAdminToken,
  adminController.ValidateStudent
);
router.post(
  "/validateProfessor/:prof_id",
  authenticateAdminToken,
  adminController.ValidateProfessor
);
router.post(
  "/resetStudentPassword/:stud_id",
  authenticateAdminToken,
  adminController.resetStudentPassword
);
router.post(
  "/resetProfessorPassword/:prof_id",
  authenticateAdminToken,
  adminController.resetProfessorPassword
);

router.delete(
  "/deleteStudent/:stud_id",
  authenticateAdminToken,
  adminController.deleteStudent
);
router.delete(
  "/deleteProfessor/:prof_id",
  authenticateAdminToken,
  adminController.deleteProfessor
);

router.get("/getLevelThreshold", adminController.getLevelThreshold);

router.put(
  "/updateLevelThreshold",
  authenticateAdminToken,
  adminController.updateLevelThreshold
);

module.exports = router;
