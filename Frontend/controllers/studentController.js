const db = require("../models");
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//main model
const Student = db.students;
const Class = db.classes;
const Attendance = db.attendances;
const Subject = db.subjects;


const supabaseUrl = process.env.SUPABASE_URL; // From environment variables
const supabaseKey = process.env.SUPABASE_ANON_KEY; // From environment variables

const supabase = createClient(supabaseUrl, supabaseKey);

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
    res.status(500).json({ message: "Internal Server Error" });
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
    const studentID = req.stud_id; // Assuming req.stud_id is how you get the ID

    const findStudent = await Student.findByPk(studentID);

    if (!findStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (!req.file) {
      // Check if a file was actually uploaded
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageFile = req.file; // The uploaded file object

    // 1. Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("images") // Your bucket name
      .upload(imageFile.originalname, imageFile.buffer, {
        contentType: imageFile.mimetype,
      }); // Use original filename and mimetype

    if (storageError) {
      console.error("Supabase Storage Error:", storageError);
      return res.status(500).json({ error: "Failed to upload to storage" }); // Important: Return here!
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/images/${storageData.path}`;

    // 2. Update the student record with the URL
    findStudent.image = imageUrl; // Store the URL, not the buffer
    await findStudent.save();

    res.status(200).json({
      message: "Image uploaded successfully!",
      student: findStudent, // Include the updated student data
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

    const imageUrl = student.image; // Get the image URL from the database

    // Redirect the request to the image URL
    res.redirect(302, imageUrl); // 302 (Found) is a common redirect status
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


module.exports = {
  registerStudent,
  getStudentProfile,
  updateStudentProfile,
  loginStudent,
  changeStudentPassword,
  studentuploadImg,
  retrieveImg,
  getStudentClassAndSubject,
};
