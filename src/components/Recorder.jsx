import { useRef, useState, useEffect } from "react"

function Recorder({ currentPrompt, timerActive, setTimerActive, setTime, duration, onSaveSession }) {
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const audioChunks = useRef([])
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const audioPlayerRef = useRef(null)

  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState("")
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  
  // Evaluation States
  const [rating, setRating] = useState(4)
  const [notes, setNotes] = useState("")

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudioNodes()
    }
  }, [])

  // Draw flat line/idle state on canvas
  useEffect(() => {
    if (!isRecording && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "rgba(6, 182, 212, 0.25)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }
  }, [isRecording])

  const cleanupAudioNodes = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  const startRecording = async () => {
    try {
      cleanupAudioNodes()
      audioChunks.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        setTimerActive(false)
      }

      // Web Audio API Visualizer Setup
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const audioCtx = new AudioCtx()
      audioContextRef.current = audioCtx

      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser

      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)

      mediaRecorder.start()
      setIsRecording(true)
      setTimerActive(true)
      setTime(duration)

      // Start canvas drawing
      drawWaveform()
    } catch (err) {
      console.error("Error accessing microphone:", err)
      alert("Microphone access is required to record your speech.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      cleanupAudioNodes()
    }
  }

  // Draw frequency wave bars on canvas
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = "rgba(10, 15, 30, 0.25)" // fade path trail
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 1.6
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 0.45

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
        gradient.addColorStop(0, "rgba(139, 92, 246, 0.8)")
        gradient.addColorStop(1, "rgba(6, 182, 212, 0.9)")

        ctx.fillStyle = gradient
        const y = (canvas.height - barHeight) / 2
        ctx.fillRect(x, y, barWidth - 1.5, barHeight)
        x += barWidth
      }
    }
    draw()
  }

  // Playback Control Handlers
  const togglePlay = () => {
    if (!audioPlayerRef.current) return
    if (audioPlaying) {
      audioPlayerRef.current.pause()
    } else {
      audioPlayerRef.current.play()
    }
    setAudioPlaying(!audioPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      setAudioCurrentTime(audioPlayerRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioPlayerRef.current) {
      setAudioDuration(audioPlayerRef.current.duration)
    }
  }

  const handleAudioEnded = () => {
    setAudioPlaying(false)
    setAudioCurrentTime(0)
  }

  const handleSeekChange = (e) => {
    const seekVal = parseFloat(e.target.value)
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = seekVal
      setAudioCurrentTime(seekVal)
    }
  }

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed)
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speed
    }
  }

  const handleSave = () => {
    if (!audioURL) return
    // Prepare log data
    const newSession = {
      id: Date.now(),
      promptText: currentPrompt.text,
      category: currentPrompt.category,
      duration: duration - Math.round(audioDuration), // calculated length of practice
      audioURL,
      rating,
      notes: notes.trim() || "No notes added.",
      date: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    }
    onSaveSession(newSession)
    
    // Reset States
    setAudioURL("")
    setNotes("")
    setRating(4)
    setAudioPlaying(false)
    setAudioCurrentTime(0)
  }

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard this practice speech?")) {
      setAudioURL("")
      setNotes("")
      setRating(4)
      setAudioPlaying(false)
      setAudioCurrentTime(0)
    }
  }

  // Time format helper
  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00"
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <div className="glass-panel rounded-3xl p-6 glow-box-cyan border-cyan-500/10 transition-all duration-300">
      <h2 className="text-sm uppercase tracking-widest font-extrabold text-cyan-400 mb-4 font-display">
        Speech Recorder
      </h2>

      {/* Visualizer Canvas Area */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 mb-6 flex flex-col justify-center items-center h-24 shadow-inner">
        <canvas
          ref={canvasRef}
          width={400}
          height={96}
          className="w-full h-full object-cover block"
        />
        {isRecording && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-red-500/15 border border-red-500/30 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] text-red-400 font-extrabold uppercase tracking-wide">
              Live Analysis
            </span>
          </div>
        )}
      </div>

      {/* Controls & Record Actions */}
      {!audioURL ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs text-slate-400 font-medium">
            {isRecording
              ? "Practice jamming! Speak clearly into your microphone..."
              : "Click the trigger below to request microphone permission and start speaking."}
          </p>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              isRecording
                ? "bg-red-500/10 border-red-500 text-red-500 glow-box-cyan recording-pulse scale-95"
                : "bg-gradient-to-tr from-cyan-600 to-indigo-600 border-transparent text-white hover:scale-105 shadow-lg shadow-cyan-900/30"
            }`}
          >
            {isRecording ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect width="12" height="12" x="6" y="6" rx="1.5" />
              </svg>
            ) : (
              <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>
      ) : (
        /* Custom Audio Review & Self Evaluation Dashboard */
        <div className="space-y-6 animate-fade-in border-t border-slate-900 pt-6">
          <audio
            ref={audioPlayerRef}
            src={audioURL}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleAudioEnded}
            className="hidden"
          />

          {/* Player Display Interface */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              {/* Play Pause Button */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                {audioPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect width="4" height="12" x="6" y="6" rx="1" />
                    <rect width="4" height="12" x="14" y="6" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Progress Slider */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Review Speech</span>
                  <span>{formatTime(audioCurrentTime)} / {formatTime(audioDuration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={audioDuration || 100}
                  step="0.05"
                  value={audioCurrentTime}
                  onChange={handleSeekChange}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-purple-500"
                />
              </div>
            </div>

            {/* Speed Options */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-900">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Playback Speed
              </span>
              <div className="flex gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                {[1, 1.25, 1.5, 2].map((sp) => (
                  <button
                    key={sp}
                    onClick={() => changeSpeed(sp)}
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold cursor-pointer transition-all ${
                      playbackSpeed === sp
                        ? "bg-purple-600 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Self Assessment Form */}
          <div className="space-y-4 bg-slate-900/30 border border-slate-900 rounded-2xl p-4">
            
            {/* Rating stars */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                Confidence Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-lg hover:scale-110 cursor-pointer transition-transform"
                    type="button"
                  >
                    {star <= rating ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-slate-600">☆</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Input */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Evaluation Notes
              </label>
              <textarea
                placeholder="How did you sound? Mention filler words, pacing, or expression details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[60px] max-h-[120px] rounded-xl text-xs p-3 glass-input resize-y"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-3">
            <button
              onClick={handleDiscard}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 hover:bg-rose-500/5 text-xs font-bold transition-all cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-purple-900/20 hover:opacity-90 transition-all cursor-pointer text-center"
            >
              Save to Speech Logs
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Recorder