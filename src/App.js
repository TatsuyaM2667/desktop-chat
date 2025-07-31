import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user] = useAuthState(auth);
  const [channelId, setChannelId] = useState(null);
  const [showProfilePage, setShowProfilePage] = useState(false);

  const handleShowProfilePage = () => {
    setShowProfilePage(true);
  };

  const handleBackToChat = () => {
    setShowProfilePage(false);
  };

  return (
    <div className="app">
      {user ? (
        showProfilePage ? (
          <ProfilePage user={user} onBack={handleBackToChat} />
        ) : (
          <>
            <Sidebar setChannelId={setChannelId} onShowProfilePage={handleShowProfilePage} />
            <Chat channelId={channelId} />
          </>
        )
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
