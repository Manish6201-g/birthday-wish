"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Heart, Sparkles, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

export default function Letter({ birthday, onRestart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const primaryColor = birthday?.theme?.primaryColor || "#ec4899";
  const secondaryColor = birthday?.theme?.secondaryColor || "#a855f7";

  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
  };

  const letterText = useMemo(() => {
    const greeting = birthday?.letter?.greeting || "My Dearest Friend,";
    const content =
      birthday?.letter?.content ||
      `On this very special day, I want you to know how incredibly grateful I am to have you in my life. Your birthday isn't just a celebration of another year - it's a celebration of all the joy, laughter, and beautiful memories you bring to this world.\n\nYou have this amazing ability to light up any room you enter, to make people smile even on their darkest days, and to spread kindness wherever you go. Your heart is pure gold, and your spirit is absolutely infectious.\n\nThank you for being the wonderful, amazing, absolutely fantastic person that you are. The world is so much brighter because you're in it.\n\nHappy Birthday, beautiful soul! 🎂✨`;
    const closing = birthday?.letter?.closing || "With all my love and warmest wishes,";
    const signature = birthday?.letter?.signature || "Your Friend Manish 💕";

    return `${greeting}\n\n${content}\n\n${closing}\n${signature}`;
  }, [birthday?.letter]);

  useEffect(() => {
    if (showText) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < letterText.length) {
          setCurrentText(letterText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setShowCursor(false);
          if (birthday?.effects?.confetti !== false) {
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 },
              colors: [primaryColor, secondaryColor, "#ffd700"],
            });
          }
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [showText, letterText, birthday?.effects, primaryColor, secondaryColor]);

  const handleOpenLetter = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowText(true);
    }, 800);
  };

  const handleReset = () => {
    setIsOpen(false);
    setShowText(false);
    setCurrentText("");
    setShowCursor(true);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl w-full">
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1
            className="text-4xl md:text-6xl py-1 md:py-2 font-bold text-transparent bg-clip-text mb-4"
            style={{
              ...gradientStyle,
              filter: `drop-shadow(0 0 25px ${primaryColor}66)`,
            }}
          >
            A Special Letter
          </h1>
          <p className="text-lg text-purple-200">
            Just for {birthday?.name || "you"}, on your special day 💌
          </p>
        </motion.div>

        <motion.div
          className="relative w-full h-full flex justify-center"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 200,
          }}
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="envelope"
                className="relative cursor-pointer"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenLetter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="w-80 h-52 rounded-2xl shadow-2xl border-2 border-white/40 relative overflow-hidden"
                  style={gradientStyle}
                >
                  <div className="absolute top-0 left-0 w-full h-26 bg-white/20 transform origin-top"></div>
                  <div className="absolute bottom-0 left-0 w-full h-40 bg-white/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mail className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Heart className="w-6 h-6 text-red-400 fill-current" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </div>
                  <motion.div
                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white text-base font-semibold"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Click to open
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="letter"
                className="w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-pink-300 p-8 relative transition-all"
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.2 }}
                transition={{ duration: 0.8, type: "spring" }}
                style={{
                  background:
                    "linear-gradient(135deg, #fce7f3 0%, #fae8ff 25%, #e0e7ff 50%, #fdf2f8 75%, #fce7f3 100%)",
                }}
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="inline-block"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Heart className="w-12 h-12 text-red-500 fill-current mx-auto mb-3" />
                  </motion.div>
                </div>

                <div className="min-h-72 max-h-72 overflow-y-auto text-gray-700 leading-relaxed">
                  {showText && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3 mr-2">
                      <div className="whitespace-pre-wrap font-cute">
                        {currentText}
                        {showCursor && (
                          <motion.span
                            className="inline-block w-0.5 h-4 bg-purple-600 ml-1"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {currentText === letterText && (
                  <motion.div
                    className="text-center mt-6 flex flex-wrap justify-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 bg-white/60 text-pink-600 font-medium border border-pink-400 px-5 py-2 rounded-full hover:bg-pink-100 transition-all text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Read Letter Again
                    </button>

                    {onRestart && (
                      <button
                        onClick={onRestart}
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                        className="inline-flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg border border-white/40 hover:scale-105 transition-all text-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        Replay Celebration 🎉
                      </button>
                    )}
                  </motion.div>
                )}

                <div className="absolute top-4 left-4">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="absolute top-4 right-4">
                  <Heart className="w-6 h-6 text-rose-500 fill-current" />
                </div>
                <div className="absolute bottom-4 left-4">
                  <Heart className="w-6 h-6 text-pink-500 fill-current" />
                </div>
                <div className="absolute bottom-4 right-4">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
