const studentController = require("../controllers/studentController");
const shopController = require("../controllers/shopController");
const { authenticateStudToken } = require("../middleware/auth");
const router = require("express").Router();

router.post("/registerStudent", studentController.registerStudent);
router.post("/loginStudent", studentController.loginStudent);
router.get(
  "/getStudent",
  authenticateStudToken,
  studentController.getStudentProfile
);
router.put(
  "/updateStudent/",
  authenticateStudToken,
  studentController.updateStudentProfile
);
router.delete("/deleteStudent/", studentController.deleteStudent);

//Student Shop
router.get(
  "/getStudentShopItems/",
  authenticateStudToken,
  shopController.readStudentShopItems
);

router.post(
  "/buyStudentShopItems/:item_id",
  authenticateStudToken,
  shopController.buyStudentShopItems
);

router.get(
  "/getStudentTransactions",
  authenticateStudToken,
  shopController.getStudentTransaction
);


module.exports = router;
