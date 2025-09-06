import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const fetchingRef = useRef(false);

  // Hàm để cập nhật thông tin người dùng với cache và debounce
  const updateUserData = async token => {
    console.log('AuthContext - updateUserData called with token:', !!token);

    // Kiểm tra cache - chỉ fetch nếu đã quá 5 phút
    const now = Date.now();
    const cacheTime = 5 * 60 * 1000; // 5 phút
    if (now - lastFetchTime < cacheTime && currentUser) {
      console.log('AuthContext - Using cached user data');
      return currentUser;
    }

    // Kiểm tra đang fetch
    if (fetchingRef.current) {
      console.log('AuthContext - Already fetching user data');
      return currentUser;
    }

    fetchingRef.current = true;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('AuthContext - API response:', response.data);

      // Cập nhật currentUser và thời gian fetch
      setCurrentUser(response.data.user);
      setLastFetchTime(now);

      // Cập nhật localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userFetchTime', now.toString());

      return response.data.user;
    } catch (error) {
      console.error(
        'AuthContext - Error fetching user from API:',
        error.response?.data || error.message
      );
      // If API fails, try to get user from localStorage
      const userData = localStorage.getItem('user');
      const fetchTime = localStorage.getItem('userFetchTime');

      if (userData && fetchTime) {
        try {
          const user = JSON.parse(userData);
          const storedTime = parseInt(fetchTime);

          // Chỉ dùng cache nếu chưa quá 30 phút
          if (now - storedTime < 30 * 60 * 1000) {
            console.log('AuthContext - Using user from localStorage cache');
            setCurrentUser(user);
            setLastFetchTime(storedTime);
            return user;
          }
        } catch (err) {
          console.error('AuthContext - Error parsing user data from localStorage:', err);
        }
      }

      console.log('AuthContext - No valid user data, clearing');
      localStorage.clear();
      return null;
    } finally {
      fetchingRef.current = false;
    }
  };

  // Hàm để reload thông tin người dùng
  const reloadUserInfo = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      return await updateUserData(token);
    }
    return null;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const fetchTime = localStorage.getItem('userFetchTime');

    if (token) {
      // Khởi tạo cache từ localStorage nếu có
      if (userData && fetchTime) {
        try {
          const user = JSON.parse(userData);
          const storedTime = parseInt(fetchTime);
          const now = Date.now();

          // Nếu cache còn hợp lệ (dưới 30 phút), dùng ngay
          if (now - storedTime < 30 * 60 * 1000) {
            console.log('AuthContext - Initializing from localStorage cache');
            setCurrentUser(user);
            setLastFetchTime(storedTime);
            setLoading(false);

            // Fetch mới trong background nếu cần
            if (now - storedTime > 5 * 60 * 1000) {
              updateUserData(token);
            }
            return;
          }
        } catch (err) {
          console.error('AuthContext - Error parsing cached user data:', err);
        }
      }

      // Fetch user data from API
      const fetchUser = async () => {
        try {
          await updateUserData(token);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    // 1. Clear localStorage
    localStorage.clear();

    // 2. Clear sessionStorage
    sessionStorage.clear();

    // 3. Clear cookies
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    // 4. Clear cache của service worker
    if ('caches' in window) {
      caches.keys().then(function (names) {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }

    // 5. Clear service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }

    // 6. Clear user state
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    logout,
    updateUserData,
    reloadUserInfo,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
