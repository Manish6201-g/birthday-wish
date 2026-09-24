"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import Loader from "./Loader";
import Countdown from "./Countdown";
import Celebration from "./Celebration";
import HappyBirthday from "./HappyBirthday";
import PhotoGallery from "./PhotoGallery";
import Letter from "./Letter";
import MusicPlayer from "./MusicPlayer";
import BirthdayHubSection from "./BirthdayHubSection";
import { CinematicFooter } from "@/components/ui/motion-footer";

export default function BirthdayView({ birthday }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check whether birthday is today or past vs future
  const bDate = birthday?.birthdayDate ? new Date(birthday.birthdayDate) : new Date();
  const [isBirthdayOver, setIsBirthdayOver] = useState(() => {
    const now = new Date();
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

  const handleRestart = () => {
    setCurrentScreen(0);
  };

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
    <Letter key="letter" birthday={birthday} onRestart={handleRestart} />,
  ];

  // Dynamic Theme Colors
  const primaryColor = birthday?.theme?.primaryColor || "#ec4899";
  const secondaryColor = birthday?.theme?.secondaryColor || "#a855f7";
  const backgroundColor = birthday?.theme?.backgroundColor || "#090514";

  const personName = birthday?.name || "Special Someone";

  return (
    <div
      className="min-h-screen relative transition-colors duration-700 overflow-x-hidden"
      style={{
        backgroundColor: backgroundColor,
        backgroundImage: `radial-gradient(ellipse at top, ${backgroundColor}, #000000)`,
      }}
    >
      {/* Dynamic Background Radial Gradients */}
      <div
        className="fixed inset-0 z-0 blur-[130px] opacity-30 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 25%, ${primaryColor}, transparent 50%)`,
        }}
      />
      <div
        className="fixed inset-0 z-0 blur-[130px] opacity-30 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 80%, ${secondaryColor}, transparent 50%)`,
        }}
      />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Loader key="loader" birthday={birthday} />
          ) : (
            <AnimatePresence mode="wait">{screens[currentScreen]}</AnimatePresence>
          )}
        </AnimatePresence>
      </div>

      {/* Birthday Hub Section on Final Letter Screen */}
      {!isLoading && currentScreen === 3 && (
        <BirthdayHubSection currentBirthdaySlug={birthday?.slug} currentName={personName} />
      )}

      {/* Attach Cinematic Motion Footer on Final Screen */}
      {!isLoading && currentScreen === 3 && (
        <CinematicFooter
          giantText={personName.toUpperCase()}
          heading={`Celebrating ${personName}'s Special Day! 🎉`}
          name={personName}
          isPublicView={true}
        />
      )}

      {/* Floating Background Music Player */}
      <MusicPlayer musicConfig={birthday?.music} />

      {/* Floating Restart/Replay Button (shows on screens 1, 2, 3) */}
      {!isLoading && currentScreen > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-3.5 py-2 rounded-full border border-pink-500/30 shadow-lg text-xs font-semibold transition-all hover:scale-105"
            title="Restart Website Celebration"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
            <span>Restart</span>
          </button>
        </motion.div>
      )}

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
