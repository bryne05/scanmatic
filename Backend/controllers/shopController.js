const db = require("../models");
const Sequelize = require("sequelize");

const ShopItem = db.shopItems;
const Student = db.students;
const Transaction = db.transactions;
const Professor = db.professors;
//Student Shop
const readStudentShopItems = async (req, res) => {
  try {
    let studID = req.stud_id;

    const student = await Student.findByPk(studID);

    const studentcourseYearSection = student.courseYearSection;

    const shopItems = await ShopItem.findAll({
      // Get ALL shop items first
      where: { item_classSection: studentcourseYearSection },
      include: [
        {
          model: Professor,
          attributes: ["first_name", "middle_name", "last_name"],
        },
      ],
      attributes: ["item_id", "item_name", "item_quantity", "item_price","item_subject"],
      order: [["createdAt", "DESC"]],
    });

    const redeemedItems = await Transaction.findAll({
      // Get ALL redeemed items for the student
      where: { stud_id: studID }, // No need to filter by shopItem.item_id here
      attributes: ["item_id"], // Only need the item_ids
    });

    const redeemedItemIds = redeemedItems.map(
      (transaction) => transaction.item_id
    ); // Extract item_ids

    const filteredShopItems = shopItems.filter((item) => {
      return item.item_quantity > 0 && !redeemedItemIds.includes(item.item_id);
    });

    res.status(200).json({ filteredShopItems });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error getting shopItems for student", error.message);
  }
};

const buyStudentShopItems = async (req, res) => {
  try {
    const stud_id = req.stud_id;
    const item_id = req.params.item_id;

    const shopItem = await ShopItem.findOne({ where: { item_id: item_id } });
    const student = await Student.findByPk(stud_id);

    if (!shopItem) {
      return res.status(404).json({ message: "Shop item not found" });
    }

    if (student.current_token >= shopItem.item_price) {
      if (shopItem.item_quantity == 0) {
        res.status(400).json({ message: "Item Out of Stock" });
        return;
      }
      await Student.update(
        {
          current_token: Sequelize.literal(
            `${student.current_token} - ${shopItem.item_price}`
          ),
        },
        { where: { stud_id: stud_id } }
      );

      await ShopItem.update(
        { item_quantity: shopItem.item_quantity - 1 },
        { where: { item_id: item_id } }
      );

      //Needed for Postgre cause it cant count properly
      //   await db.sequelize.query(`
      //   SELECT setval(
      //     'transactions_transaction_id_seq',
      //     (SELECT MAX(transaction_id) FROM transactions)
      //   )
      // `);
      await Transaction.create({
        stud_id: stud_id,
        item_id: item_id,
        item_name: shopItem.item_name,
        item_quantity: 1,
        item_price: shopItem.item_price,
        isVerified: false,
      });
      res.status(200).json({ message: "Purchase successfull" });
      return;
    }

    res.status(400).json({ message: "Insufficient Token" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error getting shopItems for student", error.message);
  }
};

const getStudentTransaction = async (req, res) => {
  try {
    const studentID = req.stud_id;
    const studentTransaction = await Transaction.findAll({
      where: { stud_id: studentID },
      attributes: [
        "item_name",
        "item_quantity",
        "item_price",
        "createdAt",
        "isVerified",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ studentTransaction });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error getting shopItems for student", error.message);
  }
};

// Professor Shop
const createShopItem = async (req, res) => {
  try {
    console.log(req.body);
    let data = {
      prof_id: req.prof_id,
      item_name: req.body.item_name,
      item_quantity: req.body.item_quantity,
      item_price: req.body.item_price,
      item_classSection: req.body.item_classSection.toUpperCase(),
      item_subject: req.body.item_subject.toUpperCase(),
    };

    const existingShopItem = await ShopItem.findAll({
      where: {
        item_name: data.item_name,
        item_classSection: data.item_classSection,
        item_subject: req.body.item_subject,
      },
    });

    if (existingShopItem.length === 0) {
      const shopItem = await ShopItem.create(data);

      res.status(200).json({ message: "Item Created Successfully" });

      return;
    } else {
      res.status(409).json({ message: "Shop item already exists" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error Creating Item", error.message);
  }
};

const getShopItems = async (req, res) => {
  try {
    const professorID = req.prof_id;
    const shopItem = await ShopItem.findAll({
      where: { prof_id: professorID },
      attributes: [
        "item_id",
        "item_name",
        "item_quantity",
        "item_price",
        "item_classSection",
        "item_subject",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ shopItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error Creating Item", error.message);
  }
};

const UpdateShopItems = async (req, res) => {
  try {
    const professorID = req.prof_id;
    const itemID = req.params.item_id;

    const updateData = {
      item_name: req.body.item_name,
      item_quantity: req.body.item_quantity,
      item_price: req.body.item_price,
      item_classSection: req.body.item_classSection.toUpperCase(),
      item_subject: req.body.item_subject.toUpperCase(),
    };

    const [updatedCount] = await ShopItem.update(updateData, {
      where: { prof_id: professorID, item_id: itemID },
    });

    if (updatedCount > 0) {
      res.status(200).json({ message: "Shop item updated successfully" });
    } else {
      res.status(404).json({ message: "Shop item not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error Creating Item", error.message);
  }
};

const deleteShopItems = async (req, res) => {
  try {
    const professorID = req.prof_id;
    const item_id = req.params.item_id;
    const shopItem = await ShopItem.destroy({
      where: { prof_id: professorID, item_id: item_id },
    });

    if (shopItem > 0) {
      res.status(200).json({ message: "Shop item deleted successfully" });
    } else {
      res.status(404).json({ message: "Shop item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error deleting item", error.message);
  }
};

const getProfessorShopTransaction = async (req, res) => {
  try {
    const professorId = req.prof_id;

    // Find all shop items belonging to the professor
    const shopItems = await ShopItem.findAll({
      where: { prof_id: professorId },
    });

    // Map over each shop item and fetch transactions related to that item
    const shopTransactions = await Promise.all(
      shopItems.map(async (shopItem) => {
        const transactions = await Transaction.findAll({
          where: { item_id: shopItem.item_id },
          include: [
            {
              model: ShopItem,
              attributes: ["item_name", "item_price"],
            },
            {
              model: Student,
              attributes: ["first_name", "middle_name", "last_name"],
            },
          ],
          attributes: ["transaction_id", "createdAt", "isVerified"],
          order: [["createdAt", "DESC"]],
        });

        return { shopItem, transactions };
      })
    );

    const filteredShopTransactions = shopTransactions
      .filter((shopTransaction) => shopTransaction.transactions.length > 0)
      .map((shopTransaction) => shopTransaction.transactions);

    res.status(200).json({ filteredShopTransactions });
  } catch (error) {
    console.error("Error getting professor shop transactions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyTransaction = async (req, res) => {
  try {
    const transactionID = req.body.transaction_id;

    const updateVerifyStatus = await Transaction.update(
      { isVerified: true },
      { where: { transaction_id: transactionID } }
    );

    if (!updateVerifyStatus) {
      res.status(404).json({ message: "Transaction do not exist" });
    }

    res.status(200).json({ message: "Transaction Verified" });
  } catch (error) {
    console.error("Error verifying transaction", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  //Student
  readStudentShopItems,
  buyStudentShopItems,
  getStudentTransaction,

  //Professor
  createShopItem,
  getShopItems,
  UpdateShopItems,
  deleteShopItems,
  getProfessorShopTransaction,
  verifyTransaction,
};
