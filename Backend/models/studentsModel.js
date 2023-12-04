module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define("student", {
    stud_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    courseYearSection: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    current_token: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    current_exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    current_level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });
  return Student;
};
