const express = require("express");
const router = express.Router();
const { DealerRegister } = require("../db/models/index");

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to password reset"
  });
});

router.post("/", async (req, res) => {
  const email = req.body.email;

  try {
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong in Processing Reset Password!",
      error: error
    });
  }
});

module.exports = router;
