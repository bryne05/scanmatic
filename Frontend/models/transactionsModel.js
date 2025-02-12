module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("transaction", {
    transaction_id: {
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
    isVerified:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    }
  });
  return Transaction;
};
