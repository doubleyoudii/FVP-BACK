const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminGalSchema = new Schema({
  contentType: {
    type: String
  },
  image: {
    type: Buffer
  }
});

const adminGallery = mongoose.model("adminGallery", adminGalSchema);
module.exports = adminGallery;
