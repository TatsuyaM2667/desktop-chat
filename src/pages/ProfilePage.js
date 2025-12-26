import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  CircularProgress,
} from '@mui/material';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';

function ProfilePage({ user, onBack }) {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        // ElectronのIPCを使ってメインプロセスにアップロードを依頼
        const result = await window.electron.ipcRenderer.invoke(
          'upload-to-cloudinary',
          file.path // ファイルのパスを渡す
        );

        if (result.success) {
          setPhotoURL(result.url);
          alert('Image uploaded successfully!');
        } else {
          alert('Error uploading image: ' + result.error);
        }
      } catch (error) {
        alert('Error communicating with main process: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (user) {
      setLoading(true);
      try {
        await updateProfile(user, {
          displayName: displayName.trim(),
          photoURL: photoURL,
        });
        alert('Profile updated successfully!');
      } catch (error) {
        alert('Error updating profile: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button onClick={onBack} variant="outlined" sx={{ mb: 2 }}>
        Back to Chat
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar src={photoURL} sx={{ width: 100, height: 100, mb: 2 }} />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Upload Avatar'}
          </Button>
        </label>
      </Box>
      <TextField
        label="Display Name"
        fullWidth
        margin="normal"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleSaveProfile}
        disabled={loading}
      >
        Save Profile
      </Button>
    </Container>
  );
}

export default ProfilePage;
