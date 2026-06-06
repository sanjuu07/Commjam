import { useEffect, useState } from "react"

function PromptCard() {

    const [time, setTime] = useState(60)

    useEffect(() => {

        const timer = setInterval(() => {

            setTime((prevTime) => {

                if (prevTime <= 1) {
                    clearInterval(timer)
                    return 0
                }

                return prevTime - 1
            })

        }, 1000)

        return () => clearInterval(timer)

    }, [])

    return (
        <div className="max-w-md mx-auto mt-20 p-8 rounded-2xl shadow-lg text-center bg-yellow-100">
            <h2 className="text-3xl font-bold mb-6">
                Explain Cricket
            </h2>

            <p className="text-5xl font-bold">
                {time}s
            </p>

        </div>
    )
}

export default PromptCard