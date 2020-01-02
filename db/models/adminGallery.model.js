const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminGalSchema = new Schema({
  contentType: {
    type: String,
    default: "jpeg/png"
  },
  originalName: {
    type: String,
    default: Date.now().toString()
  },
  image: {
    type: Buffer
  }
});

const AdminGallery = mongoose.model("adminGallery", adminGalSchema);
module.exports = AdminGallery;
