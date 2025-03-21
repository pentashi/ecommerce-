import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import ProductList from "./ProductList"; // Import your complete ProductList component
import {
  Typography,
  Box,
  Container,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  Drawer,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material"; // Material UI components for styling
import FilterListIcon from '@mui/icons-material/FilterList'; // Filter icon

const Dashboard = () => {
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  // Local state for search and filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          textAlign: "center",
          marginTop: 4,
          padding: 2,
        }}
      >
        <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
          Welcome, {user?.name || "Valued Customer"}!
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ marginBottom: 3, fontWeight: "normal" }}
        >
          Start browsing our exclusive collection of products.
        </Typography>

        {/* Search and filter UI */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          {/* Search Bar */}
          <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "70%", marginRight: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">🔍</InputAdornment>
              ),
            }}
          />

          {/* Filter Icon */}
          <IconButton onClick={toggleDrawer} sx={{ marginTop: "12px" }}>
            <FilterListIcon />
          </IconButton>
        </Box>

        {/* Filter Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            width: 250,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 250,
              padding: 2,
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Filter Products
          </Typography>

          {/* Filter Options */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <Select
              value={category}
              onChange={handleCategoryChange}
              displayEmpty
              inputProps={{
                "aria-label": "Category",
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="fashion">Fashion</MenuItem>
              <MenuItem value="home">Home</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Min Price"
            variant="outlined"
            type="number"
            fullWidth
            value={minPrice}
            onChange={handleMinPriceChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Max Price"
            variant="outlined"
            type="number"
            fullWidth
            value={maxPrice}
            onChange={handleMaxPriceChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ marginBottom: 2 }}
          />
        </Drawer>
      </Box>

      {/* Pass the filter states to ProductList */}
      <ProductList
        search={search}
        category={category}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
    </Container>
  );
};

export default Dashboard;
