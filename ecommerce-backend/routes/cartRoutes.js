const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/cart.js');
const { verifyToken } = require('../middleware/auth.js');

const router = express.Router();

// 🛒 Add item to cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid product ID or quantity' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity; // Update quantity
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity,
      });
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🛒 Get cart items
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🛒 Remove item from cart (by cart item ID)
router.delete('/:itemId', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1); // Remove the item
    await cart.save();

    // Fetch updated cart
    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🛒 Clear entire cart
router.delete('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = []; // Empty the cart items array
    await cart.save();

    // Fetch updated empty cart
    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🛒 Update cart item quantity (by cart item ID)
router.put('/:itemId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity (greater than zero) is required' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🛒 Handle Tax & Shipping Calculations
router.get('/calculate', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const totalPrice = cart.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

    const tax = totalPrice * 0.1; // 10% Tax
    const shippingCost = 5.0; // Flat shipping fee
    const totalAfterDiscount = totalPrice + tax + shippingCost;

    res.status(200).json({
      totalPrice,
      tax,
      shippingCost,
      totalAfterDiscount
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
