import { useRef, useState } from "react"

function Recorder() {

  const mediaRecorderRef = useRef(null)

  const [audioURL, setAudioURL] = useState("")

  const audioChunks = useRef([])

  const startRecording = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    })

    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorderRef.current = mediaRecorder

    audioChunks.current = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data)
    }

    mediaRecorder.onstop = () => {

      const audioBlob = new Blob(audioChunks.current, {
        type: "audio/wav"
      })

      const url = URL.createObjectURL(audioBlob)

      setAudioURL(url)
    }

    mediaRecorder.start()

    console.log("Recording started")
  }

  const stopRecording = () => {

    mediaRecorderRef.current.stop()

    console.log("Recording stopped")
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg text-center">

      <h2 className="text-2xl font-bold mb-6">
        Audio Recorder
      </h2>

      <div className="flex justify-center gap-4 mb-6">

        <button
          onClick={startRecording}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Start
        </button>

        <button
          onClick={stopRecording}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Stop
        </button>

      </div>

      {audioURL && (
        <audio controls src={audioURL}></audio>
      )}

    </div>
  )
}

export default Recorder