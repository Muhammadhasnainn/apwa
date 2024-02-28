const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth");
const catRoute = require("./routes/categories");
const prodRoute = require("./routes/products");
const posRoute = require("./routes/pos");
const purchaseRoute = require("./routes/purchase.js");
const statsRoute = require("./routes/Stats");
const uploadImgRoute = require("./middlewares/upload");
const path = require("path");
const mysql = require("mysql2");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const dirname = path.resolve();

app.use("/images", express.static(path.join(dirname, "images")));


const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

db.connect(function (err) {
  if (err) {
    console.log(err);
    console.log("Error in Connection");
  } else {
    console.log("Connected Successfully");
  }
});


// Create User table
const createTable = () => {
  const createUserQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id int NOT NULL,
      email varchar(75) NOT NULL,
      password varchar(255) NOT NULL,
      PRIMARY KEY (id)
    )
  `;

  db.query(createUserQuery, (err, result) => {
    if (err) {
      console.error("Error creating 'users' table:", err);
    } else {
    }
  });
};

createTable();

app.use("/api/auth", authRoute);
app.use("/api/category", catRoute);
app.use("/api/products", prodRoute);
app.use("/api/pos", posRoute);
app.use("/api/purchases", purchaseRoute);
app.use("/api/stats", statsRoute);
app.use("/api/uploadImg", uploadImgRoute);


app.disable("x-powered-by");
app.listen(8800, () => {
  console.log("Connected to Backend!");
});
