const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.header("token");
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user.user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

module.exports = {
    verifyToken
};
