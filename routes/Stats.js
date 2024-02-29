const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middlewares/verify");

const router = express.Router();

// Sale Products total
router.get("/sales", verifyToken, async (req, res) => {
  try {
    const grandTotalQuery =
      "SELECT SUM(total) AS grandTotal FROM pos WHERE `return` = 0";

    db.query(grandTotalQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error retrieving grand total" });
      }

      const grandTotal = result[0].grandTotal;
      res.json({ grandTotal });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error retrieving grand total" });
  }
});

// Month Sale
router.get("/salesmonthly", verifyToken, async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 

    const startDate = `${currentYear}-${currentMonth}-01`;
    const endDate = `${currentYear}-${currentMonth + 1}-01`;

    const grandTotalQuery = `
      SELECT SUM(total) AS grandTotal 
      FROM pos 
      WHERE 
        \`return\` = 0 AND 
        date >= '${startDate}' AND 
        date < '${endDate}'
    `;

    db.query(grandTotalQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error retrieving grand total" });
      }

      const grandTotal = result[0].grandTotal;
      res.json({ grandTotal });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error retrieving grand total" });
  }
});

// Return Products total
router.get("/salesreturn", verifyToken, async (req, res) => {
  try {
    const grandTotalQuery =
      "SELECT SUM(total) AS grandTotal FROM pos WHERE `return` = 1";

    db.query(grandTotalQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error retrieving grand total" });
      }

      const grandTotal = result[0].grandTotal ? result[0].grandTotal  : 0;
      res.json({ grandTotal });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error retrieving grand total" });
  }
});





// Purchased Products total
router.get("/purchased", verifyToken, async (req, res) => {
  try {
    const grandTotalQuery =
      "SELECT SUM(total) AS grandTotal FROM purchase WHERE `return` = 0";

    db.query(grandTotalQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error retrieving grand total" });
      }

      const grandTotal = result[0].grandTotal;
      res.json({ grandTotal });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error retrieving grand total" });
  }
});


// Return Purchased Products total
router.get("/returnpurchases", verifyToken, async (req, res) => {
  try {
    const grandTotalQuery =
      "SELECT SUM(total) AS grandTotal FROM purchase WHERE `return` = 1";

    db.query(grandTotalQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error retrieving grand total" });
      }

      const grandTotal = result[0].grandTotal ? result[0].grandTotal : 0;
      res.json({ grandTotal });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error retrieving grand total" });
  }
});

// Purchased Monthly
router.get("/purchasedmonthly", verifyToken, async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 

    const startDate = `${currentYear}-${currentMonth}-01`;
    const endDate = `${currentYear}-${currentMonth + 1}-01`;

    const grandTotalQuery = `
      SELECT SUM(total) AS grandTotal 
      FROM purchase
      WHERE 
        \`return\` = 0 AND 
        date >= '${startDate}' AND 
        date < '${endDate}'
    `;

    db.query(grandTotalQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error retrieving grand total" });
      }

      const grandTotal = result[0].grandTotal;
      res.json({ grandTotal });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error retrieving grand total" });
  }
});

module.exports = router;
