const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Powercard, DealerRegister } = require("../db/models/index");
const { authenticateLogin } = require("../middleware/authentication");

//login
router.post("/login", async (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  console.log(body);
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

//edit

router.get("/profile", authenticateLogin, async (req, res) => {
  try {
    const id = req.body.user._id;
    const dealer = await DealerRegister.findById(id);
    res.json({
      message: "Get Dealer successful",
      data: dealer
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong. Please try Again"
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
      "onlineStore"
    ]);

    const dealer = await DealerRegister.findOneAndUpdate({ _id: id }, body, {
      new: true
    });

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