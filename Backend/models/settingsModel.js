module.exports = (sequelize, DataTypes) => {
  const Settings = sequelize.define("settings", {
    settings_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    level_threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1500,
    },
  });
  return Settings;
};
