module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define("class", {
    class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    class_courseYearSection: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    class_token: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    class_exp: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    isdeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  });
  return Class;
};
