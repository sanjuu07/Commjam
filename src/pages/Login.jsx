import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import AuthBackground from "../components/AuthBackground"

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({ email: "", password: "" })

  // Validate form fields
  const validateForm = () => {
    let isValid = true
    const errors = { email: "", password: "" }

    if (!email) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!password) {
      errors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!validateForm()) return

    setLoading(true)
    try {
      await login(email, password)
      setSuccess(true)
      // Small delay before redirecting to allow user to see success state
      setTimeout(() => {
        navigate("/")
      }, 800)
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // Mock Google sign-in UI feedback
    setLoading(true)
    setError("")
    setTimeout(() => {
      setLoading(false)
      alert("Google Sign-In is a UI demonstration. In a production app, this would redirect to Google OAuth.")
    }, 800)
  }

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <AuthBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute -top-[20%] -left-[20%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[60px] pointer-events-none" />

        {/* Logo and Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/30 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-slate-100 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">
            Ready to jam? Enter your details below.
          </p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 rounded-2xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Success Alert */}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span>Successfully authenticated! Redirecting...</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <motion.div variants={itemVariants} className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: "" }))
                }}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm glass-input font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
                  validationErrors.email ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
                disabled={loading || success}
              />
            </div>
            {validationErrors.email && (
              <p className="text-[11px] font-semibold text-red-400 pl-1">{validationErrors.email}</p>
            )}
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVariants} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: "" }))
                }}
                className={`w-full pl-11 pr-11 py-3 rounded-2xl text-sm glass-input font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
                  validationErrors.password ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-[11px] font-semibold text-red-400 pl-1">{validationErrors.password}</p>
            )}
          </motion.div>

          {/* Remember Me Checkbox */}
          <motion.div variants={itemVariants} className="flex items-center">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-300 text-sm font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
                disabled={loading || success}
              />
              <div className="w-4.5 h-4.5 rounded bg-slate-950/60 border border-slate-800 peer-checked:bg-purple-600 peer-checked:border-purple-500 flex items-center justify-center transition-all">
                <svg
                  className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>Remember me</span>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div variants={itemVariants} className="relative flex items-center my-6">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            OR
          </span>
          <div className="flex-grow border-t border-slate-800" />
        </motion.div>

        {/* Google Sign-in */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || success}
            className="w-full py-3 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </motion.button>
        </motion.div>

        {/* Signup Link */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-8 text-sm text-slate-400 font-medium"
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign up for free
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
