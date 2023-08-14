import React, { createContext, useState, useEffect } from 'react';
import JoblyApi from './api';

// Create the AuthContext
export const AuthContext = createContext();

// Create a provider component to wrap the app and provide the authentication state
export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [elo, setElo] = useState();

  useEffect(() => {
    // Check if token and username exist in localStorage
    const token = localStorage.getItem('authenticated');
    const storedUsername = localStorage.getItem('username');
    const storedImageURL = localStorage.getItem('imageURL');
    const storedElo = localStorage.getItem('elo')
    if (token && storedUsername) {
      // Update AuthContext with the token and username
      setAuthenticated(token);
      setUsername(storedUsername);
      setElo(storedElo);
      JoblyApi.token = token;
    }
    if (storedImageURL) setImageURL(storedImageURL);
  }, [setAuthenticated]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, username, setUsername, imageURL, setImageURL, elo, setElo }}>
      {children}
    </AuthContext.Provider>
  );
};