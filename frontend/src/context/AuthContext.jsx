import { createContext, useContext, useState } from 'react';
import { authAPI } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { accessToken, user: userData } = res.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const { accessToken, user: userData } = res.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      const updated = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
