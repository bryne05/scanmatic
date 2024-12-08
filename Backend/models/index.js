const dbConfig = require("../config/dbConfig.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  timezone: dbConfig.timezone,
  dialectModule: pg,
  // pool: {
  //   max: dbConfig.pool.max,
  //   min: dbConfig.pool.min,
  //   acquire: dbConfig.pool.acquire,
  //   idle: dbConfig.pool.idle,
  // },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected..");
  })
  .catch((err) => {
    console.log("Error:" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//User Table
db.students = require("./studentsModel.js")(sequelize, DataTypes);
db.professors = require("./professorsModel.js")(sequelize, DataTypes);
db.admin = require("./adminModel.js")(sequelize, DataTypes);

//Other Table
db.shopItems = require("./shopItemsModel.js")(sequelize, DataTypes);
db.transactions = require("./transactionsModel.js")(sequelize, DataTypes);
db.subjects = require("./subjectsModel.js")(sequelize, DataTypes);
db.classes = require("./classesModel.js")(sequelize, DataTypes);

db.attendances = require("./attendancesModel.js")(sequelize, DataTypes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Done synchronizing model with database");
  })
  .catch((err) => {
    console.log("Error synchronizing model with database:" + err);
  });

//Relationships
db.admin.hasMany(db.students, {
  foreignKey: "admin_id",
});
db.students.belongsTo(db.admin, {
  foreignKey: "admin_id",
});

db.admin.hasMany(db.professors, {
  foreignKey: "admin_id",
});
db.professors.belongsTo(db.admin, {
  foreignKey: "admin_id",
});

//Professor and Shop
db.professors.hasMany(db.shopItems, {
  foreignKey: "prof_id",
});

db.shopItems.belongsTo(db.professors, {
  foreignKey: "prof_id",
});

//Students and Transaction
db.students.hasMany(db.transactions, {
  foreignKey: "stud_id",
});
db.transactions.belongsTo(db.students, {
  foreignKey: "stud_id",
});

//Shop and Transaction
db.shopItems.hasMany(db.transactions, {
  foreignKey: "item_id",
});

db.transactions.belongsTo(db.shopItems, {
  foreignKey: "item_id",
});

//Professor and Subject
db.professors.hasMany(db.subjects, {
  foreignKey: "prof_id",
});

db.subjects.belongsTo(db.professors, {
  foreignKey: "prof_id",
});

//Class and Subject

db.subjects.hasMany(db.classes, {
  foreignKey: "subject_id",
});

db.classes.belongsTo(db.subjects, {
  foreignKey: "subject_id",
});

//Class and Professor
db.professors.hasMany(db.subjects, {
  foreignKey: "prof_id",
});

db.classes.belongsTo(db.professors, {
  foreignKey: "prof_id",
});

//Attendance and Students
db.students.hasMany(db.attendances, {
  foreignKey: "stud_id",
});

db.attendances.belongsTo(db.students, {
  foreignKey: "stud_id",
});

//Attendance and Class
db.classes.hasMany(db.attendances, {
  foreignKey: "class_id",
  onDelete: "CASCADE",
});

db.attendances.belongsTo(db.classes, {
  foreignKey: "class_id",
});

module.exports = db;
