const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { authenticate } = require("../middleware/authentication");

const { Powercard } = require("../db/models/index");

router.post("/create", authenticate, async (req, res) => {
  const precard = _.pick(req.body, ["key_id", "pin"]);

  try {
    const pcard = new Powercard({
      key_id: precard.key_id,
      pin: precard.pin
    });

    const powerCard = await pcard.save();
    res.status(200).json({
      message: "Adding Power Card successful",
      data: powerCard
    });
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong"
    });
  }
});

router.get("/list", authenticate, async (req, res) => {
  try {
    const powerCardList = await Powercard.find();
    res.status(200).json({
      message: "Get List success",
      data: powerCardList
    });
  } catch (error) {
    res.status(400).json({
      message: "Cannot Retrieve power card Lists"
    });
  }
});

router.get("/list/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const specificCard = await Powercard.findById(id);

    if (!specificCard) {
      res.status(404).json({
        message: "Cannot Find that card"
      });
      return;
    }
    res.status(200).json({
      message: "Get List/id success",
      data: specificCard
    });
  } catch (error) {
    res.status(400).json({
      message: "Cannot Find that card"
    });
  }
});

router.patch("/edit/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, [
    "key_id",
    "pin",
    "email",
    "userName",
    "status",
    "isDisabled"
  ]);

  try {
    // if (body.email !== "N/A" && body.userName !== "N/A") {

    // }
    const editCard = await Powercard.findOneAndUpdate(
      {
        _id: id
      },
      { $set: body },
      { new: true }
    );

    if (!editCard) {
      res.status(404).json({
        message: "Cannot Find that card"
      });
      return;
    }

    const finalCard = await editCard.save();
    res.status(200).json({
      message: "Update successful",
      data: finalCard
    });
  } catch (error) {
    res.status(400).json({
      message: "Problem occur in updating card"
    });
  }
});

router.delete("/delete/:id", authenticate, async (req, res) => {
  const id = req.params.id;

  try {
    const delCard = await Powercard.findByIdAndDelete(id);
    if (!delCard) {
      res.status(404).json({
        message: "Cannot Find that card"
      });
      return;
    }
    res.json({
      message: "Power Card Delete Successful",
      data: delCard
    });
  } catch (error) {
    res.status(400).json({
      message: "Problem occur in Deleting card"
    });
  }
});

module.exports = router;
