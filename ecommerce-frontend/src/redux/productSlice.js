import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      // Use the environment variable for the API URL
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api"; // Default to localhost if the env variable is not set

      const response = await axios.get(`${apiUrl}/products`);
      return response.data; // This returns an object: { products: [...], totalCount: 1 }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],  // Initialize as an empty array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Extract the products array from the payload
        state.products = Array.isArray(action.payload)
          ? action.payload
          : action.payload.products || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
