import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";

const ProductList = ({ search, category, minPrice, maxPrice }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user); // Assuming user object contains isAdmin

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {
        params: { search, category, minPrice, maxPrice, page: currentPage, limit: 6 },
      });
      setProducts(res.data.products || []);
      setTotalPages(Math.ceil(res.data.totalCount / 6)); // Calculate total pages
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (product) => {
    if (!token) {
      setSnackbar({ open: true, message: "Please log in to add items to the cart.", severity: "warning" });
      navigate("/login");
      return;
    }

    setCartLoading(product._id);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart`,
        { productId: product._id, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(addToCart({ productId: product._id, quantity: 1 }));
      setSnackbar({ open: true, message: "Product added to cart!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to add product to cart", severity: "error" });
    }
    setCartLoading(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: "Product deleted successfully!", severity: "success" });
      fetchProducts(); // Refresh product list after deletion
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to delete product", severity: "error" });
    }
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "background.default", minHeight: "100vh" }}>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : (
        <>
          {user?.isAdmin && (
            <Typography variant="h4" color="text.primary" sx={{ marginBottom: 3, fontWeight: "bold" }}>
              Available Products
            </Typography>
          )}
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    padding: 2,
                    minHeight: "380px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "200px", // Fixed height for consistent image sizing
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          objectFit: "contain", // Ensures the entire image fits within the container
                          width: "100%",
                          height: "100%",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        color: "text.primary",
                        mb: 1,
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        color: "text.secondary",
                        mb: 1.5,
                        lineHeight: 1.5,
                      }}
                    >
                      {product.description.length > 100
                        ? product.description.slice(0, 100) + "..."
                        : product.description}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{
                        fontWeight: "bold",
                        mb: 1.5,
                      }}
                    >
                      ${product.price}
                    </Typography>
                  </CardContent>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {user?.isAdmin ? (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{
                            fontSize: "0.9rem",
                            padding: "8px 16px",
                            borderRadius: "8px",
                          }}
                          onClick={() => handleEditProduct(product._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{
                            fontSize: "0.9rem",
                            padding: "8px 16px",
                            borderRadius: "8px",
                          }}
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          fontSize: "0.9rem",
                          padding: "8px 16px",
                          borderRadius: "8px",
                        }}
                        onClick={() => handleAddToCart(product)}
                        disabled={cartLoading === product._id}
                      >
                        {cartLoading === product._id ? <CircularProgress size={20} color="inherit" /> : "Add to Cart"}
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProductList;
