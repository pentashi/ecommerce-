import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { Google, Facebook } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      const isAdmin = result.payload.isAdmin;
      navigate(isAdmin ? '/admin' : '/dashboard');
    }
  };

  // Use environment variable for backend URL
  const handleOAuthLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/${provider}`;
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error">{error.message}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            margin="normal"
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ my: 2 }}>
          OR
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          startIcon={<Google />}
          onClick={() => handleOAuthLogin('google')}
        >
          Sign in with Google
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          startIcon={<Facebook />}
          onClick={() => handleOAuthLogin('facebook')}
        >
          Sign in with Facebook
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link href="/signup" underline="hover">
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
