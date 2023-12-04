const db = require("../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//main model
const Student = db.students;

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

const deleteStudent = async (req, res) => {
  try {
    let studentID = req.params.id;
    const student = await Student.destroy({ where: { stud_id: studentID } });
    res.status(200).json({ message: "Student Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting student", error.message);
  }
};

module.exports = {
  registerStudent,
  getStudentProfile,
  updateStudentProfile,
  deleteStudent,
  loginStudent,
};
