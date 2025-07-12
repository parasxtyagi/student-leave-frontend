// src\context\AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On page load, fetch user from token
  useEffect(() => {
    const fetchUser = async () => { // Changed to async/await for better readability and error handling
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          withCredentials: true,
        });
        // Ensure you're setting the correct structure: { name: ..., role: ... }
        // Based on your previous code, res.data.user had role, so it should be:
        setUser({ name: res.data.user.name, role: res.data.user.role });
      } catch (error) {
        // Log the error for debugging purposes
        console.error("Failed to fetch user on refresh:", error);
        setUser(null); // Explicitly set user to null on error (e.g., token expired, no token)
      }
    };

    fetchUser();
  }, []); // The empty dependency array ensures this runs only once on mount

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);