module.exports = (sequelize, DataTypes) => {
  const shopItem = sequelize.define("shopitem", {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    item_quantity: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    item_price: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    item_classSection: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    item_subject: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  });
  return shopItem;
};
