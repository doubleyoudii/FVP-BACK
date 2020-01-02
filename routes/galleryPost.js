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

    const base64data = body.uploadFile
      .split(",")
      .slice(1)
      .join("");
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
      data: postFinal
    });
  } catch (error) {
    res.status(400).json({
      message: "Somethings went wrong during the process. Please try again",
      error: error
    });
  }
});

//Create public and private version
router.get("/list/", async (req, res) => {
  try {
    const postLists = await AdminGalleryDesc.find();
    res.status(200).json({
      message: "Get Admin Post Lists successful",
      data: postLists
    });
  } catch (error) {
    res.status(400).json({
      message: "Somethings went wrong during the Process. Please try Again!",
      error: error
    });
  }
});

router.get("/list/post/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const specificPost = await AdminGalleryDesc.findById(id);

    if (!specificPost) {
      res.status(404).json({
        message: "Post do not exist"
      });
    }

    res.status(200).json({
      message: "Get Post by id success",
      data: specificPost
    });
  } catch (error) {
    res.status(400).json({
      message: "Somethings went wrong during the process. Please Try again!",
      error: error
    });
  }
});

router.patch("/list/post/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const body = _.pick(req.body, ["postTitle", "description", "url"]);

    const editPost = await AdminGalleryDesc.findByIdAndUpdate(
      {
        _id: id
      },
      { $set: body },
      { new: true }
    );

    if (!editPost) {
      res.status(404).json({
        message: "Cannot Find that card"
      });
      return;
    }

    const updatedPost = await editPost.save();
    res.status(200).json({
      message: "Updated successful",
      data: updatedPost
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong during the process. Please try Again!",
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
