const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminGalSchema = new Schema({
  postTitle: {
    type: String
    // required: true
  },
  uploadFile: {
    type: Array
  },
  description: {
    type: String
    // required: true
  },
  url: {
    type: String
    // required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const adminGallery = mongoose.model("adminGallery", adminGalSchema);
module.exports = adminGallery;
