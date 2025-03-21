import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderSummary = location.state?.orderSummary;

  if (!orderSummary) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" color="error">No order found.</Typography>
      </Box>
    );
  }

  const { cartItems, total, tax, shippingCost, billingInfo, paymentMethod } = orderSummary;

  return (
    <Box sx={{ padding: 2, backgroundColor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h2" sx={{ textAlign: "center", marginBottom: 3 }}>Order Confirmation</Typography>
      <Card sx={{ marginBottom: 3, padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Thank you for your order, {billingInfo.name}!</Typography>
        <Typography variant="h6">Shipping Address:</Typography>
        <Typography variant="body1">{billingInfo.address}</Typography>
        <Typography variant="h6" sx={{ marginTop: 2 }}>Payment Method:</Typography>
        <Typography variant="body1">{paymentMethod}</Typography>
        <Typography variant="h6" sx={{ marginTop: 2 }}>Order Summary:</Typography>
        {cartItems.map((item) => (
          <CardContent key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>{item.name} x {item.quantity}</Typography>
            <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
          </CardContent>
        ))}
        <Typography variant="body1">Tax: ${tax.toFixed(2)}</Typography>
        <Typography variant="body1">Shipping: ${shippingCost.toFixed(2)}</Typography>
        <Typography variant="h5" sx={{ marginTop: 2 }}>Total: ${total.toFixed(2)}</Typography>
      </Card>
      <Button variant="contained" color="primary" onClick={() => navigate("/")} sx={{ marginTop: 3 }}>
        Go to Home
      </Button>
    </Box>
  );
};

export default OrderConfirmation;
