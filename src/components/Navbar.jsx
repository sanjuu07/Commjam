import React from 'react'

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-t-0 border-x-0 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex justify-between items-center transition-all">
      <div className="flex items-center gap-3">
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
      </div>

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

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-purple-400 shadow-inner">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping absolute opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          <span>Pro Practice Mode</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar