const db = require("../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//Database Model
const Professor = db.professors;

//PROFESSOR
const registerProfessor = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let data = {
      username: req.body.username,
      password: hashedPassword,
      first_name: req.body.first_name.toUpperCase(),
      middle_name: req.body.middle_name.toUpperCase(),
      last_name: req.body.last_name.toUpperCase(),
    };

    //Check username in the database
    const existingUsername = await Professor.findOne({
      where: {
        username: data.username,
      },
    });

    //Check first and last name in the database
    const existingName = await Professor.findOne({
      where: {
        first_name: data.first_name,
        last_name: data.last_name,
      },
    });

    //Validate if Professor exists
    if (existingUsername) {
      res.status(400).json({ message: "Professor Already Exist" });
      return;
    } else if (existingName) {
      res
        .status(400)
        .json({ message: "A Professor with that name already exist" });
      return;
    }
    //Create Professor
    const professors = await Professor.create(data);
    res
      .status(200)
      .json({ message: "Professor Created Successfully", professors });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error registering professor", error.message);
  }
};

const loginProfessor = async (req, res) => {
  try {
    let data = {
      username: req.body.username,
      password: req.body.password,
    };

    // Check the database for username
    const professor = await Professor.findOne({
      where: { username: data.username },
    });

    if (!professor) {
      res.status(401).json({ message: "Invalid Username or password" });
      return;
    }

    //Check if the password match
    const passwordMatch = await bcrypt.compare(
      data.password,
      professor.password
    );
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid Username or password" });
      return;
    }
    //Create a token if the login verified
    const token = jwt.sign({ prof_id: professor.prof_id }, process.env.TOKEN, {
      expiresIn: "24h",
    });
    res
      .status(200)
      .json({ message: "Professor Logged in Successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getProfessorProfile = async (req, res) => {
  try {
    let professorID = req.prof_id;
    let professor = await Professor.findByPk(professorID, {
      attributes: ["first_name", "middle_name", "last_name"],
    });
    if (!professor) {
      return res.status(404).json({ error: "Professor not Found" });
    }

    res.status(200).json(professor);
  } catch (error) {
    console.error("Error reading professor", error.message);
  }
};

const updateProfessorProfile = async (req, res) => {
  try {
    const updatedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) =>
        typeof value === "string" ? [key, value.toUpperCase()] : [key, value]
      )
    );

    let professorID = req.prof_id;
    const professor = await Professor.update(updatedBody, {
      where: { prof_id: professorID },
    });
    res.status(200).json({ message: "Professor Updated Successfully" });
  } catch (error) {
    console.error("Error updating professor", error.message);
  }
};

module.exports = {
  registerProfessor,
  loginProfessor,
  updateProfessorProfile,
  getProfessorProfile,
};
