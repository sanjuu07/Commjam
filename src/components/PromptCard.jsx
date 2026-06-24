import { useEffect, useState } from "react"

export const PROMPTS_DATABASE = [
  { text: "Should AI be regulated like a public utility?", category: "Tech", difficulty: "Medium" },
  { text: "Explain blockchain to an 8-year-old child.", category: "Tech", difficulty: "Hard" },
  { text: "How has social media altered our collective attention span?", category: "Tech", difficulty: "Medium" },
  { text: "What will the world look like without smartphones?", category: "Tech", difficulty: "Easy" },
  { text: "Is coding a temporary job before AI takes over?", category: "Tech", difficulty: "Hard" },
  
  { text: "Sell me this pen using the concept of artificial scarcity.", category: "Business", difficulty: "Hard" },
  { text: "Why do most start-ups fail within their first three years?", category: "Business", difficulty: "Medium" },
  { text: "Should companies mandate a four-day work week?", category: "Business", difficulty: "Easy" },
  { text: "What makes a leader truly inspirational?", category: "Business", difficulty: "Medium" },
  { text: "Is remote work a permanent shift or a passing trend?", category: "Business", difficulty: "Easy" },

  { text: "If you could only speak in metaphors for a day, how would you live?", category: "Impromptu", difficulty: "Hard" },
  { text: "Describe the color blue to someone who has never seen color.", category: "Impromptu", difficulty: "Hard" },
  { text: "Why do we feel nostalgic for times we never experienced?", category: "Impromptu", difficulty: "Medium" },
  { text: "Is failure a prerequisite for true success?", category: "Impromptu", difficulty: "Easy" },
  { text: "Explain why silence is sometimes the most powerful answer.", category: "Impromptu", difficulty: "Medium" },

  { text: "Why do cats think they own the house?", category: "Fun", difficulty: "Easy" },
  { text: "If you were a vegetable, what would you be and why?", category: "Fun", difficulty: "Easy" },
  { text: "Is pineapple on pizza culinary art or a crime?", category: "Fun", difficulty: "Easy" },
  { text: "Describe a movie plot in the worst way possible.", category: "Fun", difficulty: "Medium" },
  { text: "What would you do if you woke up with wings tomorrow?", category: "Fun", difficulty: "Medium" }
]

function PromptCard({
  currentPrompt,
  setCurrentPrompt,
  time,
  setTime,
  duration,
  setDuration,
  timerActive,
  setTimerActive
}) {
  const [selectedCat, setSelectedCat] = useState("All")
  const [customText, setCustomText] = useState("")
  const [showCustom, setShowCustom] = useState(false)

  // Timer interval control
  useEffect(() => {
    let interval = null
    if (timerActive && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
    } else if (time === 0) {
      setTimerActive(false)
    }
    return () => clearInterval(interval)
  }, [timerActive, time, setTimerActive, setTime])

  const handleNextPrompt = () => {
    const filtered = PROMPTS_DATABASE.filter(
      (p) => selectedCat === "All" || p.category.toLowerCase() === selectedCat.toLowerCase()
    )
    if (filtered.length === 0) return
    const randomIndex = Math.floor(Math.random() * filtered.length)
    const selected = filtered[randomIndex]
    setCurrentPrompt(selected)
    setTime(duration)
    setTimerActive(false)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customText.trim()) return
    setCurrentPrompt({
      text: customText.trim(),
      category: "Custom",
      difficulty: "Personal"
    })
    setCustomText("")
    setShowCustom(false)
    setTime(duration)
    setTimerActive(false)
  }

  const toggleTimer = () => {
    if (time === 0) {
      setTime(duration)
    }
    setTimerActive(!timerActive)
  }

  const resetTimer = () => {
    setTime(duration)
    setTimerActive(false)
  }

  const handleDurationChange = (secs) => {
    setDuration(secs)
    setTime(secs)
    setTimerActive(false)
  }

  // Circular timer constants
  const radius = 60
  const stroke = 5
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (time / duration) * circumference

  // Visual difficulty color helper
  const getDiffColor = (diff) => {
    switch (diff) {
      case "Easy": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      case "Medium": return "text-amber-400 bg-amber-500/10 border-amber-500/20"
      case "Hard": return "text-rose-400 bg-rose-500/10 border-rose-500/20"
      default: return "text-purple-400 bg-purple-500/10 border-purple-500/20"
    }
  }

  return (
    <div className="glass-panel rounded-3xl p-6 glow-box-purple border-purple-500/10 transition-all duration-300">
      
      {/* Category Toggles & Custom Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-850">
          {["All", "Tech", "Business", "Impromptu", "Fun"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
            showCustom
              ? "bg-slate-800 border-slate-700 text-purple-400"
              : "border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Custom
        </button>
      </div>

      {/* Custom Prompt Form */}
      {showCustom && (
        <form onSubmit={handleCustomSubmit} className="mb-6 animate-fade-in flex gap-2">
          <input
            type="text"
            placeholder="Type your own topic..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl text-sm glass-input"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            Add
          </button>
        </form>
      )}

      {/* Main Prompt Display Area */}
      <div className="min-h-[160px] flex flex-col justify-between items-center text-center p-4 border border-slate-800/50 bg-slate-900/30 rounded-2xl mb-6 relative overflow-hidden">
        
        <div className="flex gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border bg-slate-900 border-slate-800 text-purple-400">
            {currentPrompt.category}
          </span>
          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${getDiffColor(currentPrompt.difficulty)}`}>
            {currentPrompt.difficulty}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-display font-bold leading-relaxed text-slate-100 max-w-sm my-auto">
          "{currentPrompt.text}"
        </h2>

        {/* Action Button: Get Next Prompt */}
        <button
          onClick={handleNextPrompt}
          className="flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-800 transition-all hover:glow-border cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.547 9.547 4.5 10.768 4.5 12s.047 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
          </svg>
          Generate Topic
        </button>
      </div>

      {/* Timer Section */}
      <div className="flex flex-col items-center border-t border-slate-900/50 pt-6">
        
        {/* Circle Ring Progress & Controls */}
        <div className="flex items-center gap-10">
          
          {/* Circular Countdown Ring */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Track */}
              <circle
                stroke="rgba(255,255,255,0.03)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Progress */}
              <circle
                stroke="url(#timerGradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="progress-ring__circle"
              />
              {/* Gradients */}
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Text */}
            <div className="absolute text-center">
              <span className="text-3xl font-display font-extrabold tracking-tight text-white glow-text-purple">
                {time}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase block -mt-1">
                seconds
              </span>
            </div>
          </div>

          {/* Quick Actions & Limits */}
          <div className="flex flex-col gap-3">
            
            {/* Limit Selection */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Speech Length
              </span>
              <div className="grid grid-cols-2 gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
                {[30, 60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleDurationChange(sec)}
                    className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                      duration === sec
                        ? "bg-slate-800 text-purple-400"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Play / Pause / Reset Controls */}
            <div className="flex gap-2">
              <button
                onClick={toggleTimer}
                className={`flex-1 flex items-center justify-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                  timerActive
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                    : "bg-purple-600 border-purple-500 text-white shadow-lg hover:opacity-90"
                }`}
              >
                {timerActive ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={resetTimer}
                className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 active:scale-95 transition-all cursor-pointer"
                title="Reset timer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default PromptCard