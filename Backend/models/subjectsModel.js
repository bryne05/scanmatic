module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define("subject", {
    subject_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subject_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    subject_courseYearSection: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    subject_start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    subject_end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  });
  return Subject;
};
