require("./config/config");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("./db/mongoose");

var multer = require("multer"); //we dont need this

const app = express();
app.use(multer({ dest: "./public/" }).single("uploadFile"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Routes
const admin = require("./routes/admin");
const powercard = require("./routes/powerCard");
const admingallery = require("./routes/adminGal");
const activate = require("./routes/activate");
const dealer = require("./routes/dealer");
const resetPassword = require("./routes/passwordReset");
const galleryPost = require("./routes/galleryPost");

const port = process.env.PORT || 3000;

app.use("/public", express.static("public"));

app.use("/admin", admin);
app.use("/powercard", powercard);
app.use("/admingallery", admingallery);
app.use("/activate", activate);
app.use("/dealer", dealer);
app.use("/resetPassword", resetPassword);
app.use("/galleryPost", galleryPost);

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
