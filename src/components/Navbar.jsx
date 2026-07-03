import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User as UserIcon } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("Failed to log out", err)
    }
  }

  // Get user initial for avatar
  const getInitial = () => {
    if (!user || !user.name) return "U"
    return user.name.charAt(0).toUpperCase()
  }

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-t-0 border-x-0 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex justify-between items-center transition-all">
      <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        {/* SVG Microphone Logo */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-xl leading-none bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent hover:glow-text-purple transition-all duration-300">
            CommJam
          </span>
          <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
            Communication Lab
          </span>
        </div>
      </Link>

      {/* Hide menu links on auth pages for cleaner design */}
      {!isAuthPage && (
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#practice" className="hover:text-purple-400 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
            Practice Arena
          </a>
          <a href="#stats" className="hover:text-purple-400 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
            Dashboard Stats
          </a>
          <a href="#history" className="hover:text-purple-400 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
            Speech Logs
          </a>
        </div>
      )}

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3.5">
            {/* Pro Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-purple-400 shadow-inner">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              <span>Pro Practice Mode</span>
            </div>
            
            {/* User Avatar Circle */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white border border-purple-400/20 shadow">
                {getInitial()}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-200 leading-none">{user.name}</span>
                <span className="text-[9px] text-slate-500 mt-0.5">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg border border-slate-850 hover:bg-slate-900 hover:border-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer ml-1"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-purple-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-purple-900/20 cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar