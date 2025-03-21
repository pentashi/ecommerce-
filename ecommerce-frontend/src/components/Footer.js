import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Typography, IconButton, Grid } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#333333", color: "#333333", py: 4, mt: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ justifyContent: "space-between" }}>
          {/* Quick Links Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Quick Links
            </Typography>
            <Box>
              {["Home", "Cart", "About Us", "Contact Us"].map((text, index) => (
                <Link 
                  key={index} 
                  to={`/${text.toLowerCase().replace(" ", "-")}`} 
                  style={{ textDecoration: "none", color: "#757575" }}
                >
                  <Typography variant="body1" sx={{ mb: 1, transition: "color 0.3s", "&:hover": { color: "#ff5722" } }}>
                    {text}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {[Facebook, Instagram, Twitter, LinkedIn].map((Icon, index) => (
                <IconButton key={index} sx={{ color: "#ff5722", "&:hover": { color: "#03a9f4" } }}>
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Legal Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Legal
            </Typography>
            <Box>
              {["Privacy Policy", "Terms & Conditions"].map((text, index) => (
                <Link 
                  key={index} 
                  to={`/${text.toLowerCase().replace(" & ", "-").replace(" ", "-")}`} 
                  style={{ textDecoration: "none", color: "#757575" }}
                >
                  <Typography variant="body1" sx={{ mb: 1, transition: "color 0.3s", "&:hover": { color: "#ff5722" } }}>
                    {text}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom Section */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" sx={{ color: "#757575" }}>
            © 2025 ShopApp. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
