import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action to place order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      console.log("🟢 ORDER DATA SENT TO API:", orderData);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("🔴 Token is missing! User might not be authenticated.");
        return rejectWithValue("Authentication token is missing.");
      }

      console.log("🟢 Token from localStorage:", token);

      const formattedItems = Array.isArray(orderData.cartItems) 
        ? orderData.cartItems.map(item => ({
            productId: item.productId, 
            quantity: item.quantity
        })) 
        : [];
      
      if (formattedItems.length === 0) {
        console.error("🔴 Cart items are empty or invalid.");
        return rejectWithValue("Cart items are invalid.");
      }

      const response = await axios.post(
        "http://localhost:5000/api/orders/",
        {
          items: formattedItems,
          totalPrice: orderData.totalPrice,
          shippingAddress: orderData.shippingAddress,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("🟢 Order placed successfully:", response.data);
      return response.data;

    } catch (error) {
      console.error("🔴 Order request failed:", error);

      if (error.response) {
        console.error("🔴 API Response Error:", error.response.data);
        return rejectWithValue(error.response.data?.error || "Order failed. Please try again.");
      } else if (error.request) {
        console.error("🔴 No response received from server:", error.request);
        return rejectWithValue("No response from server. Check backend.");
      } else {
        console.error("🔴 Unknown error:", error.message);
        return rejectWithValue("Something went wrong. Please try again.");
      }
    }
  }
);

// Initial order state
const orderSlice = createSlice({
  name: "order",
  initialState: { order: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
