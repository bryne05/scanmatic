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




module.exports = {
  registerStudent,
  getStudentProfile,
  updateStudentProfile,
  loginStudent,
  changeStudentPassword,
  studentuploadImg,
  retrieveImg,
};
