import { useState, useEffect, useCallback } from "react"
import axios from "../api/axios"
import { AuthContext } from "./AuthContext"
import { jwtDecode } from "jwt-decode"

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // LOGIN
  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password })
    const token = res.data.accessToken

    const decoded = jwtDecode(token)

    setAccessToken(token)
    setUser({
      id: decoded.userId,
      role: decoded.role,
      fullName: decoded.fullName,
      email: decoded.email
    })
  }

  // LOGOUT
  const logout = async () => {
    try {
      await axios.post("/auth/logout")
    } catch (err) {
      console.log(err)
    }

    setAccessToken(null)
    setUser(null)
  }

  // REFRESH TOKEN
  const refresh = useCallback(async () => {
    const res = await axios.post("/auth/refresh")
    const token = res.data.accessToken

    const decoded = jwtDecode(token)

    setAccessToken(token)
    setUser({
      id: decoded.userId,
      role: decoded.role,
      fullName: decoded.fullName,
      email: decoded.email
    })

    return token
  }, [])

  // AUTO LOGIN ON PAGE REFRESH
  useEffect(() => {
    let isMounted = true

    const verifyRefresh = async () => {
      try {
        await refresh()
      } catch (err) {
        console.log("Not logged in", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    verifyRefresh()
    return () => { isMounted = false }
  }, [refresh])

  // SETUP INTERCEPTORS
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
      }
    )

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config

        if (
          error.response?.status === 403 &&
          !prevRequest._retry
        ) {
          prevRequest._retry = true

          try {
            const newToken = await refresh()
            prevRequest.headers.Authorization = `Bearer ${newToken}`
            return axios(prevRequest)
          } catch (err) {
            logout()
            return Promise.reject(err)
          }
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [accessToken, refresh])

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        refresh,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}