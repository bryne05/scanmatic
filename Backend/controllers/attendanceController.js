const db = require("../models");
const { Op, where } = require("sequelize");

const Subject = db.subjects;
const Class = db.classes;
const Student = db.students;
const Attendance = db.attendances;

const { Sequelize } = require("sequelize");
//Subject
const createSubject = async (req, res) => {
  try {
    let data = {
      prof_id: req.prof_id,
      subject_name: req.body.subject_name,
    };

    const findExistingSubject = await Subject.findAll({
      where: { prof_id: req.prof_id, subject_name: data.subject_name },
    });

    if (findExistingSubject.length > 0) {
      res.status(400).json({ message: "Subject Already Existing" });
      return;
    }

    await Subject.create(data);
    res.status(200).json({ message: "Subject Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error creating subject", error.message);
  }
};

const getAllSubject = async (req, res) => {
  try {
    const professorID = req.prof_id;

    const subject = await Subject.findAll({
      where: { prof_id: professorID },
      attributes: ["subject_id", "subject_name"],
    });

    res.status(200).json({ subject });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error reading Subject", error);
  }
};

const updateSubject = async (req, res) => {
  try {
    const professorID = req.prof_id;
    const subjectID = req.params.subject_id;
    const subject_name = req.body.subject_name;
    const findExistingSubject = await Subject.findAll({
      where: { prof_id: professorID, subject_name: subject_name },
    });

    if (findExistingSubject.length > 0) {
      res.status(400).json({ message: "Subject Already Existing" });
      return;
    }

    await Subject.update(req.body, {
      where: { prof_id: professorID, subject_id: subjectID },
    });

    res.status(200).json({ message: "Subject Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error Updating Subject", error);
  }
};

const deleteSubject = async (req, res) => {
  try {
    const professorID = req.prof_id;
    const subjectID = req.params.subject_id;

    const subject = await Subject.destroy({
      where: { prof_id: professorID, subject_id: subjectID },
    });

    if (!subject) {
      res.status(400).json({ message: "Subject does not exist" });
      return;
    }
    res.status(200).json({ message: "Subject Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error Deleting Subject", error);
  }
};

// Class
const createClass = async (req, res) => {
  try {
    const professorID = req.prof_id;
    const subjectID = parseInt(req.params.subject_id, 10);

    const data = {
      prof_id: professorID,
      subject_id: subjectID,
      class_courseYearSection: req.body.class_courseYearSection.toUpperCase(),
      class_token: req.body.class_token,
      class_exp: req.body.class_exp,
    };

    const findExistingClass = await Class.findAll({
      where: {
        prof_id: professorID,
        subject_id: subjectID,
        class_courseYearSection: data.class_courseYearSection,
        createdAt: {
          [Op.gte]: new Date(new Date() - 6 * 60 * 60 * 1000), // Within 6 hours
        },
      },
    });

    if (findExistingClass.length > 0) {
      res.status(400).json({ message: "Class Already Existed" });
      return;
    }

    const classes = await Class.create(data);
    res.status(200).json({ message: "Class Created Successfully", classes });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error creating Class", error);
  }
};

const getClass = async (req, res) => {
  try {
    const professorID = req.prof_id;
    const subjectID = parseInt(req.params.subject_id, 10);
    const classes = await Class.findAll({
      where: { prof_id: professorID, subject_id: subjectID },
      attributes: [
        "class_id",
        "createdAt",
        "class_courseYearSection",
        "class_token",
        "class_exp",
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedClasses = classes.map((classInstance) => ({
      createdAt: new Date(classInstance.createdAt).toLocaleString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Manila",
      }),
      class_id: classInstance.class_id,
      class_courseYearSection: classInstance.class_courseYearSection,
      clas_token: classInstance.class_token,
      class_exp: classInstance.class_exp,
    }));

    res.status(200).json({ classes: formattedClasses });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error reading Class", error);
  }
};

const updateClass = async (req, res) => {
  try {
    const professorID = req.prof_id;
    const subjectID = parseInt(req.params.subject_id, 10);
    const classID = parseInt(req.params.class_id, 10);

    const existingClass = await Class.findOne({
      where: {
        prof_id: professorID,
        subject_id: subjectID,
        class_id: classID,
      },
    });

    if (!existingClass) {
      res.status(404).json({ message: "Class not found" });
      return;
    }
    const updateClass = {
      class_courseYearSection: req.body.class_courseYearSection.toUpperCase(),
      class_token: req.body.class_token,
      class_exp: req.body.class_exp,
    };
    const classes = await Class.update(updateClass, {
      where: { prof_id: professorID, subject_id: subjectID, class_id: classID },
    });

    if (classes[0] > 0) {
      res.status(200).json({ message: "Class updated successfully" });
      return;
    }
    res.status(400).json({ message: "Cannot update: invalid User" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error reading Class", error);
  }
};

const deleteClass = async (req, res) => {
  try {
    const professorID = req.prof_id;
    const subjectID = parseInt(req.params.subject_id, 10);
    const classID = parseInt(req.params.class_id, 10);

    const existingClass = await Class.findOne({
      where: {
        prof_id: professorID,
        subject_id: subjectID,
        class_id: classID,
      },
    });

    if (!existingClass) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    await Class.destroy({
      where: {
        prof_id: professorID,
        subject_id: subjectID,
        class_id: classID,
      },
    });
    res.status(200).json({ message: "Class deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error reading Class", error);
  }
};

//Attendace
const createAttendance = async (req, res) => {
  try {
    const studentID = req.stud_id;
    const classID = parseInt(req.params.class_id, 10);
    const StudCourseSection = req.courseYearSection;

    const classes = await Class.findByPk(classID);
    const findExistingStudent = await Attendance.findOne({
      where: { stud_id: studentID, class_id: classID },
    });

    if (findExistingStudent) {
      res.status(400).json({ message: "Student Already In class" });
      return;
    }

    if (StudCourseSection !== classes.class_courseYearSection) {
      res.status(400).json({ message: "Incompatible Course" });
      return;
    }

    await Student.update(
      {
        current_token: db.sequelize.literal(
          `current_token + ${classes.class_token}`
        ),
        current_exp: db.sequelize.literal(`current_exp + ${classes.class_exp}`),
      },
      { where: { stud_id: studentID } }
    );

    // for postgre attendance cuz she cant count the id properly
    // await db.sequelize.query(`
    //   SELECT setval(
    //     'attendances_attendance_id_seq',
    //     (SELECT MAX(attendance_id) FROM attendances)
    //   )
    // `);
    const attend = await Attendance.create({
      stud_id: studentID,
      class_id: classID,
    });

    res.status(200).json({ message: "Student Participated in class", attend });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error creating attendance", error);
  }
};

const getAttendance = async (req, res) => {
  try {
    const studentID = req.stud_id;
    const classID = req.params.class_id;

    const attend = await Attendance.findAll({
      where: { class_id: classID },
      include: [
        {
          model: Student,
          attributes: [
            "first_name",
            "middle_name",
            "last_name",
            "courseYearSection",
          ],
        },
      ],
      attributes: ["attendance_id", "class_id", "stud_id", "createdAt"],
    });

    res.status(200).json({ attend });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error reading attendance", error);
  }
};

// For sql
// const getStudentEntry = async (req, res) => {
//   try {
//     const subjectID = parseInt(req.params.subject_id, 10);

//     const entry = await Attendance.findAll({
//       attributes: [
//         [
//           Sequelize.fn("COUNT", Sequelize.col("student.stud_id")),
//           "attendanceCount",
//         ],
//         [
//           Sequelize.fn("MAX", Sequelize.col("attendance.createdAt")),
//           "latestAttendedDate",
//         ],
//       ],
//       include: [
//         {
//           model: Student,
//           attributes: [
//             "first_name",
//             "middle_name",
//             "last_name",
//             "courseYearSection",
//           ],
//         },
//         {
//           model: Class,
//           attributes: ["class_id", "class_courseYearSection"],
//           where: { subject_id: subjectID },
//           include: [{ model: Subject, attributes: ["subject_name"] }],
//         },
//       ],
//       group: ["student.stud_id"],
//     });

//     const courseYearSection = entry[0]?.student?.courseYearSection;

//     const numOfClass = await Class.findAll({
//       where: {
//         class_courseYearSection: courseYearSection,
//         subject_id: subjectID,
//       },
//     });

//     res.status(200).json({
//       entry,
//       numberOfClasses: numOfClass.length,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//     console.error("Error reading student entry", error);
//   }
// };

// For posgre
const getStudentEntry = async (req, res) => {
  try {
    const subjectID = parseInt(req.params.subject_id, 10);

    const entry = await Attendance.findAll({
      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("student.stud_id")),
          "attendanceCount",
        ],
        [
          Sequelize.fn("MAX", Sequelize.col("attendance.createdAt")),
          "latestAttendedDate",
        ],
        "student.stud_id",
        "student.first_name",
        "student.middle_name",
        "student.last_name",
        "student.courseYearSection",
        "class.class_id",
        "class.class_courseYearSection",
        "class->subject.subject_id",
        "class->subject.subject_name",
      ],
      include: [
        {
          model: Student,
          attributes: [
            "stud_id",
            "first_name",
            "middle_name",
            "last_name",
            "courseYearSection",
          ],
        },
        {
          model: Class,
          attributes: ["class_id", "class_courseYearSection"],
          where: { subject_id: subjectID },
          include: [
            { model: Subject, attributes: ["subject_id", "subject_name"] },
          ],
        },
      ],
      group: [
        "student.stud_id",
        "student.first_name",
        "student.middle_name",
        "student.last_name",
        "student.courseYearSection",
        "class.class_id",
        "class.class_courseYearSection",
        "class->subject.subject_id",
        "class->subject.subject_name",
      ],
    });

    const courseYearSection = entry[0]?.student?.courseYearSection;

    const numOfClass = await Class.findAll({
      where: {
        class_courseYearSection: courseYearSection,
        subject_id: subjectID,
      },
    });

    res.status(200).json({
      entry,
      numberOfClasses: numOfClass.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error reading student entry", error);
  }
};

module.exports = {
  createSubject,
  getAllSubject,
  updateSubject,
  deleteSubject,

  createClass,
  getClass,
  updateClass,
  deleteClass,

  createAttendance,
  getAttendance,
  getStudentEntry,
};
