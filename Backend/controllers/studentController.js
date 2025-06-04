const db = require("../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
//main model
const Student = db.students;
const Class = db.classes;
const Attendance = db.attendances;
const Subject = db.subjects;
const otpStore = new Map();
// Nodemailer transporter setup (REPLACE WITH YOUR EMAIL CREDENTIALS)
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function generateOTP(length = 4) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length - 1)];
  }
  return otp;
}

const sendOTP = async (req, res) => {
  const email = req.body.email;

  const otp = generateOTP();

  const expiry = Date.now() + 5 * 60 * 1000; // 5-minute expiry

  otpStore.set(email, { otp, expiry });
  console.log("otpStore contents:", otpStore);
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email address
    to: email,
    subject: "Your OTP for Registration",
    html: `<p>Your OTP is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 5 minutes.</p>`, // HTML email with OTP
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send OTP" });
    } else {
      return res.status(200).json({ message: "OTP sent successfully" });
    }
  });
};

const registerStudent = async (req, res) => {
  try {
    // const requiredFields = [
    //   "username",
    //   "password",
    //   "first_name",
    //   "last_name",
    //   "courseYearSection",
    // ];
    // for (const field of requiredFields) {
    //   if (!req.body[field]) {
    //     return res
    //       .status(400)
    //       .json({ message: `Missing required field: ${field}` });
    //   }
    // }
    const { otp, email } = req.body;
    // Or however you're getting the email

    const storedOTP = otpStore.get(email);

    if (
      !storedOTP ||
      storedOTP.otp !== String(otp) ||
      storedOTP.expiry < Date.now()
    ) {
      // Convert otp to string
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    let data = {
      admin_id: 5,
      username: req.body.username,
      password: hashPassword,
      first_name: req.body.first_name.toUpperCase(),
      middle_name: req.body.middle_name.toUpperCase(),
      last_name: req.body.last_name.toUpperCase(),
      courseYearSection: req.body.courseYearSection.toUpperCase(),
    };

    //Check username if in the database
    const existingUsername = await Student.findOne({
      where: {
        username: data.username,
      },
    });

    //Check first and last name if in the database
    const existingName = await Student.findOne({
      where: {
        first_name: data.first_name,
        last_name: data.last_name,
      },
    });

    //Validate if Student exists
    if (existingUsername) {
      res.status(400).json({ message: "Student Already Exist" });
      return;
    } else if (existingName) {
      res
        .status(400)
        .json({ message: "A Student with that name already exist" });
      return;
    }

    // Create Student
    const student = await Student.create(data);
    res.status(200).json({ message: "Student added successfully", student });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error registering student", error.message);
  }
};

const loginStudent = async (req, res) => {
  try {
    let data = {
      username: req.body.username,
      password: req.body.password,
    };
    //Look for username in the database
    const student = await Student.findOne({
      where: { username: data.username },
    });

    if (!student) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(data.password, student.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    if (!student.isValidated) {
      res.status(403).json({ message: "Student not Validated" });
      return;
    }

    //Create a token if the login verified
    const token = jwt.sign(
      {
        stud_id: student.stud_id,
        courseYearSection: student.courseYearSection,
      },
      process.env.TOKEN,
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({ message: "Student Logged in successfully", token });
  } catch (error) {
    cachesonsole.error("Server error:", error); // Log the error on the server!
    res.status(500).json({ message: "Internal Server Error" }); // Consistent error response
  }
};

const generateNewJwtToken = async (req, res) => {
  try {
    const { oldToken } = req.body;

    // Verify and decode the old token
    const decoded = jwt.verify(oldToken, process.env.TOKEN);

    // Extract the necessary claims from the decoded token
    const { stud_id, courseYearSection } = decoded;

    const QrToken = jwt.sign(
      {
        stud_id,
        courseYearSection,
      },
      process.env.TOKEN,
      {
        expiresIn: "10s",
      }
    );
    // Generate a new token with the same claims and expiration

    res.status(200).json({ QrToken });
  } catch (error) {
    console.error("Error generating new JWT token:", error);
    res.status(500).json({ message: "Failed to generate new token" });
  }
};
const getStudentProfile = async (req, res) => {
  try {
    let studentID = req.stud_id;
    const student = await Student.findByPk(studentID, {
      attributes: [
        "first_name",
        "middle_name",
        "last_name",
        "courseYearSection",
        "current_level",
        "current_exp",
        "current_token",
        "current_token",
      ],
    });

    if (!student) {
      res.status(404).json({ error: "Student not Found" });
      return;
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    let studentID = req.stud_id;
    const updatedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) =>
        typeof value === "string" ? [key, value.toUpperCase()] : [key, value]
      )
    );
    const [student] = await Student.update(updatedBody, {
      where: { stud_id: studentID },
    });
    if (student === 0) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    res.status(200).json({ message: "Student Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error Updating student", error.message);
  }
};

const changeStudentPassword = async (req, res) => {
  try {
    let studentID = req.stud_id;
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    await Student.update(
      { password: hashPassword },
      {
        where: { stud_id: studentID },
      }
    );

    res.status(200).json({ message: "Password changed Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error Updating password", error.message);
  }
};

const studentuploadImg = async (req, res) => {
  try {
    // Get studentID from the URL parameter
    const studentID = req.stud_id;

    // Find the student by their primary key (studentID)
    const findStudent = await Student.findByPk(studentID);

    if (!findStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Get the image buffer from the uploaded file
    const image = req.file.buffer;

    // Update the student's image
    findStudent.image = image;

    // Save the updated student record
    await findStudent.save();

    res.status(200).json({
      message: "Image uploaded successfully!",
      student: findStudent,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

const retrieveImg = async (req, res) => {
  try {
    const studentID = req.stud_id;
    const student = await Student.findByPk(studentID);

    if (!student || !student.image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imageBuffer = student.image;

    // Set MIME type to image/jpeg, assuming the image is a JPG
    const mimeType = "image/jpeg";

    // Set the correct MIME type in the response header
    res.setHeader("Content-Type", mimeType);

    // Send the image buffer as binary data
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};

const { Op } = require("sequelize");

const getStudentClassAndSubject = async (req, res) => {
  try {
    const studID = req.stud_id;
    const studentProgramLevel = req.courseYearSection;

    // Get all classes for the student
    const studentClassAndSubject = await Class.findAll({
      where: { class_courseYearSection: studentProgramLevel, isdeleted: false },
      attributes: ["class_id", ["createdAt", "Class Date"], "subject_id"],
    });

    if (studentClassAndSubject.length === 0) {
      return res.status(404).json({ message: "No Class Found" });
    }

    // Extract unique subject IDs from the results
    const subjectIds = [
      ...new Set(studentClassAndSubject.map((item) => item.subject_id)),
    ];

    // Fetch subject names dynamically for all subject IDs
    const studentSubjectName = await Subject.findAll({
      where: { subject_id: { [Op.in]: subjectIds } },
      attributes: ["subject_id", "subject_name"],
    });

    if (studentSubjectName.length === 0) {
      return res.status(404).json({ message: "No Subject Found" });
    }

    // Fetch attendance records
    const studentAttendance = await Attendance.findAll({
      where: { stud_id: studID },
      attributes: [
        "attendance_id",
        "stud_id",
        "class_id",
        ["createdAt", "Time in"],
      ],
    });

    if (studentAttendance.length === 0) {
      return res.status(404).json({ message: "No Attendance Found" });
    }

    res
      .status(200)
      .json({ studentSubjectName, studentClassAndSubject, studentAttendance });
  } catch (error) {
    console.error("Error fetching Student Class:", error);
    res.status(500).json({ error: "Failed to fetch Student class" });
  }
};

const getStudentSingleClassSubject = async (req, res) => {
  try {
    const subjectID = req.body.subject_id;
    const studID = req.stud_id;
    const studentProgramLevel = req.courseYearSection;

    // Get all classes for the student
    const studentSingleClassAndSubject = await Class.findAll({
      where: {
        subject_id: subjectID,
        class_courseYearSection: studentProgramLevel,
        isdeleted: false,
      },
      attributes: ["class_id", ["createdAt", "Class Date"], "subject_id"],
      order: [["createdAt", "ASC"]], // Sort from oldest to newest
    });

    if (studentSingleClassAndSubject.length === 0) {
      return res.status(404).json({ message: "No Class Found" });
    }

    // Extract valid class IDs
    const validClassIds = studentSingleClassAndSubject.map(
      (cls) => cls.class_id
    );

    // Fetch attendance records only for these classes
    const studentAttendance = await Attendance.findAll({
      where: {
        stud_id: studID,
        class_id: validClassIds,
      },
      attributes: [
        "attendance_id",
        "stud_id",
        "class_id",
        ["createdAt", "Time in"],
      ],
    });

    // Map attendance records for quick lookup
    const attendanceMap = new Map();
    studentAttendance.forEach((att) => attendanceMap.set(att.class_id, att));

    // Merge classes with attendance status and count streak
    let streak = 0;
    let currentStreak = 0;

    const mergedData = studentSingleClassAndSubject.map((cls) => {
      const attendanceRecord = attendanceMap.get(cls.class_id);
      const attended = !!attendanceRecord;

      if (attended) {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else {
        currentStreak = 0;
      }

      return {
        class_id: cls.class_id,
        "Class Date": cls["Class Date"],
        subject_id: cls.subject_id,
        attended,
        attendanceDetails: attendanceRecord ? attendanceRecord.get() : null,
      };
    });

    res.status(200).json({ mergedData, attendanceStreak: streak });
  } catch (error) {
    console.error("Error fetching Student Class:", error);
    res.status(500).json({ error: "Failed to fetch Student class" });
  }
};

const getStudentLeaderboard = async (req, res) => {
  try {
    const studID = req.stud_id;
    const studentProgramLevel = req.courseYearSection;

    // Get all classes for the student
    const studentLeaderboard = await Student.findAll({
      where: {
        courseYearSection: studentProgramLevel,
      },
      attributes: [
        "stud_id",
        "first_name",
        "middle_name",
        "last_name",
        "current_exp",
        "current_level",
      ],
      order: [["current_level", "DESC"]], // Sort from oldest to newest
    });

    if (!getStudentLeaderboard) {
      res.status(400).json({ error: "Failed to get Leaderboards" });
    }
    res.status(200).json({ studentLeaderboard, activeStudent: studID });
  } catch (error) {
    console.error("Error fetching Student Class:", error);
    res.status(500).json({ error: "Failed to fetch Student class" });
  }
};

module.exports = {
  registerStudent,
  getStudentProfile,
  updateStudentProfile,
  loginStudent,
  changeStudentPassword,
  studentuploadImg,
  retrieveImg,
  getStudentClassAndSubject,
  sendOTP,
  generateNewJwtToken,
  getStudentSingleClassSubject,
  getStudentLeaderboard,
};
