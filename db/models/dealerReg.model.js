const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dealerSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  contactNumber: {
    type: Number
  },
  address: {
    type: String
  },
  onlineStore: {
    type: String
  },
  powercard_id: {
    type: String
  }
});

const DealerRegister = mongoose.model("dealerReg", dealerSchema);
module.exports = DealerRegister;
