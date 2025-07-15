const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      _id: false,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  total: {
    type: Number,
    required: true,
  },
  placedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'Placed', // or 'Shipped', 'Delivered'
  },
});

module.exports = mongoose.model('Order', orderSchema);
