import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff5722", // Vibrant Orange (Call-to-action)
    },
    secondary: {
      main: "#03a9f4", // Light Blue (Accents & Highlights)
    },
    background: {
      default: "#f5f5f5", // Light Gray Background
    },
    text: {
      primary: "#333333", // Dark Gray Text
      secondary: "#757575", // Muted Text
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif", // Clean and modern font
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Prevents all caps
          borderRadius: "8px", // Smooth button edges
          padding: "10px 20px", // Larger click area
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
        },
      },
    },
  },
});

export default theme;
