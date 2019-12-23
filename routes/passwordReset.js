const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { DealerRegister } = require("../db/models/index");
const _ = require("lodash");

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to password reset"
  });
});

router.post("/", async (req, res) => {
  const email = req.body.email;

  try {
    const initDealer = await DealerRegister.findOne({ email: email });

    if (!initDealer) {
      return res.status(400).json({
        message: "Invalid Email or Email does not exist!"
      });
    }

    const payload = {
      id: initDealer._id,
      email: initDealer.email
    };

    const date = new Date().getTime().toString();

    initDealer.dateCreated = date;
    await initDealer.save();

    const salt = `${initDealer.password}-${initDealer.dateCreated}`;
    const token = jwt.sign(payload, salt, { expiresIn: "1h" });

    //Send To email!!!!!! look for node Mailer
    res.send(
      '<a href="/resetpassword/' +
        payload.id +
        "/" +
        token +
        '">Reset Password"'
    );

    //res.json({message: "A Confirmation Link is send to your email. Please Check your email to proceed to the next step"})
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong in Processing Reset Password!",
      error: error
    });
  }
});

router.get("/:id/:token", async (req, res) => {
  const id = req.params.id;
  const token = req.params.token;
  try {
    const dealer = await DealerRegister.findById(id);
    if (!dealer) {
      return res.status(404).json({
        message: "Can't Find Dealer. Please Try Again!"
      });
    }

    const salt = `${dealer.password}-${dealer.dateCreated}`;

    const payload = jwt.verify(token, salt);

    if (
      payload === undefined ||
      payload.id === undefined ||
      payload.email === undefined
    ) {
      return res.status(400).json({
        message: "Invalid Credentials! Try again!"
      });
    }

    res.json({
      id: payload.id,
      token: token
    });
  } catch (error) {
    res.status(400).json({
      error: error,
      message: "Something went Wrong. Please Try again!"
    });
  }
});

router.post("/changepassword", async (req, res) => {
  const body = _.pick(req.body, ["id", "token", "changePassword"]);
  try {
    const finalDealer = await DealerRegister.findById(body.id);

    if (!finalDealer) {
      return res.status(404).json({
        message: "Incorrect Credentials"
      });
    }

    const salt = `${finalDealer.password}-${finalDealer.dateCreated}`;

    const payload = jwt.verify(body.token, salt);

    const newDate = new Date().getTime().toString();

    DealerRegister.findById(payload.id, async function(err, data) {
      if (err) return res.status(404).json({ message: "User not found!" });

      data.password = body.changePassword;
      data.dateCreated = newDate;
      await data.save();
    });

    res.json({
      date: newDate,
      message: "Your password has been successfully changed."
    });
  } catch (error) {
    res.status(400).json({
      error: error,
      message: "Something went Wrong. Please Try again resetting your Password!"
    });
  }
});

module.exports = router;
