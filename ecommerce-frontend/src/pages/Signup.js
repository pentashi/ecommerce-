import { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) navigate('/login');
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
        <Typography variant="h4" gutterBottom>Sign Up</Typography>
        {error && <Typography color="error">{typeof error === 'string' ? error : error.message}</Typography>}
        <form onSubmit={handleSubmit}>
        <TextField
  fullWidth
  label="Name"
  name="name"
  value={formData.name}
  onChange={handleChange}
  margin="normal"
  required
/>
<TextField
  fullWidth
  label="Email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  margin="normal"
  required
/>
<TextField
  fullWidth
  label="Password"
  name="password"
  type="password"
  value={formData.password}
  onChange={handleChange}
  margin="normal"
  required
/>
<Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link href="/login" underline="hover">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
