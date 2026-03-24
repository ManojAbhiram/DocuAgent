import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize axios defaults inside effect to comply with Fast Refresh
    axios.defaults.baseURL = 'http://localhost:8000/api/v1';
    
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects 'username'
    formData.append('password', password);
    
    const res = await axios.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const token = res.data.access_token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Fetch user details
    const userRes = await axios.get('/auth/me');
    setUser(userRes.data);
  };

  const signup = async (email, password, role = "User") => {
    // According to our backend auth.py register expects query params
    const res = await axios.post(`/auth/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = { user, login, signup, logout, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
