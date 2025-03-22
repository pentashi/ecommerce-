import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // ✅ Use environment variable

// ✅ Fetch cart items from backend
export const fetchCartFromBackend = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("User not authenticated");

      const response = await axios.get(`${API_URL}/cart`, { // ✅ Use API_URL
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Remove item from cart in backend
export const removeFromCartBackend = createAsyncThunk(
  "cart/removeFromCartBackend",
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("User not authenticated");

      await axios.delete(`${API_URL}/cart/${itemId}`, { // ✅ Use API_URL
        headers: { Authorization: `Bearer ${token}` },
      });

      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Add item to cart in backend
export const addToCartBackend = createAsyncThunk(
  "cart/addToCart",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("User not authenticated");

      const response = await axios.post(`${API_URL}/cart`, productData, { // ✅ Use API_URL
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Clear cart backend API call
export const clearCartBackend = createAsyncThunk(
  "cart/clearCartBackend",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("User not authenticated");

      await axios.delete(`${API_URL}/cart`, { // ✅ Use API_URL
        headers: { Authorization: `Bearer ${token}` },
      });

      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export default cartSlice.reducer;
