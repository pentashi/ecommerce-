const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ✅ Place a new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress } = req.body;

    // Log incoming data for debugging
    console.log('Order data received:', req.body);

    if (!items || items.length === 0 || totalPrice <= 0) {
      return res.status(400).json({ error: 'Invalid order details' });
    }

    const order = new Order({
      userId: req.user.id,
      items: items.map((item) => ({
        productId: new mongoose.Types.ObjectId(item.productId),  // Ensure productId is an ObjectId
        quantity: item.quantity,
      })),
      totalPrice,
      shippingAddress,
      status: 'Pending',
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ Get order history for users or all orders for admins
router.get('/', verifyToken, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin'; // Assuming role is stored in the JWT payload
    let orders;

    if (isAdmin) {
      orders = await Order.find().populate('items.productId');
    } else {
      orders = await Order.find({ userId: req.user.id }).populate('items.productId');
    }

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
