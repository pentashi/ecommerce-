import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Button,
  Typography,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon, ShoppingCart, ExitToApp, AccountCircle } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems } = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.auth);
  
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Dropdown menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Mobile Drawer State
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setMobileOpen(open);
  };

  if (["/admin", "/signup", "/login"].includes(location.pathname)) {
    return null;
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#ff5722" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Mobile Menu Button */}
        <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} sx={{ display: { xs: "block", md: "none" } }}>
          <MenuIcon />
        </IconButton>
        
        {/* Logo & Home Link */}
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>ShopApp</Typography>
        </Link>

        {/* Desktop Nav */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {user && !user.isAdmin && (
            <>
              {/* Cart Icon */}
              <Link to="/cart" style={{ textDecoration: "none" }}>
                <IconButton color="inherit" sx={{ color: "white" }}>
                  <Badge badgeContent={totalQuantity} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Link>
              
              {/* User Profile Dropdown */}
              <IconButton color="inherit" onClick={handleMenuClick} sx={{ color: "white", marginLeft: 2 }}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
          
          {token && user && !user.isAdmin && (
            <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />} sx={{ color: "white", marginLeft: 2 }}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            {user && !user.isAdmin && (
              <>
                <ListItem button component={Link} to="/cart">
                  <ListItemText primary="Cart" />
                </ListItem>
                <ListItem button component={Link} to="/profile">
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
