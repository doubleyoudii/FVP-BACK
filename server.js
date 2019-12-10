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

const port = process.env.PORT;

app.use("/public", express.static("public"));

app.use("/admin", admin);
app.use("/powercard", powercard);
app.use("/admingallery", admingallery);

//``````````````````````````````````````````````````````````````````````````````````````````
// const MongoClient = require("mongodb").MongoClient;
// const myurl = process.env.MONGODB_URI;

// MongoClient.connect(myurl, (err, client) => {
//   if (err) return console.log(err);
//   db = client.db("test");
//   // app.listen(3000, () => {
//   //   console.log("listening on 3000");
//   // });
// });

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// // SET STORAGE
// var storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   }
// });

// var upload = multer({ storage: storage });

// app.post("/uploadfile", upload.single("myFile"), (req, res, next) => {
//   const file = req.file;
//   if (!file) {
//     const error = new Error("Please upload a file");
//     error.httpStatusCode = 400;
//     return next(error);
//   }
//   res.send(file);
// });

// app.post("/uploadphoto", upload.single("myImage"), (req, res) => {
//   var img = fs.readFileSync(req.file.path);
//   var encode_image = img.toString("base64");
//   // Define a JSONobject for the image attributes for saving to database

//   if (!img) {
//     const error = new Error("Please upload a file");
//     error.httpStatusCode = 400;
//     return next(error);
//   }

//   var finalImg = {
//     contentType: req.file.mimetype,
//     image: new Buffer(encode_image, "base64")
//   };
//   db.collection("quotes").insertOne(finalImg, (err, result) => {
//     console.log(result);

//     if (err) return console.log(err);

//     console.log("saved to database");
//     res.redirect("/");
//   });
// });
//``````````````````````````````````````````````````````````````````````````````````````````````````

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
