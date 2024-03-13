const express = require("express");
const db = require("../config/db");

const { verifyToken } = require("../middlewares/verify");

const router = express.Router();

// ADD Purchases
router.post("/add", verifyToken, async (req, res) => {
  try {
    const insertQuery =
      "INSERT INTO purchase (`products` , `supplier`, `total`, `date`) VALUES (?, ?, ?, ?)";

    req.body.products.forEach((product) => {
      const updateStockQuery =
        "UPDATE products SET stock = stock + ? WHERE id = ?";
      db.query(updateStockQuery, [Number(product.quantity), product.id], (err) => {
        if (err) {
          console.log(err);
          return res.json({ message: "Error updating product stock" });
        }
      });
    });

    const totalcost = req.body.products.reduce(
      (total, product) => Number(total) + Number(product.price) * product.quantity,
      0
    );

    db.query(
      insertQuery,
      [
        JSON.stringify(req.body.products),
        req.body.supplier,
        totalcost,
        new Date(),
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.json({ message: "Error adding new POS" });
        }

        res.json({ id: result.insertId, message: "Added successfully" });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// View Purchases
router.get("/view", verifyToken, async (req, res) => {
  const query = "SELECT * FROM purchase ORDER BY date DESC";

  db.query(query, [], (err, result) => {
    if (err) {
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});

// View PURCHASED orders
router.get("/viewpurchased", verifyToken, async (req, res) => {
  const query = "SELECT * FROM purchase WHERE `return` = ? ORDER BY date DESC";

  db.query(query, [0], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});

// View RETURN purchases
router.get("/viewreturns", verifyToken, async (req, res) => {
  const query = "SELECT * FROM purchase where `return` = ? ORDER BY date DESC";

  db.query(query, [1], (err, result) => {
    if (err) {
      return res.json({ message: "Error getting records" });
    }
    res.json({ result });
  });
});

// Add Supplier
router.post("/addsupplier", verifyToken, async (req, res) => {
  try {

        const insertQuery = "INSERT INTO supplier (`name`) VALUES (?)";

        db.query(insertQuery, [req.body.name], (err, result) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Error adding new Supplier " });
          }

          res.json({ id: result.insertId, message: "Added successfully" });
        });
  } catch (error) {
    console.log(error);
  }
});

// View SUpplers
router.get("/viewsup", verifyToken, async (req, res) => {
  const query = "SELECT * FROM supplier";

  db.query(query, [], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});
module.exports = router;
