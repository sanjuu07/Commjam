import { useState, useEffect } from "react"
import PromptCard from "../components/PromptCard"
import Recorder from "../components/Recorder"

function Home() {
  // Shared timer & prompt states
  const [currentPrompt, setCurrentPrompt] = useState({
    text: "Should AI be regulated like a public utility?",
    category: "Tech",
    difficulty: "Medium"
  })
  const [duration, setDuration] = useState(60)
  const [time, setTime] = useState(60)
  const [timerActive, setTimerActive] = useState(false)

  // Speech Logs Practice History
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("commjam_sessions")
    return saved ? JSON.parse(saved) : []
  })

  // Selected history item ID to play/expand evaluation notes
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    localStorage.setItem("commjam_sessions", JSON.stringify(history))
  }, [history])

  const handleSaveSession = (newSession) => {
    setHistory((prev) => [newSession, ...prev])
  }

  const handleDeleteSession = (id) => {
    if (confirm("Are you sure you want to delete this practice session?")) {
      setHistory((prev) => prev.filter((item) => item.id !== id))
      if (expandedId === id) setExpandedId(null)
    }
  }

  // Calculate statistics
  const totalSessions = history.length
  
  const getStreak = () => {
    if (history.length === 0) return 0
    const dates = history.map((h) => h.date.split(",")[0].trim())
    const uniqueDates = [...new Set(dates)]
    return uniqueDates.length
  }
  const streak = getStreak()

  const avgRating =
    history.length > 0
      ? (history.reduce((sum, item) => sum + item.rating, 0) / history.length).toFixed(1)
      : "0.0"

  const totalTime = history.reduce((sum, item) => sum + (item.duration || 0), 0)

  const formatTotalTime = (secs) => {
    if (secs < 60) return `${secs}s`
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in" id="dashboard">
      
      {/* Dashboard Top Heading Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/20 via-slate-900/30 to-indigo-950/15 border border-purple-500/10 rounded-3xl p-6 glow-box-purple">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-extrabold text-slate-100 tracking-tight">
            Welcome, <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Impromptu Speaker</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl font-medium">
            CommJam helps you master spontaneous speaking. Pick an off-the-cuff question, start the microphone, and evaluate your tone, speech filler words, and confidence.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 shadow-inner">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Today's Focus</span>
            <span className="text-xs font-semibold text-slate-300">Pacing & Structure</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Prompts + Recorder & Sidebar Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Prompt card and Recorder (Span 2) */}
        <div className="lg:col-span-2 space-y-8" id="practice">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PromptCard
              currentPrompt={currentPrompt}
              setCurrentPrompt={setCurrentPrompt}
              time={time}
              setTime={setTime}
              duration={duration}
              setDuration={setDuration}
              timerActive={timerActive}
              setTimerActive={setTimerActive}
            />

            <Recorder
              currentPrompt={currentPrompt}
              timerActive={timerActive}
              setTimerActive={setTimerActive}
              setTime={setTime}
              duration={duration}
              onSaveSession={handleSaveSession}
            />
          </div>

        </div>

        {/* Right Side: Performance Analytics & Session History Logs */}
        <div className="space-y-8" id="stats">
          
          {/* Stats Analytics Widget */}
          <div className="glass-panel rounded-3xl p-5 border-slate-800/80">
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-400 mb-4 font-display">
              Performance Statistics
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Stat 1: Total Jams */}
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Total Jams</span>
                <span className="text-3xl font-display font-extrabold text-white mt-1">{totalSessions}</span>
              </div>

              {/* Stat 2: Streak */}
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Streak</span>
                  <span className="text-sm">🔥</span>
                </div>
                <span className="text-3xl font-display font-extrabold text-orange-400 mt-1">{streak} <span className="text-xs text-slate-500 font-semibold">days</span></span>
              </div>

              {/* Stat 3: Avg Rating */}
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Confidence</span>
                  <span className="text-xs text-yellow-400">★</span>
                </div>
                <span className="text-3xl font-display font-extrabold text-yellow-400 mt-1">{avgRating} <span className="text-xs text-slate-500 font-semibold">/ 5</span></span>
              </div>

              {/* Stat 4: Jam Time */}
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Time Jammed</span>
                <span className="text-2xl font-display font-extrabold text-indigo-400 mt-1 truncate">{formatTotalTime(totalTime)}</span>
              </div>
            </div>
          </div>

          {/* Jam Practice Logs Accordion List */}
          <div className="glass-panel rounded-3xl p-5 border-slate-800/80 flex flex-col h-[340px]" id="history">
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-400 mb-3 font-display">
              Speech Practice Logs
            </h3>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-850 rounded-2xl">
                <svg className="w-8 h-8 text-slate-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                <p className="text-xs text-slate-500 font-semibold">No recorded speeches yet.</p>
                <p className="text-[10px] text-slate-600 mt-1">Practice recording a topic to store your voice notes here.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-2xl transition-all overflow-hidden ${
                      expandedId === item.id
                        ? "bg-slate-900/60 border-purple-500/35 shadow-md shadow-purple-950/10"
                        : "bg-slate-900/20 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    {/* Header Summary */}
                    <div
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="p-3.5 flex items-center justify-between cursor-pointer"
                    >
                      <div className="space-y-1 max-w-[75%]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-full border border-purple-500/15">
                            {item.category}
                          </span>
                          <span className="text-[9px] text-slate-500 font-semibold">{item.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 truncate pr-1">
                          {item.promptText}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-yellow-400 font-bold">
                          {"★".repeat(item.rating)}
                          {"☆".repeat(5 - item.rating)}
                        </span>
                        <svg
                          className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                            expandedId === item.id ? "transform rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {/* Expandable Player & Notes */}
                    {expandedId === item.id && (
                      <div className="px-3.5 pb-3.5 border-t border-slate-900/80 bg-slate-950/40 space-y-3 pt-3">
                        {/* Audio widget player */}
                        <audio src={item.audioURL} controls className="w-full h-8 accent-purple-500 rounded-lg text-xs" />

                        {/* Notes review */}
                        <div className="bg-slate-900/50 border border-slate-900/80 p-2.5 rounded-xl space-y-1">
                          <span className="text-[9px] uppercase text-slate-500 font-extrabold tracking-wider block">
                            Self Evaluation Notes
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed italic">
                            "{item.notes}"
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Length: {item.duration}s
                          </span>
                          <button
                            onClick={() => handleDeleteSession(item.id)}
                            className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-400 font-bold uppercase transition-colors cursor-pointer"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Log
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}

export default Home