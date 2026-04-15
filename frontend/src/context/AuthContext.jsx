import { createContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, logoutApi } from '../api/authApi';
import { getProfileApi } from '../api/userApi';
import { setAccessToken } from '../api/http';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    setAccessToken(token);
    getProfileApi()
      .then((profile) => setUser(profile))
      .catch(() => {
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (loginId, password) => {
    const data = await loginApi({ loginId, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setAccessToken(null);
      setUser(null);
      navigate('/login');
    }
  };

  const refreshProfile = async () => {
    const profile = await getProfileApi();
    setUser(profile);
    return profile;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshProfile,
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
