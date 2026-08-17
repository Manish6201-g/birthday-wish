"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion } from "framer-motion";

export default function MusicPlayer({ musicConfig }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  const enabled = musicConfig?.enabled ?? true;
  // Use custom URL or fallback sample royalty-free soothing birthday melody
  const musicUrl =
    musicConfig?.url ||
    "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=happy-birthday-113583.mp3";

  useEffect(() => {
    if (!enabled) return;

    // Create audio element
    audioRef.current = new Audio(musicUrl);
    audioRef.current.loop = true;

    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch((err) => {
            console.log("Autoplay prevented:", err);
          });
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicUrl, enabled]);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
        });
    }
  };

  if (!enabled) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 right-4 z-50"
    >
      <button
        onClick={toggleMusic}
        className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-3.5 py-2 rounded-full border border-pink-500/30 shadow-lg text-sm font-medium transition-all hover:scale-105"
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
            <span className="text-xs text-pink-300">🎵 Music On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-300">🔇 Music Off</span>
          </>
        )}
      </button>
    </motion.div>
  );
}
