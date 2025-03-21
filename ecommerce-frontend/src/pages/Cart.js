import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, IconButton, Divider } from "@mui/material";
import { RemoveShoppingCart, Delete } from "@mui/icons-material";
import { removeFromCartBackend, clearCartBackend, fetchCartFromBackend } from "../redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalQuantity, totalPrice, tax, shippingCost, totalAfterDiscount, loading } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCartFromBackend());
  }, [dispatch]);

  const handleRemoveItem = async (itemId) => {
    await dispatch(removeFromCartBackend(itemId));
    dispatch(fetchCartFromBackend());
  };

  const handleClearCart = async () => {
    await dispatch(clearCartBackend());
    dispatch(fetchCartFromBackend());
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "background.default", minHeight: "100vh" }}>
      <Typography variant="h2" sx={{ textAlign: "center", marginBottom: 3 }}>Shopping Cart</Typography>

      {loading ? (
        <Typography variant="h6" sx={{ textAlign: "center" }}>Loading...</Typography>
      ) : cartItems.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: 5 }}>
          <RemoveShoppingCart sx={{ fontSize: 80, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
        </Box>
      ) : (
        <>
          {cartItems.map((item) => (
            <Card key={item.id} sx={{ marginBottom: 2 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: 80, borderRadius: 8 }} />
                  <Box>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => handleRemoveItem(item.id)} color="secondary">
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ textAlign: "center", marginTop: 2 }}>
            <Typography variant="h6">Total: ${(totalAfterDiscount + tax + shippingCost).toFixed(2)}</Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;
