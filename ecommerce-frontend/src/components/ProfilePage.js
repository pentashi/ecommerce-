import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Avatar, Box } from '@mui/material';
import { useTheme } from '@mui/system';

const ProfilePage = () => {
  const theme = useTheme();
  const [user, setUser] = useState({
    name: '',
    avatar: '',
  });
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(null);  // Store the file itself
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };

    fetchUserProfile();
  }, []);

  // Handle the name change
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  // Handle the avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file); // Save the file object
  };

  // Handle profile update with name and avatar
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      if (newAvatar) {
        formData.append('avatar', newAvatar); // Add avatar to the form data
      }

      // Update name and avatar URL (if changed) in one go
      const updateResponse = await axios.put(
        'http://localhost:5000/api/auth/profile',
        { name: newName || user.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If an avatar is selected, upload it to the backend
      if (newAvatar) {
        const uploadResponse = await axios.post('http://localhost:5000/api/auth/upload-avatar', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        // Update the avatar URL in the state
        setUser({ ...user, avatar: uploadResponse.data.avatar });
      }

      setMessage('Profile updated successfully!');
      setUser(updateResponse.data.user); // Assuming the response contains the updated user data
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: theme.palette.background.paper, padding: '2rem', borderRadius: '8px', boxShadow: 2 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '2rem' }}>
        Profile
      </Typography>

      {error && <Typography variant="body1" color="error" sx={{ marginBottom: '1rem' }}>{error}</Typography>}
      {message && <Typography variant="body1" color="success" sx={{ marginBottom: '1rem' }}>{message}</Typography>}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <Avatar sx={{ width: 100, height: 100 }} src={user.avatar || '/default-avatar.jpg'} />
      </Box>

      <Box sx={{ marginBottom: '1.5rem' }}>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={newName || user.name}
          onChange={handleNameChange}
          sx={{ marginBottom: '1rem' }}
        />
        
        {/* Avatar Upload */}
        <Button
          variant="contained"
          component="label"
          sx={{ marginBottom: '1rem' }}
        >
          Upload Avatar
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleUpdateProfile}
          sx={{ padding: '10px 20px', fontWeight: 'bold' }}
        >
          Update Profile
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;
