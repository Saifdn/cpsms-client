import { useState, useEffect, useRef, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "@/api/axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref so interceptors always read the latest token without re-registering
  const accessTokenRef = useRef(null);

  const login = async (token) => {
    try {
      const decoded = jwtDecode(token);
      accessTokenRef.current = token;
      setAccessToken(token);
      setUser({
        id: decoded.userId,
        role: decoded.role,
        fullName: decoded.fullName,
        email: decoded.email,
      });
      return true;
    } catch (err) {
      console.error("Token decode failed", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.log(err);
    }
    accessTokenRef.current = null;
    setAccessToken(null);
    setUser(null);
  };

  const refresh = useCallback(async () => {
    const res = await axios.post("/auth/refresh");
    const token = res.data.accessToken;
    await login(token);
    return token;
  }, []);

  // Auto refresh on app start
  useEffect(() => {
    let isMounted = true;

    const verifyRefresh = async () => {
      try {
        await refresh();
      } catch (err) {
        accessTokenRef.current = null;
        setAccessToken(null);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyRefresh();

    return () => { isMounted = false; };
  }, [refresh]);

  // Register interceptors once — reads token from ref, no re-registration needed
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (accessTokenRef.current) {
        config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;
        if (error.response?.status === 403 && !prevRequest._retry) {
          prevRequest._retry = true;
          try {
            const newToken = await refresh();
            prevRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(prevRequest);
          } catch (err) {
            logout();
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [refresh]); // no longer depends on accessToken

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        refresh,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};