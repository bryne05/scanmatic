const db = require("../models");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Subject = db.subjects;
const Class = db.classes;
const Student = db.students;
const Attendance = db.attendances;
const Professor = db.professors;
const Admin = db.admin;
let studentMasterLists = {};
const loginAdmin = async (req, res) => {
  try {
    let data = {
      username: req.body.username,
      password: req.body.password,
    };

    if (!data.username || !data.password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    // Check the database for username
    const admin = await Admin.findOne({
      where: { username: data.username },
    });

    if (!admin) {
      res.status(401).json({ message: "Invalid Username or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(data.password, admin.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid Username or password" });
      return;
    }
    //Create a token if the login verified
    const token = jwt.sign({ admin_id: admin.admin_id }, process.env.TOKEN, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Admin Logged in Successfully", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.findAll({
      attributes: ["prof_id", "first_name", "middle_name", "last_name"],
    });

    res.status(200).json({ professors });
  } catch (error) {
    console.error("Error reading Professor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllStudent = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: [
        "stud_id",
        "courseYearSection",
        "first_name",
        "middle_name",
        "last_name",
      ],
      raw: true,
    });

    const studentMasterLists = {};

    if (students && students.length > 0) {
      students.forEach((student) => {
        const programLevel = student.courseYearSection;

        if (!studentMasterLists[programLevel]) {
          studentMasterLists[programLevel] = new Set();
        }

        studentMasterLists[programLevel].add(student.stud_id);
      });
    }

    // Convert each Set to an Array for JSON compatibility
    const formattedStudentMasterLists = {};
    for (const key in studentMasterLists) {
      formattedStudentMasterLists[key] = Array.from(studentMasterLists[key]);
    }

    res
      .status(200)
      .json({ students, studentMasterLists: formattedStudentMasterLists });
  } catch (error) {
    console.error("Error reading Student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStudentProgramLevel = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: ["courseYearSection"],
      raw: true,
    });

    const programLevels = new Set(); // Use a Set to store unique program levels

    if (students && students.length > 0) {
      students.forEach((student) => {
        programLevels.add(student.courseYearSection); // Add each program level to the Set
      });
    }

    const programLevelArray = Array.from(programLevels); // Convert the Set to an array

    res.status(200).json({ programLevels: programLevelArray });
  } catch (error) {
    console.error("Error reading Student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getClassStudentByProgram = async (req, res) => {
  try {
    const courseYearSection = req.body.courseYearSection;

    const students = await Student.findAll({
      where: {
        courseYearSection: courseYearSection,
      },
      attributes:["stud_id","first_name","middle_name","last_name", "courseYearSection"]
    });

    if (!students) {
      res.status(404).json({ message: "Program Level do not exist" });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error reading Student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const resetStudentPassword = async (req, res) => {
  try {
    const stud_id = req.params.stud_id; // Get the ID from URL parameter

    const defaultPassword = "pass";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    //verify if student exists
    const student = await Student.findOne({
      where: { stud_id: stud_id },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the password
    await Student.update(
      { password: hashedPassword },
      { where: { stud_id: stud_id } }
    );

    res.status(200).json({
      status: "Success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting student password:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const resetProfessorPassword = async (req, res) => {
  try {
    const prof_id = req.params.prof_id;

    const defaultPassword = "pass";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    //verify if professor exists
    const professor = await Professor.findOne({
      where: { prof_id: prof_id },
    });

    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    // Update the password
    await Professor.update(
      { password: hashedPassword },
      { where: { prof_id: prof_id } }
    );

    res.status(200).json({
      status: "Success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting student password:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const stud_id = req.params.stud_id;
    //verify if student exists
    const student = await Student.findOne({
      where: { stud_id: stud_id },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Student.destroy({ where: { stud_id: stud_id } });

    res.status(200).json({ message: "Student Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting student", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const deleteProfessor = async (req, res) => {
  try {
    const prof_id = req.params.prof_id;
    const professor = await Professor.findOne({
      where: { prof_id: prof_id },
    });

    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }
    await Professor.destroy({ where: { prof_id: prof_id } });
    res.status(200).json({ message: "Professor Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting student", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  loginAdmin,
  getAllProfessors,
  deleteProfessor,

  getAllStudent,
  resetStudentPassword,
  resetProfessorPassword,
  deleteStudent,
  getStudentProgramLevel,
  getClassStudentByProgram,
};
