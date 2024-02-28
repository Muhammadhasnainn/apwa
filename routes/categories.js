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

router.post("/add", verifyToken, async (req, res) => {
  try {
    const createProdQuery = `
    CREATE TABLE IF NOT EXISTS categories (
      id int NOT NULL AUTO_INCREMENT,
      name varchar(255) NOT NULL,
      \`status\` tinyint NOT NULL DEFAULT 0,
      PRIMARY KEY (id)
    )
  `;

    db.query(createProdQuery, (err, result) => {
      if (err) {
        console.error("Error creating 'files' table:", err);
      } else {
        console.log("rinning");
        const insertQuery =
          "INSERT INTO categories (`name`, `status`) VALUES (?, ?)";

        db.query(
          insertQuery,
          [req.body.name, req.body.status],
          (err, result) => {
            if (err) {
              return res.json({ message: "Error adding new category" });
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

router.post("/delete/:id", verifyToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deleteQuery = "DELETE FROM categories WHERE id = ?";

    db.query(deleteQuery, [categoryId], (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.json({ message: "Error deleting category" });
      }

      res.json({ message: "Category deleted successfully" });
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/edit/:id", verifyToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, status } = req.body;
    const editQuery = "UPDATE categories SET name = ?, status = ? WHERE id = ?";

    db.query(editQuery, [name, status, categoryId], (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.json({ message: "Error editing category" });
      }

      res.json({ message: "Category edited successfully" });
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/view", verifyToken, async (req, res) => {
  const query = "SELECT * FROM categories";

  db.query(query, [], (err, result) => {
    if (err) {
      return res.json({ message: "Error while getting categories" });
    }

    res.json({ result });
  });
});

module.exports = router;
