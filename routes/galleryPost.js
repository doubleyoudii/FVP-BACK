const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { AdminGalleryDesc } = require("../db/models/index");

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the gallery des"
  });
});

router.post("/", async (req, res) => {});

module.exports = router;
