const multer = require("multer")
const express = require("express");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.array("files"), (req, res) => {
  const files = req.files;

  if (Array.isArray(files) && files.length > 0) {
    res.json(files);
  } else {
    throw new Error("File upload unsuccessful");
  }
});

module.exports =  router;
