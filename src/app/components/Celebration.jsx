"use client";

import { motion } from "motion/react";
import { Gift, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function Celebration({ birthday, onNext }) {
  const primaryColor = birthday?.theme?.primaryColor || "#ec4899";
  const secondaryColor = birthday?.theme?.secondaryColor || "#a855f7";

  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
  };

  const colors = [primaryColor, secondaryColor, "#ffd700"];

  useEffect(() => {
    if (birthday?.effects?.confetti !== false) {
      const duration = 2500;
      const end = Date.now() + duration;

      const frame = () => {
        const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 2; i++) {
          confetti({
            particleCount: 1,
            angle: i === 0 ? 60 : 120,
            spread: 55,
            origin: { x: i === 0 ? 0 : 1 },
            colors: [randomColor()],
          });
        }

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [birthday?.effects, primaryColor, secondaryColor]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center mb-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="relative mb-8"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden"
            style={gradientStyle}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Gift className="w-16 h-16 text-white relative z-10" />
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text mb-6"
          style={{
            ...gradientStyle,
            filter: `drop-shadow(0 0 30px ${primaryColor}88)`,
          }}
        >
          {birthday?.title || "Time to Celebrate!"}
        </motion.h1>

        <motion.p
          className="text-xl text-purple-200 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {birthday?.subtitle || "The countdown is over... Let's celebrate! 🎉"}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 1,
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
      >
        <button
          onClick={onNext}
          style={gradientStyle}
          className="relative text-white text-lg px-8 py-4 rounded-full shadow-xl border-2 border-white/70 transition-all duration-300 hover:scale-[103%]"
        >
          <motion.div className="flex items-center space-x-2" whileTap={{ scale: 0.95 }}>
            <Gift className="w-5 h-5" />
            <span className="font-semibold">Let's Celebrate!</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </button>
      </motion.div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-purple-200 text-base">{birthday?.celebrationMessage || "Click to start the magic! ✨"}</p>
      </motion.div>
    </motion.div>
  );
}
