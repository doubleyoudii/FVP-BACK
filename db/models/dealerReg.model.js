const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

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
    required: true,
    unique: true
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

dealerSchema.pre("save", function(next) {
  let dealer = this;

  if (!dealer.isModified("password")) return next();
  //generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    //Hash password using salt
    bcrypt.hash(dealer.password, salt, function(err, hash) {
      if (err) return next(err);

      dealer.password = hash;
      next();
    });
  });
});

dealerSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const DealerRegister = mongoose.model("dealerReg", dealerSchema);
module.exports = DealerRegister;
