const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CategoryImageSchema = new Schema({
  categoryId: {
    type: String,
    require: true
  },
  fileName: {
    type: String,
    require: true
  },
  fileId: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = CategoryImage = mongoose.model("categoryImages", CategoryImageSchema);