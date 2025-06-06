module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("admin", {
    admin_id: {
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
  });
  return Admin;
};
