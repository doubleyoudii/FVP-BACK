//````````````````````````````````````````````````````````````````````````````````````````````````````
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");
const fs = require("fs");
const { ObjectId } = require("mongodb");

const { AdminGallery } = require("../db/models/index");

// Multer File upload settings
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    cb(null, fileName);
  }
});

var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  }
});

//``````````````````````````````````````````````

router.post("/upload", upload.single("uploadFile"), (req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString("base64");
  // Define a JSONobject for the image attributes for saving to database

  if (!img) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }

  var finalImg = {
    contentType: req.file.mimetype,
    image: Buffer.from(encode_image, "base64")
  };

  const ffinal = new AdminGallery(finalImg);
  ffinal
    .save()
    .then(result => {
      console.log(result);
      res.json({
        data: result
      });
    })
    .catch(err => {
      console.log(err),
        res.status(500).json({
          error: err
        });
    });
});

// Get all images
router.get("/images", async (req, res) => {
  const photos = await AdminGallery.find();
  if (photos.length) {
    const imgArray = photos.map(element => ({
      ids: element._id
    }));
    // console.log(photos);
    console.log(typeof photos);
    // console.log(imgArray);
    // res.send(photos);
    res.send(imgArray);
  }
  // .then((result) => {
  //   const imgArray = result.map(element => element._id);
  //   console.log(imgArray);
  //   if (err) return console.log(err);
  //   res.send(imgArray);
  // });
});

// Get image by id
router.get("/image/:id", async (req, res) => {
  var id = req.params.id;
  AdminGallery.findOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) return console.log(err);
    console.log(result);
    res.contentType("image/jpeg");
    res.send(result.image.buffer);
  });
});

//````````````````````````````````````````````
// router.get("/list", (req, res, next) => {
//   console.log(res.body);
//   adminGal.find().then(data => {
//     res.status(200).json({
//       message: "User list retrieved successfully!",
//       users: data
//     });
//   });
// });

module.exports = router;
