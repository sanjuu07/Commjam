import React from "react"
import { motion } from "framer-motion"

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#06070a] w-full h-full">
      {/* Deep radial gradient backdrop */}
      <div className="absolute inset-0 bg-radial-gradient(circle at 50% 0%, #191632 0%, #090a0f 70%, #06070a 100%)" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)" }}
      />

      {/* Animated Blob 1 (Purple/Indigo) */}
      <motion.div
        className="absolute -top-[10%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-br from-purple-600/10 to-indigo-600/5 blur-[80px]"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Animated Blob 2 (Pink/Cyan) */}
      <motion.div
        className="absolute top-[30%] -right-[5%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-br from-pink-500/5 to-cyan-500/5 blur-[90px]"
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Animated Blob 3 (Deep Purple Center) */}
      <motion.div
        className="absolute -bottom-[10%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-indigo-900/10 to-purple-800/5 blur-[100px]"
        animate={{
          x: [0, 20, -30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export default AuthBackground
