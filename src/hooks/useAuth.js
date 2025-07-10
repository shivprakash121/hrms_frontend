import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (credentials) => {
    // Mock login process
    const authenticatedUser = { id: 1, name: 'Admin', role: 'HR' };
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, login, logout };
};

export default useAuth;
