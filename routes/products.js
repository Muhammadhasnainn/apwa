const express = require("express");
const db = require("../config/db");

const { verifyToken } = require("../middlewares/verify");

const router = express.Router();

// Add Product
router.post("/add", verifyToken, async (req, res) => {
  try {
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
