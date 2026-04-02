import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('tp_token');
    const storedUser  = localStorage.getItem('tp_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('tp_token', userToken);
    localStorage.setItem('tp_user', JSON.stringify(userData));
  };

  /**
   * updateUser — used by VerifyEmail page after polling confirms verification.
   * Updates both context state AND localStorage so the new JWT + user object
   * are persisted without requiring a full re-login.
   */
  const updateUser = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('tp_token', userToken);
    localStorage.setItem('tp_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateUser,
      loading,
      isAdmin: user?.isAdmin,
      isEmailVerified: user?.isEmailVerified ?? false,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
