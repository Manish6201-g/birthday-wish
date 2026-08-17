"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Loader from "./Loader";
import Countdown from "./Countdown";
import Celebration from "./Celebration";
import HappyBirthday from "./HappyBirthday";
import PhotoGallery from "./PhotoGallery";
import Letter from "./Letter";
import MusicPlayer from "./MusicPlayer";

export default function BirthdayView({ birthday }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check whether birthday is today or past vs future
  const bDate = birthday?.birthdayDate ? new Date(birthday.birthdayDate) : new Date();
  const [isBirthdayOver, setIsBirthdayOver] = useState(() => {
    const now = new Date();
    // Compare month and day
    return (
      now.getMonth() === bDate.getMonth() && now.getDate() === bDate.getDate()
    ) || now.getTime() >= bDate.getTime();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const screens = [
    !isBirthdayOver ? (
      <Countdown
        key="countdown"
        birthday={birthday}
        onComplete={() => setIsBirthdayOver(true)}
      />
    ) : (
      <Celebration
        key="celebration"
        birthday={birthday}
        onNext={() => setCurrentScreen(1)}
      />
    ),
    <HappyBirthday
      key="happy"
      birthday={birthday}
      onNext={() => setCurrentScreen(2)}
    />,
    <PhotoGallery
      key="gallery"
      birthday={birthday}
      onNext={() => setCurrentScreen(3)}
    />,
    <Letter key="letter" birthday={birthday} />,
  ];

  // Theme styling overrides if custom theme provided
  const bgGradient = birthday?.theme?.backgroundColor
    ? `radial-gradient(circle at 50% 50%, ${birthday.theme.primaryColor || '#ec4899'}22, transparent 60%)`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/30 via-black to-purple-950/30 overflow-hidden relative">
      {/* Dynamic Background Gradients */}
      <div
        className="fixed inset-0 z-0 blur-[120px] opacity-20"
        style={{
          backgroundImage:
            bgGradient ||
            "radial-gradient(circle at 20% 25%, rgba(255, 99, 165, 0.6), transparent 40%)",
        }}
      />
      <div
        className="fixed inset-0 z-0 blur-[120px] opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.6), transparent 40%)",
        }}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" />
        ) : (
          <AnimatePresence mode="wait">{screens[currentScreen]}</AnimatePresence>
        )}
      </AnimatePresence>

      {/* Floating Background Music Player */}
      <MusicPlayer musicConfig={birthday?.music} />

      {/* Watermark Signature */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 1,
        }}
        className="fixed bottom-4 right-4 text-[13px] text-white/40 pointer-events-none z-50 font-light"
      >
        Made by Manish
      </motion.div>
    </div>
  );
}
