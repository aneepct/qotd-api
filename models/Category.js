const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CategorySchema = new Schema({
  name: {
    type: String,
    require: true
  },
  alias: {
    type: String,
    require: false
  },
  banner: {
    type: String,
    require: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Category = mongoose.model("categories", CategorySchema);