const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { Admin } = require("../db/models/index");

router.post("/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["userName", "password"]);
    const admin = await Admin.findByCredentials(body.userName, body.password);
    const token = await admin.generateAuthToken();
    res.header("authorization", token).json({ token: "Bearer " + token });
  } catch (error) {
    res.status(400).json({
      message: "Unable to find Admin User",
      error: error
    });
  }
});

router.post("/createAdmin", async (req, res) => {
  try {
    const body = _.pick(req.body, ["userName", "password"]);
    const admin = new Admin({
      userName: body.userName,
      password: body.password
    });

    const registered = await admin.save();
    res.status(200).json({
      message: "Admin Creation success"
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to create admin",
      error: error
    });
  }
});

module.exports = router;
