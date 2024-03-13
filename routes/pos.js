const express = require("express");
const db = require("../config/db");

const { verifyToken } = require("../middlewares/verify");

const router = express.Router();

// ADD POS
router.post("/add", verifyToken, async (req, res) => {
  try {
    const insertQuery =
      "INSERT INTO pos (`category`,  `products` , `customer`, `total`, `discount`, `date`) VALUES (?, ?, ?, ?,  ?, ?)";

    req.body.products.forEach((product) => {
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

    db.query(
      insertQuery,
      [
        req.body.category,
        JSON.stringify(req.body.products),
        req.body.customer,
        req.body.total,
        req.body.discount,
        new Date(),
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error adding new POS" });
        }

        res.json({ id: result.insertId, message: "Added successfully" });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Edit POS
// router.put("/edit/:id", verifyToken, async (req, res) => {
//   try {
//     const insertQuery =
//       "UPDATE pos SET category = ?, products = ?, customer = ?, total = ?, discount = ?, date = ? WHERE id = ?";

//     req.body.productsInitial.forEach((product) => {
//       const updateStockQuery =
//         "UPDATE products SET stock = stock + ? WHERE id = ?";
//       db.query(updateStockQuery, [product.quantity, product.id], (err) => {
//         if (err) {
//           console.log(err);
//           return res
//             .status(500)
//             .json({ message: "Error updating product stock" });
//         }
//       });
//     });

//     req.body.products.forEach((product) => {
//       const updateStockQuery =
//         "UPDATE products SET stock = stock - ? WHERE id = ?";
//       db.query(updateStockQuery, [product.quantity, product.id], (err) => {
//         if (err) {
//           console.log(err);
//           return res
//             .status(500)
//             .json({ message: "Error updating product stock" });
//         }
//       });
//     });

//     req.body.productsInitial.forEach((Iproduct) => {
//       req.body.products.forEach((product) => {
//         if (
//           Iproduct.quantity > product.quantity &&
//           Iproduct.quantity - product.quantity !== 0
//         ) {
//           const insertQuery =
//             "INSERT INTO returns (`products`, `customer`, `date`) VALUES (?, ?, ?)";

//           db.query(
//             insertQuery,
//             [
//               JSON.stringify([
//                 {
//                   ...product,
//                   quantity: Iproduct.quantity - product.quantity,
//                   subtotal: Math.round(
//                     product.subtotal -
//                       (product.subtotal / 100) * req.body.discount
//                   ),
//                 },
//               ]),
//               req.body.customer,
//               new Date(),
//             ],
//             (err) => {
//               if (err) {
//                 console.log(err);
//                 return res
//                   .status(500)
//                   .json({ message: "Something went wrong" });
//               }
//             }
//           );
//         }
//         if (
//           product.quantity > Iproduct.quantity &&
//           product.quantity - Iproduct.quantity !== 0
//         ) {
//           const insertQuery =
//             "INSERT INTO returns (`products`, `customer`, `date`) VALUES (?, ?, ?)";

//           db.query(
//             insertQuery,
//             [
//               JSON.stringify([
//                 {
//                   ...product,
//                   quantity: product.quantity - Iproduct.quantity,
//                   subtotal: Math.round(
//                     product.subtotal -
//                       (product.subtotal / 100) * req.body.discount
//                   ),
//                 },
//               ]),
//               req.body.customer,
//               new Date(),
//             ],
//             (err) => {
//               if (err) {
//                 console.log(err);
//                 return res
//                   .status(500)
//                   .json({ message: "Something went wrong" });
//               }
//             }
//           );
//         }
//       });
//     });

//     db.query(
//       insertQuery,
//       [
//         req.body.category,
//         JSON.stringify(req.body.products),
//         req.body.customer,
//         req.body.total,
//         req.body.discount,
//         new Date(),
//         req.params.id,
//       ],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({ message: "Error adding new POS" });
//         }

//         res.json({ id: result.insertId, message: "Edited successfully" });
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });


router.put("/edit/:id", verifyToken, async (req, res) => {
  try {
    const insertQuery =
      "UPDATE pos SET category = ?, products = ?, customer = ?, total = ?, discount = ?, date = ? WHERE id = ?";

    const productsInitial = req.body.productsInitial || [];

    // Iterate through initial products and check for returns
    productsInitial.forEach((Iproduct) => {
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
            [
              JSON.stringify([returnProduct]),
              req.body.customer,
              new Date(),
            ],
            (err) => {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Something went wrong" });
              }
            }
          );
        }
      } else {
        const insertQuery =
          "INSERT INTO returns (`products`, `customer`, `date`) VALUES (?, ?, ?)";

        db.query(
          insertQuery,
          [
            JSON.stringify([Iproduct]),
            req.body.customer,
            new Date(),
          ],
          (err) => {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ message: "Something went wrong" });
            }
          }
        );
      }
    });

    // Update stock for initial products
    productsInitial.forEach((product) => {
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
    req.body.products.forEach((product) => {
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




// // Return POS
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

router.get("/viewpos/:id", verifyToken, async (req, res) => {
  const query = "SELECT * FROM pos WHERE id= ?";

  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.json({ message: "Error getting records" });
    }

    res.json({ result });
  });
});

// View Sales of Specific date with Pagination
router.get("/view/:date", verifyToken, async (req, res) => {
  const selectedDate = req.params.date;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!selectedDate) {
    return res.json({ message: "Please provide a date parameter" });
  }

  try {
    const query =
      "SELECT * FROM pos WHERE date LIKE ? ORDER BY date DESC LIMIT ? OFFSET ?";
    const fullDateTimeString = `${selectedDate}%`;

    db.query(query, [fullDateTimeString, limit, skip], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res
          .status(500)
          .json({ message: "Error getting records from the database" });
      }

      res.json({ result });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
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
