const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");
const { AdminGalleryDesc } = require("../db/models/index");

const { authenticateUpload } = require("../middleware/authentication");

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the gallery des"
  });
});

router.post("/", authenticateUpload, async (req, res) => {
  // const data = req.body.imageData;
  try {
    const body = _.pick(req.body, [
      "postTitle",
      "description",
      "url",
      "imageData"
    ]);
    console.log(body);
    const postData = new AdminGalleryDesc({
      postTitle: body.postTitle,
      description: body.description,
      url: body.description,
      uploadFile: body.imageData
    });

    const finalData = await postData.save();
    res.json({
      message: "Add Post successful",
      data: finalData
    });

    console.log(postData);
  } catch (error) {
    res.status(400).json({
      message: "Somethings went wrong during the process. Please try again",
      error: error
    });
  }
  // console.log(data);
});

module.exports = router;
