import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Grid, Card, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon, ShoppingCart, ViewList, AddCircle, Notifications, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]); // Store fetched products
  const [ordersCount, setOrdersCount] = useState(0); // Store orders count
  const [loading, setLoading] = useState(true); // Loading state for both products and orders

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Fetch products and orders on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userToken = localStorage.getItem('token');
        if (!userToken) {
          throw new Error('User not authenticated');
        }

        const res = await axios.get(`${process.env.REACT_APP_URL}/api/products/`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (Array.isArray(res.data.products)) {
          setProducts(res.data.products); // Assuming res.data contains the products array
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching products:', err.response?.data || err.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const userToken = localStorage.getItem('token');
        if (!userToken) {
          throw new Error('User not authenticated');
        }

        const res = await axios.get(`${process.env.REACT_APP_URL}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        setOrdersCount(res.data.length); // Assuming res.data is an array
      } catch (err) {
        console.error('Error fetching orders:', err.response?.data || err.message);
      }
    };

    // Fetch data concurrently
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchOrders()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Early return for non-admin users
  if (!user || !user.isAdmin) {
    navigate('/dashboard');
    return null;
  }

  // Toggle sidebar visibility
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Handle profile menu open
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);

  // Handle profile menu close
  const handleMenuClose = () => setAnchorEl(null);

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    navigate('/login');
  };

  // Handle product edit
  const handleEditProduct = (productId) => {
    // Navigate to the correct edit page
    navigate(`/admin/product-edit/${productId}`);
  };
  
  // Handle product delete
  const handleDeleteProduct = async (productId) => {
    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      const res = await axios.delete(`${process.env.REACT_APP_URL}/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // After successful deletion, filter out the deleted product from the state
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err.response?.data || err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 250,
          backgroundColor: 'background.paper',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : -250,
          transition: 'left 0.3s ease',
          boxShadow: 6,
          borderRight: '1px solid #ddd',
        }}
      >
        <Box sx={{ padding: 3, backgroundColor: 'primary.main', color: 'white', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Admin Panel</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 3, gap: 2 }}>
          <Button
            onClick={() => navigate('/admin')}
            sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold', color: 'primary.main' }}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => navigate('/admin/product-upload')}
            sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold', color: 'primary.main' }}
          >
            Upload Product
          </Button>
          <Button
            onClick={() => navigate('/admin/product-list')}
            sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold', color: 'primary.main' }}
          >
            View Products
          </Button>
          <Button
            onClick={() => navigate('/admin/orders')}
            sx={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 'bold', color: 'primary.main' }}
          >
            View Orders
          </Button>
        </Box>
        <IconButton
          onClick={() => {
            setSidebarOpen(false); // Close sidebar
            navigate('/admin'); // Navigate to dashboard
          }}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box sx={{ marginLeft: sidebarOpen ? 250 : 0, transition: 'margin-left 0.3s ease', width: '100%' }}>
        {/* Top Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, backgroundColor: 'primary.main', color: 'white', borderRadius: '0 12px 12px 0' }}>
          <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
            <DashboardIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Admin Dashboard</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ color: 'white' }}>
              <Notifications />
            </IconButton>
            <Avatar sx={{ marginLeft: 2, width: 40, height: 40 }} src={user?.avatar} onClick={handleMenuClick} />
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              sx={{ marginTop: 1 }}
            >
              <MenuItem onClick={() => navigate('/admin/profile')}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Stats Section */}
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 4, color: 'text.primary' }}>Admin Overview</Typography>
          <Grid container spacing={3}>
            {/* Total Products Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ padding: 3, boxShadow: 6, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <ShoppingCart sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Total Products</Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>{products.length}</Typography>
              </Card>
            </Grid>
            
            {/* Total Orders Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ padding: 3, boxShadow: 6, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <ViewList sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Total Orders</Typography>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>{ordersCount}</Typography>
              </Card>
            </Grid>
            
            {/* Add Product Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ padding: 3, boxShadow: 6, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <AddCircle sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Add Product</Typography>
                <Button variant="contained" onClick={() => navigate('/admin/product-upload')} sx={{ marginTop: 2 }}>Upload New Product</Button>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Product List Section */}
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 4, color: 'text.primary' }}>Products</Typography>
          {loading ? (
            <Typography variant="h6" sx={{ color: 'text.primary' }}>Loading...</Typography>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card sx={{ padding: 3, boxShadow: 6, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src={product.imageUrl} sx={{ width: 100, height: 100, mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{product.name}</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>{product.description}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>${product.price}</Typography>
                    <Box sx={{ marginTop: 2, display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleEditProduct(product._id)}>
                        <EditIcon sx={{ color: 'primary.main' }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteProduct(product._id)}>
                        <DeleteIcon sx={{ color: 'primary.main' }} />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
