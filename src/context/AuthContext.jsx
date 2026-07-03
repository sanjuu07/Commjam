import React, { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("commjam_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse saved user", e)
      }
    }
    setLoading(false)
  }, [])

  // Mock Login
  const login = async (email, password) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple mock validation
        if (!email.includes("@")) {
          setLoading(false)
          reject(new Error("Please enter a valid email address."))
          return
        }
        if (password.length < 6) {
          setLoading(false)
          reject(new Error("Password must be at least 6 characters."))
          return
        }

        // Mock success
        const nameFromEmail = email.split("@")[0]
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
        const mockUser = {
          name: formattedName,
          email: email,
          token: "mock-jwt-token-12345"
        }

        setUser(mockUser)
        localStorage.setItem("commjam_user", JSON.stringify(mockUser))
        setLoading(false)
        resolve(mockUser)
      }, 1000) // 1 second artificial delay
    })
  }

  // Mock Sign Up
  const signup = async (name, email, password) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || name.trim() === "") {
          setLoading(false)
          reject(new Error("Please enter your full name."))
          return
        }
        if (!email.includes("@")) {
          setLoading(false)
          reject(new Error("Please enter a valid email address."))
          return
        }
        if (password.length < 6) {
          setLoading(false)
          reject(new Error("Password must be at least 6 characters."))
          return
        }

        // Mock success
        const mockUser = {
          name: name.trim(),
          email: email,
          token: "mock-jwt-token-12345"
        }

        setUser(mockUser)
        localStorage.setItem("commjam_user", JSON.stringify(mockUser))
        setLoading(false)
        resolve(mockUser)
      }, 1000)
    })
  }

  // Mock Logout
  const logout = async () => {
    setLoading(true)
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(null)
        localStorage.removeItem("commjam_user")
        setLoading(false)
        resolve()
      }, 500)
    })
  }

  // Mock Forgot Password
  const resetPassword = async (email) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email.includes("@")) {
          setLoading(false)
          reject(new Error("Please enter a valid email address."))
          return
        }
        setLoading(false)
        resolve()
      }, 1000)
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
