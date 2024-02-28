const express = require("express");
const mysql = require("mysql2");

const { verifyToken } = require("../middlewares/verify");

const router = express.Router();

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

// ADD Purchases
router.post("/add", verifyToken, async (req, res) => {
  try {
    const createPurQuery = `
    CREATE TABLE IF NOT EXISTS purchase (
      id int NOT NULL AUTO_INCREMENT,
      supplier varchar(75) NOT NULL,
      products json NOT NULL,
      total int NOT NULL,
      \`return\` tinyint NOT NULL DEFAULT 0,
      date datetime NOT NULL,
      PRIMARY KEY (id)
    )
  `;

    db.query(createPurQuery, (err, result) => {
      if (err) {
        console.error("Error creating 'supplier' table:", err);
      } else {
        const insertQuery =
          "INSERT INTO purchase (`products` , `supplier`, `total`, `date`) VALUES (?, ?, ?, ?)";

        req.body.products.forEach((product) => {
          const updateStockQuery =
            "UPDATE products SET stock = stock + ? WHERE id = ?";
          db.query(updateStockQuery, [product.stock, product.id], (err) => {
            if (err) {
              console.log(err);
              return res.json({ message: "Error updating product stock" });
            }
          });
        });

        const totalcost = req.body.products.reduce(
          (total, product) => total + product.price * product.quantity,
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
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// View Purchases
router.get("/view", verifyToken, async (req, res) => {
  const query = "SELECT * FROM purchase";

  db.query(query, [], (err, result) => {
    if (err) {
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});

// View PURCHASED orders
router.get("/viewpurchased", verifyToken, async (req, res) => {
  const query = "SELECT * FROM purchase WHERE `return` = ?";

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
  const query = "SELECT * FROM purchase where `return` = ?";

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
    const createSupQuery = `
    CREATE TABLE IF NOT EXISTS supplier (
      id int NOT NULL AUTO_INCREMENT,
      name varchar(255) NOT NULL,
      PRIMARY KEY (id)
    )
  `;

    db.query(createSupQuery, (err, result) => {
      if (err) {
        console.error("Error creating 'supplier' table:", err);
      } else {
        const insertQuery = "INSERT INTO supplier (`name`) VALUES (?)";

        db.query(insertQuery, [req.body.name], (err, result) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Error adding new Supplier " });
          }

          res.json({ id: result.insertId, message: "Added successfully" });
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
