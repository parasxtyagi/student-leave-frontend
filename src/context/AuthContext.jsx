// src\context\AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On page load, fetch user from token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          withCredentials: true,
        });

        // ⭐ FIXED: Ensure setUser correctly extracts name and role from res.data.user
        // Based on the backend's `getUserInfo` sending { user: { id, name, role } }
        setUser({ name: res.data.user.name, role: res.data.user.role });
      } catch (error) {
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