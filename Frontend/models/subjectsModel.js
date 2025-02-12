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

  });
  return Subject;
};
