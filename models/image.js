const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  shortDescription: { type: String, required: true },
  descriptionLink: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
