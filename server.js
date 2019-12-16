require("./config/config");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("./db/mongoose");

// const GridFsStorage = require("multer-gridfs-storage");
// const crypto = require('crypto');

var multer = require("multer");
// var upload = multer({ dest: "uploads/" }).single('file');

const app = express();
app.use(multer({ dest: "./public/" }).single("uploadFile"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const admin = require("./routes/admin");
const powercard = require("./routes/powerCard");
const admingallery = require("./routes/adminGal");
const activate = require("./routes/activate");
const dealer = require("./routes/dealer");

const port = process.env.PORT || 3000;

app.use("/public", express.static("public"));

app.use("/admin", admin);
app.use("/powercard", powercard);
app.use("/admingallery", admingallery);
app.use("/activate", activate);
app.use("/dealer", dealer);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
