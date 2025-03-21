import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice"; // Import productSlice reducer
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import orderReducer from "./orderSlice";
// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Persist auth only, NOT cart or products
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  order: orderReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

// Create a persistor instance
export const persistor = persistStore(store);

export default store;
