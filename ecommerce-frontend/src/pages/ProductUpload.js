import React, { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, Grid, Box, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const ProductUpload = () => {
  const theme = useTheme();
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '', // This will be set after image upload
    category: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);  // To store the image file
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);  // Store the file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Step 1: Upload image to Cloudinary via /api/upload
      const formData = new FormData();
      formData.append('image', image);

      const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get the URL from Cloudinary's response
      const imageUrl = uploadResponse.data.url;
      
      // Step 2: Create product in MongoDB via /api/products
      const productData = {
        ...product,
        imageUrl, // Add the Cloudinary image URL to product data
      };

      await axios.post('http://localhost:5000/api/products', productData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('Product uploaded successfully!');
      setOpenSnackbar(true); // Show the success message Snackbar
      setProduct({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        stock: ''
      });
      setImage(null);  // Clear the selected image
    } catch (err) {
      console.error(err);
      setError('Failed to upload product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the success message Snackbar
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: 800, margin: '0 auto' }}>
      <Card sx={{ borderRadius: '12px', boxShadow: theme.components.MuiCard.styleOverrides.root.boxShadow }}>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            Upload Product
          </Typography>

          {/* Display error message */}
          {error && <Typography color="error">{error}</Typography>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Product Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                  type="number"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category"
                  variant="outlined"
                  fullWidth
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stock"
                  variant="outlined"
                  fullWidth
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  required
                  type="number"
                />
              </Grid>

              {/* Add file input for image */}
              <Grid item xs={12}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  sx={{ padding: '10px 20px', borderRadius: '8px' }}
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Upload Product'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Hide after 3 seconds
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductUpload;
