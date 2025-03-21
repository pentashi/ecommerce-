import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance'; // Import axiosInstance

// Async Thunk for Logging In
export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/api/auth/login', formData);
    localStorage.setItem('token', data.token); // Save token
    return data; // { token, userId, isAdmin }
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});

// Async Thunk for Registering
export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/api/auth/register', formData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Registration failed');
  }
});


// Create the authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    // Logout action - removes token and user info
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = { id: action.payload.userId, isAdmin: action.payload.isAdmin };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token; // Store token in Redux state
        state.user = { id: action.payload.userId, isAdmin: action.payload.isAdmin }; // Store user info
        localStorage.setItem('token', action.payload.token); // Save token in localStorage
      })
      
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions; // Export logoutUser action
export default authSlice.reducer;
