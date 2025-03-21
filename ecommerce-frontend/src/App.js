import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";  
import AdminRoute from "./components/AdminRoute";          
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard"; 
import ProductUpload from "./pages/ProductUpload";  
import ProductList from "./pages/ProductList";  
import ProductDetail from "./pages/ProductDetail";  
import Unauthorized from "./pages/Unauthorized";  
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";  
import OrderConfirmation from "./pages/OrderConfirmation"; // ✅ Import OrderConfirmation page
import OAuthSuccess from "./components/OAuthSuccess";
import ProfilePage from './components/ProfilePage'; 
import Footer from "./components/Footer"; 
import ProductEdit from "./components/ProductEdit";
import Navbar from "./components/Navbar"; 

function App() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin;

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!isAdmin && <Navbar />} 

        <Routes>
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/" element={user ? <Navigate to={user.isAdmin ? "/admin" : "/dashboard"} replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />  
          <Route path="/order-confirmation" element={<OrderConfirmation />} />  {/* ✅ Add OrderConfirmation Route */}

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} /> 
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/product-upload" element={<ProductUpload />} />
            <Route path="/admin/product-list" element={<ProductList />} />
            <Route path="/admin/product-edit/:id" element={<ProductEdit />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>

        {!isAdmin && <Footer />} 
        
      </ThemeProvider>
    </Router>
  );
}

export default App;
