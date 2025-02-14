const { defaultValueSchemable } = require("sequelize/lib/utils");

module.exports = (sequelize, DataTypes) => {
  const Professor = sequelize.define("professor", {
    prof_id: {
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
    isValidated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
  });
  return Professor;
};
