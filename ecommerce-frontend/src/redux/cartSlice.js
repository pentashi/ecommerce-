import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch cart items from backend
export const fetchCartFromBackend = createAsyncThunk("cart/fetchCart", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get("http://localhost:5000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Should return the cart data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
// ✅ Remove item from cart in backend
export const removeFromCartBackend = createAsyncThunk(
  "cart/removeFromCartBackend",
  async (itemId, { getState, rejectWithValue }) => { // ✅ Expect `itemId` (cart item ID)
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("User not authenticated");

      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, { // ✅ Use `itemId`
        headers: { Authorization: `Bearer ${token}` },
      });

      return itemId; // ✅ Return itemId to remove from Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// ✅ Add item to cart in backend
export const addToCartBackend = createAsyncThunk("cart/addToCart", async (productData, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) throw new Error("User not authenticated");

    const response = await axios.post("http://localhost:5000/api/cart", productData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data; // Returns updated cart item
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// ✅ Clear cart backend API call
export const clearCartBackend = createAsyncThunk("cart/clearCartBackend", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (!token) throw new Error("User not authenticated");

    await axios.delete("http://localhost:5000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return []; // Returning empty array since cart is cleared
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
    tax: 0,
    shippingCost: 0,
    totalAfterDiscount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (!existingItem) {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      } else {
        existingItem.quantity += 1;
      }
      cartSlice.caseReducers.fetchCartTotals(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      cartSlice.caseReducers.fetchCartTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      cartSlice.caseReducers.fetchCartTotals(state);
    },
    fetchCartTotals: (state) => {
      state.totalQuantity = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.tax = state.totalPrice * 0.1; // Example: 10% tax
      state.shippingCost = state.totalPrice > 50 ? 0 : 5; // Example: Free shipping for orders over $50
      state.totalAfterDiscount = state.totalPrice + state.tax + state.shippingCost;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Handle fetching cart from backend
      .addCase(fetchCartFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items.map((item) => ({
          id: item._id, // ✅ Use `item._id` (cart item ID)
          name: item.productId.name,
          price: item.productId.price,
          imageUrl: item.productId.imageUrl,
          quantity: item.quantity,
        }));
        cartSlice.caseReducers.fetchCartTotals(state);
      })
      
      .addCase(fetchCartFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // ✅ Handle adding to cart in backend
      .addCase(addToCartBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload; // Assuming backend returns added item
        const existingItem = state.cartItems.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          state.cartItems.push(item);
        }
        cartSlice.caseReducers.fetchCartTotals(state);
      })
      .addCase(addToCartBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add item to cart";
      })

      // ✅ Handle clearing cart from backend
      .addCase(clearCartBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        cartSlice.caseReducers.fetchCartTotals(state);
      })
      .addCase(removeFromCartBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        cartSlice.caseReducers.fetchCartTotals(state);
      })
      .addCase(removeFromCartBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove item from cart";
      })
      
      .addCase(clearCartBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export const { addToCart, removeFromCart, clearCart, fetchCartTotals } = cartSlice.actions;
export default cartSlice.reducer;
