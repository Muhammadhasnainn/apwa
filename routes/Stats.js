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
// router.get("/salesreturn", verifyToken, async (req, res) => {
//   try {
//     const grandTotalQuery =
//       "SELECT COALESCE(SUM(JSON_UNQUOTE(JSON_EXTRACT(products, '$[0].subtotal'))), 0) AS grandTotal FROM returns";
//     db.query(grandTotalQuery, (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.json({ message: "Error retrieving grand total" });
//       }

//       const grandTotal = result[0].grandTotal ? result[0].grandTotal : 0;
//       res.json({ grandTotal });
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ message: "Error retrieving grand total" });
//   }
// });

router.get("/salesreturn", verifyToken, async (req, res) => {
  try {
    const grandTotalQuery =
      "SELECT COALESCE(SUM(JSON_UNQUOTE(JSON_EXTRACT(products, '$[0].price')) * JSON_UNQUOTE(JSON_EXTRACT(products, '$[0].quantity'))), 0) AS grandTotal FROM returns";
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

router.get("/getSales", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const query = `
  SELECT 
    DATE_FORMAT(date, '%Y-%m') AS month,
    SUM(total) AS total_sales
  FROM 
    pos
  WHERE 
    DATE_FORMAT(date, '%Y-%m') <= ?
  GROUP BY 
    DATE_FORMAT(date, '%Y-%m')
  ORDER BY 
    DATE_FORMAT(date, '%Y-%m');
`;

  db.query(
    query,
    [`${currentYear}-${currentMonth}`],
    async (queryErr, results) => {
      if (queryErr) {
        res.json(queryErr);
        return;
      }
      res.json(results);
    }
  );
});

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

// Route to get top 4 highest selling products
router.get("/top4products", verifyToken, (req, res) => {
  const top4ProductsQuery = `
  SELECT product_name, SUM(quantity) AS total_sold
  FROM (
    SELECT JSON_UNQUOTE(JSON_EXTRACT(products, CONCAT('$[', numbers.n, '].name'))) AS product_name,
           JSON_UNQUOTE(JSON_EXTRACT(products, CONCAT('$[', numbers.n, '].quantity'))) AS quantity
    FROM pos
    CROSS JOIN (
      SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    ) AS numbers
    WHERE JSON_UNQUOTE(JSON_EXTRACT(products, CONCAT('$[', numbers.n, ']'))) IS NOT NULL
  ) AS extracted_products
  GROUP BY product_name
  ORDER BY total_sold DESC
  LIMIT 4;
`;

  db.query(top4ProductsQuery, (err, result) => {
    if (err) {
      console.error("Error fetching top 4 products:", err);
      return res.status(500).json({ message: "Error fetching top 4 products" });
    }

    res.json(result);
  });
});

module.exports = router;
