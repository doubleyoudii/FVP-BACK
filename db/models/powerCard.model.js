const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PowercardSchema = new Schema({
  key_id: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: "N/A"
  },
  userName: {
    type: String,
    default: "N/A"
  },
  status: {
    type: String,
    default: "Inactive"
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
});

const Powercard = mongoose.model("powercard", PowercardSchema);
module.exports = { Powercard };
