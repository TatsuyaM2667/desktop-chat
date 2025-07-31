import React from 'react';
import { Avatar } from '@mui/material';
import './Message.css';

function Message({ timestamp, message, user, photo, type }) {
  return (
    <div className="message">
      <Avatar src={photo} />
      <div className="message__info">
        <h4>
          {user}
          <span className="message__timestamp">{timestamp}</span>
        </h4>
        {type === 'image' ? (
          <img src={message} alt="chat image" className="message__image" />
        ) : (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
}

export default Message;
