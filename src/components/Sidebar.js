import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Tag, Mic, Headphones, Logout, Add } from '@mui/icons-material';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import './Sidebar.css';

function Sidebar({ setChannelId, onShowProfilePage }) {
  const [user] = useAuthState(auth);
  const [channels, setChannels] = useState([]);
  const [openAddChannelDialog, setOpenAddChannelDialog] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'channels'), (snapshot) => {
      const fetchedChannels = snapshot.docs.map((doc) => ({
        id: doc.id,
        channel: doc.data(),
      }));
      setChannels(fetchedChannels);
      // チャンネルがロードされたら最初のチャンネルを自動選択
      if (fetchedChannels.length > 0) {
        setChannelId(fetchedChannels[0].id);
      }
    });
    return () => unsubscribe();
  }, [setChannelId]);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleOpenAddChannelDialog = () => {
    setOpenAddChannelDialog(true);
  };

  const handleCloseAddChannelDialog = () => {
    setOpenAddChannelDialog(false);
    setNewChannelName(''); // 入力フィールドをクリア
  };

  const handleAddChannel = async () => {
    if (newChannelName.trim()) {
      const docRef = await addDoc(collection(db, 'channels'), { channelName: newChannelName.trim() });
      setChannelId(docRef.id); // 新しく作成したチャンネルを自動選択
      handleCloseAddChannelDialog();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Typography variant="h6">My Server</Typography>
        <IconButton onClick={handleOpenAddChannelDialog} size="small">
          <Add fontSize="small" />
        </IconButton>
      </div>
      <Divider />
      <div className="sidebar__channels">
        <List>
          {channels.map(({ id, channel }) => (
            <ListItem button key={id} onClick={() => setChannelId(id)}>
              <Tag sx={{ mr: 1 }} />
              <ListItemText primary={channel.channelName} />
            </ListItem>
          ))}
        </List>
      </div>
      <div className="sidebar__profile" onClick={onShowProfilePage} style={{ cursor: 'pointer' }}>
        <Avatar src={user?.photoURL} />
        <div className="sidebar__profileInfo">
          <Typography variant="body1">{user?.displayName}</Typography>
          <Typography variant="caption">#{user?.uid.substring(0, 4)}</Typography>
        </div>
        <div className="sidebar__profileIcons">
          <Mic />
          <Headphones />
          <IconButton onClick={handleLogout} size="small">
            <Logout fontSize="small" />
          </IconButton>
        </div>
      </div>

      <Dialog open={openAddChannelDialog} onClose={handleCloseAddChannelDialog}>
        <DialogTitle>Add New Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            type="text"
            fullWidth
            variant="standard"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddChannelDialog}>Cancel</Button>
          <Button onClick={handleAddChannel}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Sidebar;

