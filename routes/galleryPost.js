const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");
const { AdminGalleryDesc, AdminGallery } = require("../db/models/index");

const { authenticateUpload } = require("../middleware/authentication");

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the gallery des"
  });
});

router.post("/", async (req, res) => {
  try {
    const body = _.pick(req.body, [
      "postTitle",
      "description",
      "url",
      "uploadFile"
    ]);

    const base64data = body.uploadFile.replace(/^data:image\/png;base64,/, "");
    const imageData = new AdminGallery({
      image: Buffer.from(base64data, "base64")
    });

    await imageData.save();

    const postData = new AdminGalleryDesc({
      postTitle: body.postTitle,
      description: body.description,
      url: body.description,
      uploadFile: imageData._id
    });

    const postFinal = await postData.save();
    res.status(200).json({
      message: "Post to gallery successful",
      data: postData
    });
  } catch (error) {
    res.status(400).json({
      message: "Somethings went wrong during the process. Please try again",
      error: error
    });
  }
});

// router.post("/", authenticateUpload, async (req, res) => {
//   try {
//     const body = _.pick(req.body, [
//       "postTitle",
//       "description",
//       "url",
//       "imageData"
//     ]);
//     console.log(body);
//     const postData = new AdminGalleryDesc({
//       postTitle: body.postTitle,
//       description: body.description,
//       url: body.description,
//       uploadFile: body.imageData
//     });

//     const finalData = await postData.save();
//     res.json({
//       message: "Add Post successful",
//       data: finalData
//     });

//     console.log(postData);
//   } catch (error) {
//     res.status(400).json({
//       message: "Somethings went wrong during the process. Please try again",
//       error: error
//     });
//   }

// });

module.exports = router;
