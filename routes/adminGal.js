// const express = require("express");
// const router = express.Router();

// const GridFsStorage = require("multer-gridfs-storage");
// const crypto = require("crypto");

// var multer = require("multer");
// // var upload = multer({ dest: "uploads/" });

// const storage = new GridFsStorage({
//   url:process.env.MONGODB_URI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err)
//         }
//         const filename = file.originalname
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads',
//         }
//         resolve(fileInfo)
//       })
//     })
//   },
// })

// const upload = multer({ storage })

// router.post('/', upload.single('img'), (req, res, err) => {
//   if (err) throw err
//   res.status(201).send()
// })

// router.get("/", (req, res) => {
//   console.log(__dirname);
//   res.sendFile(__dirname + "/index.html");
// });

//````````````````````````````````````````````````````````````````````````````````````````````````````
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");

const adminGal = require("../db/models/adminGallery.model");

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

router.post("/upload", upload.array("avatar", 6), (req, res, next) => {
  // console.log(req.body);

  let body = _.pick(req.body, [
    "postTitle",
    "uploadFile",
    "description",
    "url"
  ]);
  // console.log(body);
  //Adding pictures by Looping
  // const reqFiles = [];
  // const url = req.protocol + "://" + req.get("host");
  // console.log(req.files);
  // for (var i = 0; i < req.files.length; i++) {
  //   reqFiles.push(url + "/public/" + req.files[i].filename);
  // }
  // console.log(req.file);
  const admingallery = new adminGal({
    postTitle: body.postTitle,
    description: body.description,
    url: body.url,
    uploadFile: req.file
  });

  admingallery
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Done upload!",
        userCreated: {
          _id: result._id,
          uploadFile: result.avatar
        }
      });
    })
    .catch(err => {
      console.log(err),
        res.status(500).json({
          error: err
        });
    });
});

router.get("/list", (req, res, next) => {
  console.log(res.body);
  adminGal.find().then(data => {
    res.status(200).json({
      message: "User list retrieved successfully!",
      users: data
    });
  });
});

module.exports = router;
