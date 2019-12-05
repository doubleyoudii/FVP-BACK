const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const AdminSchema = new Schema({
  userName: {
    type: String
  },
  password: {
    type: String
  }
});

// *** Instance methods ***

AdminSchema.statics.findByCredentials = function(userName, password) {
  let Admin = this;
  return Admin.findOne({ userName }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      if (password === user.password) {
        resolve(user);
      } else {
        reject();
      }
    });
  });
};

AdminSchema.methods.generateAuthToken = function() {
  var admin = this;

  const payload = {
    email: admin.userName,
    password: admin.password
  };

  const token = jwt.sign(payload, "testkey").toString();
  return token;
};

const Admin = mongoose.model("admin", AdminSchema);

module.exports = { Admin };
