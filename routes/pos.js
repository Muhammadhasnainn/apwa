const express = require("express");
const db = require("../config/db");

const { verifyToken } = require("../middlewares/verify");

const router = express.Router();

// Add pos
router.post("/add", verifyToken, async (req, res) => {
  try {
    const insertQuery =
      "INSERT INTO pos (`category_id`,  `products` , `customer`, `total`, `discount`, `date`, `grandtotal`) VALUES (?, ?, ?, ?,  ?, ?, ?)";

    let insufficientStock = false;

    for (const product of req.body.products) {
      const [rows, fields] = await db
        .promise()
        .query("SELECT stock FROM products WHERE id = ?", [product.id]);
      const availableStock = rows[0].stock;
      if (availableStock < product.quantity) {
        insufficientStock = true;
        return res.status(400).json({
          message: "Insufficient stock for product: " + product.name,
        });
      }
    }

    if (insufficientStock) {
      return;
    }

    for (const product of req.body.products) {
      await db
        .promise()
        .query("UPDATE products SET stock = stock - ? WHERE id = ?", [
          product.quantity,
          product.id,
        ]);
    }

    const [result] = await db
      .promise()
      .query(insertQuery, [
        req.body.category,
        JSON.stringify(req.body.products),
        req.body.customer,
        req.body.total,
        req.body.discount,
        new Date(),
        req.body.grandtotal,
      ]);

    res.json({ id: result.insertId, message: "Added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// EDIT POS
router.put("/edit/:id", verifyToken, async (req, res) => {
  try {
    const insertQuery =
      "UPDATE pos SET category_id = ?, products = ?, customer = ?, total = ?, discount = ?, date = ? , grandtotal = ? WHERE id = ?";

    const productsInitial = req.body.productsInitial || [];

    let insufficientStock = false;
    for (const Iproduct of productsInitial) {
      const updatedProduct = req.body.products.find(
        (product) => product.id === Iproduct.id
      );

      if (updatedProduct) {
        const quantityDifference = Iproduct.quantity - updatedProduct.quantity;
        if (quantityDifference > 0) {
          const returnProduct = {
            ...updatedProduct,
            quantity: quantityDifference,
            subtotal: Math.round(
              updatedProduct.subtotal -
                (updatedProduct.subtotal / 100) * req.body.discount
            ),
          };

          const insertQuery =
            "INSERT INTO returns (`products`, `customer`, `date`) VALUES (?, ?, ?)";

          db.query(
            insertQuery,
            [JSON.stringify([returnProduct]), req.body.customer, new Date()],
            (err) => {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Something went wrong" });
              }
            }
          );
        } else {
          const [rows, fields] = await db
            .promise()
            .query("SELECT stock FROM products WHERE id = ?", [
              updatedProduct.id,
            ]);
          const availableStock = rows[0].stock;

          if (availableStock < updatedProduct.quantity) {
            insufficientStock = true;
            return res.status(400).json({
              message: "Insufficient stock for product: " + updatedProduct.name,
            });
          }
        }
      } else {
        const insertQuery =
          "INSERT INTO returns (`products`, `customer`, `date`) VALUES (?, ?, ?)";

        db.query(
          insertQuery,
          [JSON.stringify([Iproduct]), req.body.customer, new Date()],
          (err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: "Something went wrong" });
            }
          }
        );
      }
    }

    if (insufficientStock) {
      return;
    }

    // Update stock for initial products
    productsInitial.forEach(async (product) => {
      const updateStockQuery =
        "UPDATE products SET stock = stock + ? WHERE id = ?";
      db.query(updateStockQuery, [product.quantity, product.id], (err) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Error updating product stock" });
        }
      });
    });

    // Update stock for current products
    req.body.products.forEach(async (product) => {
      const updateStockQuery =
        "UPDATE products SET stock = stock - ? WHERE id = ?";
      db.query(updateStockQuery, [product.quantity, product.id], (err) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ message: "Error updating product stock" });
        }
      });
    });

    // Update POS entry
    db.query(
      insertQuery,
      [
        req.body.category,
        JSON.stringify(req.body.products),
        req.body.customer,
        req.body.total,
        req.body.discount,
        new Date(),
        req.body.grandtotal,
        req.params.id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error adding new POS" });
        }

        res.json({ id: result.insertId, message: "Edited successfully" });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Return POS
router.put("/delete/:posId", verifyToken, async (req, res) => {
  try {
    const posId = req.params.posId;

    const fetchProductsQuery = "SELECT products FROM pos WHERE id = ?";
    db.query(fetchProductsQuery, [posId], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error fetching POS details" });
      }

      if (result.length > 0) {
        const products = result[0].products;

        products.forEach((product) => {
          const updateStockQuery =
            "UPDATE products SET stock = stock + ? WHERE id = ?";
          db.query(updateStockQuery, [product.quantity, product.id], (err) => {
            if (err) {
              console.log(err);
              return res.json({ message: "Error updating product stock" });
            }
          });
        });

        const softDeleteQuery = "UPDATE pos SET `return` = 1 WHERE id = ?";
        db.query(softDeleteQuery, [posId], (err) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Error returning POS entry" });
          }

          res.json({ message: "POS entry returned!" });
        });
      } else {
        return res.json({ message: "Not Found" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// View POS with Pagination
router.get("/view", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  try {
    const query = "SELECT * FROM pos ORDER BY date DESC LIMIT ? OFFSET ?";

    db.query(query, [limit, skip], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error getting records" });
      }

      res.json({ result });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// View Pos of specific dates
router.get("/viewfilter", verifyToken, async (req, res) => {
  const fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!fromDate || !toDate) {
    return res.json({
      message: "Please provide both fromDate and toDate parameters",
    });
  }

  try {
    toDate = new Date(toDate);
    toDate.setDate(toDate.getDate() + 1);
    toDate = toDate.toISOString().split("T")[0];

    const query =
      "SELECT * FROM pos WHERE date >= ? AND date < ? ORDER BY date DESC LIMIT ? OFFSET ?";
    const fullFromDateTimeString = `${fromDate}%`;
    const fullToDateTimeString = `${toDate}%`;

    db.query(
      query,
      [fullFromDateTimeString, fullToDateTimeString, limit, skip],
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res
            .status(500)
            .json({ message: "Error getting records from the database" });
        }

        res.json({ result });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// View Sales of Specific date with Pagination
// router.get("/view/:date", verifyToken, async (req, res) => {
//   const selectedDate = req.params.date;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   if (!selectedDate) {
//     return res.json({ message: "Please provide a date parameter" });
//   }

//   try {
//     const query =
//       "SELECT * FROM pos WHERE date LIKE ? ORDER BY date DESC LIMIT ? OFFSET ?";
//     const fullDateTimeString = `${selectedDate}%`;

//     db.query(query, [fullDateTimeString, limit, skip], (err, result) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res
//           .status(500)
//           .json({ message: "Error getting records from the database" });
//       }

//       res.json({ result });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.get("/view/:fromDate/:toDate", verifyToken, async (req, res) => {
  const fromDate = req.params.fromDate;
  const toDate = req.params.toDate;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!fromDate || !toDate) {
    return res.status(400).json({
      message: "Please provide both 'fromDate' and 'toDate' parameters",
    });
  }

  // Validate date format (YYYY-MM-DD)
  if (!isValidDateFormat(fromDate) || !isValidDateFormat(toDate)) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Please use YYYY-MM-DD" });
  }

  try {
    const query =
      "SELECT * FROM pos WHERE DATE(date) BETWEEN ? AND ? ORDER BY date DESC LIMIT ? OFFSET ?";

    db.query(query, [fromDate, toDate, limit, skip], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res
          .status(500)
          .json({ message: "Error getting records from the database" });
      }

      res.json({ result });
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Function to validate date format (YYYY-MM-DD)
function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

router.get("/viewpos/:id", verifyToken, async (req, res) => {
  const query = ` SELECT pos.*, categories.name AS category_name
  FROM pos
  INNER JOIN categories ON pos.category_id = categories.id
  WHERE pos.id = ?;`;

  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});

// View PURCHASED POS
router.get("/viewpurchased", verifyToken, async (req, res) => {
  const query = "SELECT * FROM pos WHERE `return` = ? ORDER BY date DESC";

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
  const query = "SELECT * FROM returns ORDER BY date DESC";

  db.query(query, [1], (err, result) => {
    if (err) {
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});

module.exports = router;
