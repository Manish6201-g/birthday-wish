"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function HappyBirthday({ birthday, onNext }) {
  const [balloonCount, setBalloonCount] = useState(5);

  const name = birthday?.name || "Birthday Person";
  const nickname = birthday?.nickname || name;
  const welcomeMessage = birthday?.welcomeMessage || "🎉 It's your special day! 🎉";

  const primaryColor = birthday?.theme?.primaryColor || "#ec4899";
  const secondaryColor = birthday?.theme?.secondaryColor || "#a855f7";

  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
  };

  useEffect(() => {
    const updateBalloonCount = () => {
      setBalloonCount(window.innerWidth >= 768 ? 20 : 5);
    };

    updateBalloonCount();
    window.addEventListener("resize", updateBalloonCount);

    return () => window.removeEventListener("resize", updateBalloonCount);
  }, []);

  // Balloon Component
  const Balloon = ({ color, delay = 0, x = 0 }) => (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: "-2.5%",
        zIndex: 5,
      }}
      animate={{
        y: [0, -15, 0],
        x: [0, 5, -5, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      <div className="relative w-[70px] h-[80px]">
        {/* Balloon shape */}
        <div
          className={`w-full h-full bg-gradient-to-b ${color} relative shadow-md`}
          style={{
            borderRadius: "75% 75% 80% 80% / 75% 75% 80% 80%",
          }}
        >
          {/* Highlights */}
          <div className="absolute top-2 left-2 w-3 h-5 bg-white/50 rounded-full blur-[1px]" />
          <div className="absolute bottom-2 left-3 w-2 h-1 bg-white/30 rounded-full blur-[0.5px]" />
        </div>

        {/* Tie */}
        <div
          className={`absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[12px] h-[12px] bg-gradient-to-b ${color}`}
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
        />
      </div>
    </motion.div>
  );

  // Cake
  const AnimatedCake = () => (
    <motion.div
      className="relative z-10"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center">
        {/* Candles */}
        <div className="absolute -top-11 left-1/2 -translate-x-1/2 w-[50px] flex justify-between">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative">
              <motion.div
                className="relative mx-auto"
                animate={{
                  scaleY: [1, 1.3, 1],
                  scaleX: [1, 0.8, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                <div className="w-2 h-3 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full mx-auto" />
                <motion.div
                  className="w-3 h-3 bg-yellow-300/50 rounded-full absolute -top-1 -left-0.5 blur-sm"
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              </motion.div>
              <div className="w-1.5 h-8 bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-sm mx-auto shadow-sm" />
            </div>
          ))}
        </div>

        {/* Top layer */}
        <div
          className="w-20 h-10 rounded-xl relative mx-auto -mt-1 shadow-lg"
          style={{
            background: `linear-gradient(to bottom, ${primaryColor}dd, ${secondaryColor}dd)`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-t-xl" />
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="absolute top-3 w-1.5 h-1.5 bg-pink-100 rounded-full"
              style={{ left: `${35 + i * 15}%` }}
            />
          ))}
        </div>

        {/* Middle layer */}
        <div
          className="w-28 h-12 rounded-xl relative mx-auto -mt-2 shadow-lg"
          style={{
            background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-white/40 rounded-t-xl" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute top-3 w-1.5 h-1.5 bg-white rounded-full"
              style={{ left: `${20 + i * 15}%` }}
            />
          ))}
        </div>

        {/* Bottom layer */}
        <div className="w-36 h-14 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-xl relative mx-auto -mt-1 shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-3 bg-white/40 rounded-t-xl" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-4 w-2 h-2 bg-red-400 rounded-full"
              style={{ left: `${15 + i * 12}%` }}
            />
          ))}
        </div>

        {/* Cake plate */}
        <div className="w-40 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shadow-lg" />
      </div>
    </motion.div>
  );

  const balloonColors = [
    "from-red-400 to-red-500",
    "from-blue-400 to-blue-500",
    "from-green-400 to-green-600",
    "from-yellow-400 to-yellow-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* balloons at bottom*/}
      {Array.from({ length: balloonCount }, (_, i) => {
        const colorIndex = i % balloonColors.length;
        const xPosition = (100 / balloonCount) * i;

        return (
          <Balloon
            key={`balloon-${i}`}
            color={balloonColors[colorIndex]}
            delay={i * 0.2}
            x={xPosition}
          />
        );
      })}

      <motion.div
        className="text-center mb-8 relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.5,
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
      >
        <div className="mb-8">
          <AnimatedCake />
        </div>

        <motion.h1
          className="text-5xl md:text-7xl py-1.5 md:py-2 font-bold text-transparent bg-clip-text mb-4 relative z-10"
          style={{
            ...gradientStyle,
            filter: `drop-shadow(0 0 25px ${primaryColor}88)`,
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Happy Birthday
        </motion.h1>

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text mb-6 relative z-10"
          style={gradientStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          {nickname}
          <span className="text-white">💕</span>
        </motion.h2>

        <motion.div
          className="text-xl md:text-2xl text-purple-200 mb-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            textShadow: "0 0 10px rgba(0,0,0,0.8)",
          }}
        >
          {welcomeMessage}
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      >
        <button
          onClick={onNext}
          style={gradientStyle}
          className="text-white text-xl px-8 py-4 rounded-full shadow-xl border-2 border-white/70 transition-all duration-300 hover:scale-[103%]"
        >
          <motion.div className="flex items-center space-x-2" whileHover={{ x: 5 }}>
            <span>See Our Moments</span>
            <ArrowRight className="w-6 h-6" />
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
}
