const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth");
const catRoute = require("./routes/categories");
const prodRoute = require("./routes/products");
const posRoute = require("./routes/pos");
const purchaseRoute = require("./routes/purchase.js");
const statsRoute = require("./routes/Stats");
const uploadImgRoute = require("./middlewares/upload");
const db = require("./config/db");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const dirname = path.resolve();

app.use("/images", express.static(path.join(dirname, "images")));

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
