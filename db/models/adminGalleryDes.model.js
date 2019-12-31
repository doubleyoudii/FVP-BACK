const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const galleryDescSchema = new Schema({
  postTitle: {
    type: String
    // required: true
  },
  uploadFile: {
    // type: Array
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminGallery"
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

const AdminGalleryDesc = mongoose.model("adminGalDesc", galleryDescSchema);
module.exports = AdminGalleryDesc;
