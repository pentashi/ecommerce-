import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Card, CardContent, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux"; 
import axios from "axios";
import { addToCart } from "../redux/cartSlice"; 

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!token) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }

    setCartLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addToCart({ id: product._id, name: product.name, price: product.price, imageUrl: product.imageUrl }));
      setSnackbarOpen(true); // Show success message
    } catch (err) {
      alert("Failed to add product to cart");
    }
    setCartLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" textAlign="center">{error}</Typography>;
  }

  if (!product) {
    return <Typography textAlign="center">No product found</Typography>;
  }

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Button variant="contained" color="primary" sx={{ marginBottom: 2 }} onClick={() => navigate(-1)}>
        Back
      </Button>
      <Card sx={{ maxWidth: 600, margin: "auto", padding: 3, borderRadius: "12px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        
        {/* Product Image with Improved Styling */}
        <Box
          component="img"
          src={product.imageUrl}
          alt={product.name}
          sx={{
            width: "100%",
            height: "350px",
            objectFit: "contain", // Ensures the image fully fits inside
            borderRadius: "12px",
            marginBottom: 2,
            backgroundColor: "#f0f0f0",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
          }}
        />

        <CardContent>
          <Typography variant="h4" color="text.primary" fontWeight="bold">{product.name}</Typography>
          <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>${product.price}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1rem", lineHeight: 1.5 }}>{product.description}</Typography>
          <Typography variant="body2" color="text.primary" sx={{ marginTop: 2, fontWeight: 500 }}>Category: {product.category}</Typography>
          <Typography variant="body2" color="text.primary">Stock: {product.stock}</Typography>

          {/* Add to Cart Button (only for non-admin users) */}
          {!user?.isAdmin && (
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ marginTop: 2, padding: "10px 20px", fontSize: "1rem", fontWeight: "bold" }} 
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              {cartLoading ? <CircularProgress size={20} color="inherit" /> : "Add to Cart"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* MUI Snackbar for Success Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Product added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetail;
