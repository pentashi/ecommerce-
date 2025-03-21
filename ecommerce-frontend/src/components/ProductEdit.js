import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductEdit = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the product ID from the URL

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '', // Image URL will be updated after uploading
    category: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);  // Store the image file
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch the product data by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError('Failed to fetch product data.');
      }
    };
    fetchProduct();
  }, [id]);

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
      let imageUrl = product.imageUrl; // Keep existing image if not uploading new one

      // If there's a new image, upload it
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrl = uploadResponse.data.url; // Get the image URL from Cloudinary
      }

      // Step 2: Update product data with image URL
      const updatedProduct = {
        ...product,
        imageUrl, // Add the Cloudinary image URL (either new or existing)
      };

      await axios.put(`http://localhost:5000/api/products/${id}`, updatedProduct, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('Product updated successfully!');
      navigate('/admin/product-list'); // Redirect to the product list page after successful update
    } catch (err) {
      console.error(err);
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: 800, margin: '0 auto' }}>
      <Card sx={{ borderRadius: '12px', boxShadow: theme.components.MuiCard.styleOverrides.root.boxShadow }}>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            Edit Product
          </Typography>

          {/* Display success or error message */}
          {error && <Typography color="error">{error}</Typography>}
          {successMessage && <Typography color="success">{successMessage}</Typography>}

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
                  {loading ? 'Updating...' : 'Update Product'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductEdit;
