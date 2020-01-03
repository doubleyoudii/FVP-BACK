const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const {
  Powercard,
  DealerRegister,
  AdminGallery
} = require("../db/models/index");
const { authenticateLogin } = require("../middleware/authentication");

//login
router.post("/login", async (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  // console.log(body);
  try {
    DealerRegister.findOne({ email: body.email })
      .then(dealer => {
        if (!dealer) {
          res.status(404).json({
            message: "Cannot find Email"
          });
          return;
        }
        bcrypt.compare(body.password, dealer.password).then(isMatch => {
          if (isMatch) {
            //User match
            const payload = {
              _id: dealer._id,
              email: dealer.email
            };
            //Create JWT Payload

            //Sign token
            jwt.sign(
              payload,
              process.env.JWT_SALT_LOGIN,
              { expiresIn: "1h" },
              (e, token) => {
                res.header("authorization", token).json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            return res.status(400).json({
              message: "Incorrect Password. Try Again"
            });
          }
        });
      })
      .catch(err => console.log(err));
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong. Please Try Again",
      error: error
    });
  }
});

//Public profile
router.get("/profile/:userName", async (req, res) => {
  try {
    const userName = req.params.userName;
    const dealer = await DealerRegister.find({ userName: userName });
    const publicDealer = _.pick(dealer[0], [
      "firstName",
      "lastName",
      "userName",
      "email",
      "contactNumber",
      "address",
      "onlineStore",
      "uploadFile"
    ]);
    console.log(publicDealer);

    //Test for including the image
    let id = publicDealer.uploadFile;
    const imageFile = await AdminGallery.findOne({ _id: ObjectId(id) });

    let buff;
    if (imageFile) {
      buff = Buffer.from(imageFile.image.buffer, "base64");
    }

    res.send({
      message: "Get Dealer successful by Public",
      data: publicDealer,
      imageData: buff
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong. Please try Get Again",
      error: error
    });
  }
});

router.get("/profile", authenticateLogin, async (req, res) => {
  try {
    const id = req.body.user._id;
    const dealer = await DealerRegister.findById(id);

    //Test for including the image
    var idImage = dealer.uploadFile;
    const imageFile = await AdminGallery.findOne({ _id: ObjectId(idImage) });

    let buff;
    if (imageFile) {
      buff = Buffer.from(imageFile.image.buffer, "base64");
    }

    res.json({
      message: "Get Dealer successful",
      data: dealer,
      imageData: buff
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong. Please try GET Again"
    });
  }
});

router.patch("/profile/edit", authenticateLogin, async (req, res) => {
  try {
    const id = req.body.user._id;

    const body = _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "middleName",
      "userName",
      "password",
      "contactNumber",
      "address",
      "onlineStore",
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
    body.uploadFile = imageData._id;

    const dealer = await DealerRegister.findOneAndUpdate(
      { _id: id },
      { $set: body },
      {
        new: true
      }
    );

    res.json({
      message: "Update Successful",
      data: dealer
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong, Please Try Again!",
      error: error
    });
  }

  //wait for GET;
});

module.exports = router;
