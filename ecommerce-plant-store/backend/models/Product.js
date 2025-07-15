const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  plantCare: { type: String },
  size: { type: String },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);
