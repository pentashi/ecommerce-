// src/pages/Checkout.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, TextField, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import { useSelector } from "react-redux";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalAfterDiscount, tax, shippingCost } = useSelector((state) => state.cart);

  const [billingInfo, setBillingInfo] = useState({ name: "", email: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty! Please add items before proceeding.");
      return;
    }
    if (!billingInfo.name || !billingInfo.email || !billingInfo.address) {
      alert("Please fill in all billing details.");
      return;
    }

    const orderSummary = {
      cartItems,
      total: totalAfterDiscount + tax + shippingCost,
      tax,
      shippingCost,
      billingInfo,
      paymentMethod,
    };

    navigate("/order-confirmation", { state: { orderSummary } });
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h2" sx={{ textAlign: "center", marginBottom: 3 }}>Checkout</Typography>
      <Card sx={{ marginBottom: 3, padding: 2 }}>
        <Typography variant="h6">Billing Details</Typography>
        <TextField fullWidth label="Name" name="name" value={billingInfo.name} onChange={handleChange} sx={{ marginTop: 2 }} />
        <TextField fullWidth label="Email" name="email" value={billingInfo.email} onChange={handleChange} sx={{ marginTop: 2 }} />
        <TextField fullWidth label="Address" name="address" value={billingInfo.address} onChange={handleChange} sx={{ marginTop: 2 }} />
      </Card>
      <Card sx={{ marginBottom: 3, padding: 2 }}>
        <Typography variant="h6">Payment Method</Typography>
        <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
          <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
          <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
        </RadioGroup>
      </Card>
      <Card sx={{ padding: 2 }}>
        <Typography variant="h6">Order Summary</Typography>
        {cartItems.map((item) => (
          <CardContent key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>{item.name} x {item.quantity}</Typography>
            <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
          </CardContent>
        ))}
        <Typography variant="body1">Tax: ${tax.toFixed(2)}</Typography>
        <Typography variant="body1">Shipping: ${shippingCost.toFixed(2)}</Typography>
        <Typography variant="h5" sx={{ marginTop: 2 }}>Total: ${(totalAfterDiscount + tax + shippingCost).toFixed(2)}</Typography>
      </Card>
      <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 3 }} onClick={handleCheckout}>
        Place Order
      </Button>
    </Box>
  );
};

export default Checkout;