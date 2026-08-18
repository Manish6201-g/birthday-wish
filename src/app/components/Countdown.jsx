"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Gift, Cake } from "lucide-react";

export default function Countdown({ birthday, onComplete }) {
  const primaryColor = birthday?.theme?.primaryColor || "#ec4899";
  const secondaryColor = birthday?.theme?.secondaryColor || "#a855f7";

  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
  };

  const targetDate = useMemo(() => {
    if (!birthday?.birthdayDate) return new Date("2025-07-16T00:00:00");
    const parsedDate = new Date(birthday.birthdayDate);
    if (isNaN(parsedDate.getTime())) return new Date();

    const now = new Date();
    const currentYear = now.getFullYear();
    let nextBirthday = new Date(currentYear, parsedDate.getMonth(), parsedDate.getDate());

    if (now.getTime() > nextBirthday.getTime() + 24 * 60 * 60 * 1000) {
      nextBirthday = new Date(currentYear + 1, parsedDate.getMonth(), parsedDate.getDate());
    }

    return nextBirthday;
  }, [birthday?.birthdayDate]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        if (onComplete) onComplete();
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days, color: `from-[${primaryColor}] to-[${secondaryColor}]` },
    { label: "Hours", value: timeLeft.hours, color: `from-[${primaryColor}] to-[${secondaryColor}]` },
    { label: "Minutes", value: timeLeft.minutes, color: `from-[${primaryColor}] to-[${secondaryColor}]` },
    { label: "Seconds", value: timeLeft.seconds, color: `from-[${primaryColor}] to-[${secondaryColor}]` },
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="mb-6"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Cake className="w-16 h-16 mx-auto" style={{ color: primaryColor }} />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl py-1 md:py-2 font-bold text-transparent bg-clip-text mb-4"
          style={{
            ...gradientStyle,
            filter: `drop-shadow(0 0 25px ${primaryColor}66)`,
          }}
        >
          {birthday?.name ? `${birthday.name}'s Birthday Countdown` : "Birthday Countdown"}
        </motion.h1>
        <p className="text-lg text-purple-200">
          {birthday?.subtitle || "The magical moment approaches..."}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl w-full">
        {timeUnits.map((unit, index) => {
          return (
            <motion.div
              key={unit.label}
              className="text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 200,
              }}
            >
              <motion.div
                className="relative rounded-2xl p-6 md:p-8 shadow-xl border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}cc, ${secondaryColor}cc)`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${primaryColor}44`,
                }}
              >
                <motion.div
                  className="text-3xl md:text-5xl font-bold text-white mb-2 mt-2"
                  key={unit.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {unit.value.toString().padStart(2, "0")}
                </motion.div>
                <div className="text-white/90 text-sm md:text-base font-medium uppercase tracking-wider">
                  {unit.label}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Gift className="w-8 h-8 mx-auto mb-2" style={{ color: secondaryColor }} />
        <p className="text-purple-200 text-base">The surprise is just moments away💖</p>
      </motion.div>
    </motion.div>
  );
}
