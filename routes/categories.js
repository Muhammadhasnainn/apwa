const express = require("express");
const { verifyToken } = require("../middlewares/verify");
const db = require("../config/db");
const winston = require("winston");

const router = express.Router();
const logsDir = "logs";

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: `${logsDir}/app.log`,
      level: "info",
    }),
  ],
});

router.post("/add", verifyToken, async (req, res) => {
  try {
    const insertQuery =
      "INSERT INTO categories (`name`, `status`) VALUES (?, ?)";

    db.query(insertQuery, [req.body.name, req.body.status], (err, result) => {
      if (err) {
              logger.info(err);
        return res.json({ message: "Error adding new category" });
      }

      res.json({ id: result.insertId, message: "Added successfully" });
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
              logger.info(err);;
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
              logger.info(err);;
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
            logger.info(err);;
      return res.json({ message: "Error while getting categories" });
    }

    res.json({ result });
  });
});

router.get("/viewactive", verifyToken, async (req, res) => {
  const query = "SELECT * FROM categories  WHERE status = 0";

  db.query(query, [], (err, result) => {
    if (err) {
            logger.info(err);;
      return res.json({ message: "Error while getting categories" });
    }

    res.json({ result });
  });
});

module.exports = router;
