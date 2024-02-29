const express = require("express");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../middlewares/verify");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../config/db");


router.post("/login", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  const email = req.body.email;
  const password = req.body.password;

  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [email], async (err, data) => {
    if (err) return res.json(err);

    if (data.length === 0) {
      return res.json({ message: "Email not found" });
    }

    const user = data[0];

    const passwordCompare = await bcrypt.compare(password, user.password);

    const userdata = {
      user: {
        id: user.id,
        username: user.email,
        isAdmin: user.isAdmin,
      },
    };

    const authToken = jwt.sign(userdata, process.env.JWT_SECRET);

    if (passwordCompare) {
      return res.json({
        success: true,
        message: "Login successful",
        authToken: authToken,
      });
    } else {
      return res.json({ success: false, message: "Incorrect password" });
    }
  });
});

module.exports = router;
