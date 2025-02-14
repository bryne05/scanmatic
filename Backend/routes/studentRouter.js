const studentController = require("../controllers/studentController");
const shopController = require("../controllers/shopController");
const { authenticateStudToken } = require("../middleware/auth");
const router = require("express").Router();
const multer = require("multer");

// Set up Multer to handle file uploads (in memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.get(
  "/studentImgRetrieve",
  authenticateStudToken,
  studentController.retrieveImg
);

router.post(
  "/studentImgUpload",
  authenticateStudToken,
  upload.single("image"),
  studentController.studentuploadImg
);
router.get(
  "/getStudentClassAndSubject",
  authenticateStudToken,
  studentController.getStudentClassAndSubject
);
//OTP
router.post("/sendOTP", studentController.sendOTP);
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

router.put(
  "/updateStudentPassword",
  authenticateStudToken,
  studentController.changeStudentPassword
);

module.exports = router;
