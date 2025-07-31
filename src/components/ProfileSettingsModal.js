import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';

function ProfileSettingsModal({ open, onClose, user }) {
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (user && displayName.trim()) {
      try {
        await updateProfile(user, {
          displayName: displayName.trim(),
        });
        alert('Profile updated successfully!');
        onClose();
      } catch (error) {
        alert('Error updating profile: ' + error.message);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Profile Settings</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Display Name"
          type="text"
          fullWidth
          variant="standard"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProfileSettingsModal;
