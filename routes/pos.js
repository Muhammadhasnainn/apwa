const express = require("express");
const db = require("../config/db");

const { verifyToken } = require("../middlewares/verify");

const router = express.Router();

// ADD POS
router.post("/add", verifyToken, async (req, res) => {
  try {
    
    const insertQuery =
      "INSERT INTO pos (`category`,  `products` , `customer`, `total`, `date`) VALUES (?, ?, ?,  ?, ?)";

    req.body.products.forEach((product) => {
      const updateStockQuery =
        "UPDATE products SET stock = stock - ? WHERE id = ?";
      db.query(updateStockQuery, [product.quantity, product.id], (err) => {
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
        req.body.category,
        JSON.stringify(req.body.products),
        req.body.customer,
        totalcost,
        new Date()
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

// Return POS
router.put('/delete/:posId', verifyToken, async (req, res) => {
  try {
    const posId = req.params.posId;

    const fetchProductsQuery = 'SELECT products FROM pos WHERE id = ?';
    db.query(fetchProductsQuery, [posId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: 'Error fetching POS details' });
      }

      if(result.length > 0){
      const products = result[0].products;

      products.forEach((product) => {
        const updateStockQuery =
          'UPDATE products SET stock = stock + ? WHERE id = ?';
        db.query(updateStockQuery, [product.quantity, product.id], (err) => {
          if (err) {
            console.log(err);
            return res.json({ message: 'Error updating product stock' });
          }
        });
      });

      const softDeleteQuery = 'UPDATE pos SET `return` = 1 WHERE id = ?';
      db.query(softDeleteQuery, [posId], (err) => {
        if (err) {
          console.log(err);
          return res.json({ message: 'Error returning POS entry' });
        }

        res.json({ message: 'POS entry returned!' });
      });
    }else{
      return res.json({ message: 'Not Found' });
    }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// View POS
router.get("/view", verifyToken, async (req, res) => {
  const query = "SELECT * FROM pos";

  db.query(query, [], (err, result) => {
    if (err) {
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});


// View PURCHASED POS
router.get("/viewpurchased", verifyToken, async (req, res) => {
  const query = "SELECT * FROM pos WHERE `return` = ?";

  db.query(query, [0], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});


// View RETURN POS
router.get("/viewreturns", verifyToken, async (req, res) => {
  const query = "SELECT * FROM pos where `return` = ?";

  db.query(query, [1], (err, result) => {
    if (err) {
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});


module.exports = router;
