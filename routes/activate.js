const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { Powercard, DealerRegister } = require("../db/models/index");

router.post("/", async (req, res) => {
  const body = _.pick(req.body, ["pin"]);

  try {
    const preReg = await Powercard.find({ pin: body.pin });

    if (preReg.length <= 0) {
      res.status(404).json({
        message: "Invalid PowerCard Pin"
      });
      return;
    }

    if (preReg.status === "Active") {
      res.status(404).json({
        message: "Pin Already Taken"
      });
      return;
    }

    res.json({
      status: true,
      data: preReg
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong with the activation",
      err: error
    });
  }

  console.log(body.pin);
});

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
    res.json({ data: userRegistered });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
