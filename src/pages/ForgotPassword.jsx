import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import AuthBackground from "../components/AuthBackground"

const ForgotPassword = () => {
  const { resetPassword } = useAuth()
  
  // State variables
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [emailError, setEmailError] = useState("")

  const validateForm = () => {
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)
    try {
      await resetPassword(email)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
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

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="request-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back to Login link top */}
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>

              {/* Header */}
              <div className="text-left mb-6">
                <h2 className="text-2xl font-display font-extrabold text-slate-100 tracking-tight">
                  Reset password
                </h2>
                <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-4 mb-5 rounded-2xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Address */}
                <div className="space-y-1.5">
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
                        if (emailError) setEmailError("")
                      }}
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm glass-input font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
                        emailError ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {emailError && (
                    <p className="text-[11px] font-semibold text-red-400 pl-1">{emailError}</p>
                  )}
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Email</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center py-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-extrabold text-slate-100 tracking-tight">
                Check your inbox
              </h2>
              <p className="text-sm text-slate-400 mt-3 mb-8 px-4 font-medium leading-relaxed">
                We've sent a link to <span className="text-slate-200 font-bold">{email}</span>. Click it to reset your password.
              </p>
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Didn't receive the email? Check your spam folder or
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setEmail("")
                  }}
                  className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  try another email address
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-900">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
