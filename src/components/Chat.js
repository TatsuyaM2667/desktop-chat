import React, { useState, useEffect } from 'react';
import { Avatar, IconButton, TextField } from '@mui/material';
import { AddCircleOutline, CardGiftcard, Gif, EmojiEmotions, Image } from '@mui/icons-material';
import Message from './Message';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Chat.css';

function Chat({ channelId }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    if (channelId) {
      const channelDocRef = doc(db, 'channels', channelId);
      getDoc(channelDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          setChannelName(docSnap.data().channelName);
        }
      });

      const q = query(
        collection(db, 'channels', channelId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });
      return () => unsubscribe();
    } else {
      setMessages([]);
      setChannelName('');
    }
  }, [channelId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (channelId && input.trim()) {
      await addDoc(collection(db, 'channels', channelId, 'messages'), {
        timestamp: serverTimestamp(),
        message: input,
        user: user.displayName,
        photo: user.photoURL,
        uid: user.uid,
        type: 'text',
      });
    }

    setInput('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && channelId) {
      try {
        const result = await window.electron.ipcRenderer.invoke(
          'upload-to-cloudinary',
          file.path
        );

        if (result.success) {
          await addDoc(collection(db, 'channels', channelId, 'messages'), {
            timestamp: serverTimestamp(),
            message: result.url,
            user: user.displayName,
            photo: user.photoURL,
            uid: user.uid,
            type: 'image',
          });
        } else {
          alert('Error uploading image: ' + result.error);
        }
      } catch (error) {
        alert('Error communicating with main process: ' + error.message);
      }
    }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <h3>
          <span className="chat__headerHash">#</span>
          {channelName}
        </h3>
      </div>

      <div className="chat__messages">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            timestamp={message.timestamp?.toDate().toLocaleString()}
            user={message.user}
            photo={message.photo}
            type={message.type}
          />
        ))}
      </div>

      <div className="chat__input">
        <AddCircleOutline fontSize="large" />
        <form>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={channelId ? `Message #${channelName}` : 'Select a channel'}
            disabled={!channelId}
          />
          <button className="chat__inputButton" type="submit" onClick={sendMessage} disabled={!channelId}>
            Send Message
          </button>
        </form>

        <div className="chat__inputIcons">
          <CardGiftcard fontSize="large" />
          <Gif fontSize="large" />
          <EmojiEmotions fontSize="large" />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="chat-image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="chat-image-upload">
            <IconButton component="span" disabled={!channelId}>
              <Image fontSize="large" />
            </IconButton>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Chat;
