const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { authenticateActivate } = require("../middleware/authentication");
const { Powercard, DealerRegister } = require("../db/models/index");

router.post("/", async (req, res) => {
  const body = _.pick(req.body, ["pin"]);

  try {
    const preReg = await Powercard.find({ pin: body.pin });

    if (preReg.length <= 0) {
      res.status(404).json({
        message: "Can't find Power Card or Invalid Power Card Pin"
      });
      return;
    }

    if (preReg[0].status === "Active") {
      res.status(400).json({
        message: "Pin Already Taken"
      });
      return;
    }

    const payload = {
      status: true,
      pin: body.pin
    };

    const token = jwt.sign(payload, process.env.JWT_SALT_ACTIVATE, {
      expiresIn: "1h"
    });
    // return token;
    res.header("authorizaion", token).json({
      status: true,
      data: preReg[0].pin,
      token: `Bearer ${token}`
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong with the activation",
      err: error
    });
  }
});

// router.post("/register/:pin", authenticateActivate, async (req, res) => {
router.post("/register/:pin", async (req, res) => {
  const pin = req.params.pin;
  const body = _.pick(req.body, [
    "firstName",
    "lastName",
    "middleName",
    "userName",
    "email",
    "password",
    "contactNumber",
    "address",
    "onlineStore"
  ]);
  try {
    const dealer = new DealerRegister(body);
    const userRegistered = await dealer.save();

    const update = {
      userName: userRegistered.userName,
      email: userRegistered.email,
      status: "Active"
    };

    const updatePowerCard = await Powercard.findOneAndUpdate(
      { pin: pin },
      update,
      { new: true }
    );

    res.json({
      mesage: "Dealer Registration Successful",
      pin: pin,
      data: userRegistered
    });
  } catch (error) {
    res.status(400).json({
      error: error
    });
  }
});

module.exports = router;
