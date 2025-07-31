import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => alert(error.message));
  };

  const register = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .catch((error) => alert(error.message));
  };

  const signInWithEmail = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="login__logo">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Discord_logo.svg/800px-Discord_logo.svg.png"
          alt="Discord Logo"
        />
      </div>
      <form>
        <TextField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <TextField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <Button type="submit" onClick={signInWithEmail} fullWidth variant="contained" color="primary">
          Sign In
        </Button>
        <Button onClick={register} fullWidth variant="outlined" color="secondary" sx={{ mt: 1 }}>
          Register
        </Button>
      </form>
      <Button onClick={signInWithGoogle} sx={{ mt: 2 }}>
        Sign In With Google
      </Button>
    </div>
  );
}

export default Login;
