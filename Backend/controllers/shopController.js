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
    // let courseYearSection = req.courseYearSection;

    const student = await Student.findByPk(studID);

    const studentcourseYearSection = student.courseYearSection;
    const shopItem = await ShopItem.findAll({
      where: { item_classSection: studentcourseYearSection },
      include: [
        {
          model: Professor,
          attributes: ["first_name", "middle_name", "last_name"],
        },
      ],
      attributes: ["item_id", "item_name", "item_quantity", "item_price"],
      order: [["createdAt", "DESC"]],
    });
    const filteredShopItems = shopItem.filter((item) => item.item_quantity > 0);

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
      await Transaction.create({
        stud_id: stud_id,
        item_id: item_id,
        item_name: shopItem.item_name,
        item_quantity: 1,
        item_price: shopItem.item_price,
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
      attributes: ["item_name", "item_quantity", "item_price", "createdAt"],
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
    let data = {
      prof_id: req.prof_id,
      item_name: req.body.item_name,
      item_quantity: req.body.item_quantity,
      item_price: req.body.item_price,
      item_classSection: req.body.item_classSection.toUpperCase(),
    };

    const existingShopItem = await ShopItem.findAll({
      where: {
        item_name: data.item_name,
        item_quantity: data.item_quantity,
        item_price: data.item_price,
        item_classSection: data.item_classSection,
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
          attributes: ["createdAt"],
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
};
