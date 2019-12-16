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

dealerSchema.statics.findByCredentials = function(email) {
  let Dealer = this;
  console.log(email);
  return Dealer.findOne({ email: email }).then(user => {
    if (!user) {
      console.log(user);
      return Promise.reject();
    }

    return new Promise.resolve(user);
  });
};

dealerSchema.methods.comparePassword = function(candidatePassword) {
  console.log(this.password);
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      throw new Error("something went wrong in comparing");
    }
    // cb(null, isMatch);
    if (isMatch) {
      return {
        message: "Password Match",
        status: true
      };
    } else {
      return {
        message: "Password don't Match",
        status: false
      };
    }
  });
};

dealerSchema.methods.generateAuthToken = function() {
  let dealer = this;

  const payload = {
    email: dealer.email,
    password: dealer.password
  };

  // const token = jwt.sign(payload, "testkey").toString();
  const token = jwt.sign(payload, process.env.JWT_SALT_LOGIN, {
    expiresIn: "1h"
  });
  return token;
};

const DealerRegister = mongoose.model("dealerReg", dealerSchema);
module.exports = DealerRegister;
