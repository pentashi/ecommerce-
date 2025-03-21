const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Canceled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid'],
      default: 'Unpaid',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
