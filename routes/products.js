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


// Add Product
router.post("/add", verifyToken, async (req, res) => {
  try {
    const createProdQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id int NOT NULL AUTO_INCREMENT,
      itemcode varchar(45) NOT NULL,
      name varchar(255) NOT NULL,
      price int NOT NULL,
      model varchar(45) NOT NULL,
      note varchar(255) DEFAULT NULL,
      stock int NOT NULL,
      category varchar(75) NOT NULL,
      PRIMARY KEY (id)
    )
  `;

    db.query(createProdQuery, (err, result) => {
      if (err) {
        console.error("Error creating 'files' table:", err);
      } else {
        const insertQuery =
          "INSERT INTO products (`name`, `itemcode`, `model`, `price`, `stock`, `category`) VALUES (?, ? , ?, ?, ?, ?)";

        db.query(
          insertQuery,
          [
            req.body.name,
            req.body.itemcode,
            req.body.model,
            req.body.price,
            req.body.stock,
            req.body.category,
          ],
          (err, result) => {
            if (err) {
              return res.json({ message: "Error adding new product" });
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

// Edit Product
router.put("/edit/:id", verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, itemcode, model, price, stock, category } = req.body;
    const editQuery =
      "UPDATE products SET name = ?, itemcode = ?, model = ?, price = ?, stock = ?, category = ? WHERE id = ?";

    db.query(
      editQuery,
      [name, itemcode, model, price, stock, category, productId],
      (err, result) => {
        if (err || result.affectedRows === 0) {
          return res.json({ message: "Error editing product" });
        }

        res.json({ message: "Product edited successfully" });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Delete Product
router.post("/delete/:id", verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const deleteQuery = "DELETE FROM products WHERE id = ?";

    db.query(deleteQuery, [productId], (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.json({ message: "Error deleting product" });
      }

      res.json({ message: "Product deleted successfully" });
    });
  } catch (error) {
    console.log(error);
  }
});

// View Products
router.get("/view", verifyToken, async (req, res) => {
  const query = "SELECT * FROM products";

  db.query(query, [], (err, result) => {
    if (err) {
      return res.json({ message: "Error getting products" });
    }

    res.json({ result });
  });
});

module.exports = router;
