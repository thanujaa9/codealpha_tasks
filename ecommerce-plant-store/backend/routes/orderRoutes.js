const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// POST /api/orders - Place new order
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items to order' });
    }

    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order', details: err.message });
  }
});


// GET /api/orders/my - Get current user's orders
router.get('/my', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ placedAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/orders/:id - Admin: Update order status
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});
module.exports = router;
