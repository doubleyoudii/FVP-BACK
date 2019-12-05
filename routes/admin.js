const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { Admin, Powercard } = require("../db/models/index");

router.post("/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["userName", "password"]);
    const admin = await Admin.findByCredentials(body.userName, body.password);
    const token = await admin.generateAuthToken();
    res.header("x-auth", token).json("Bearer " + token);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

//const admin = new Admin({
//   userName: req.body.userName,
//   password: req.body.password
// });

// admin
//   .save()
//   .then(doc => {
//     console.log(doc);
//     res.send(doc);
//   })
//   .catch(err => {
//     console.log(err);
//   });
