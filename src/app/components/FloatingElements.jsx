"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const ELEMENT_MAP = {
  balloons: ["🎈", "🎈", "🎈", "🎈", "🎈", "🎈"],
  hearts: ["💖", "💕", "❤️", "💗", "💘", "✨"],
  stars: ["✨", "⭐", "🌟", "💫", "✨", "⭐"],
  flowers: ["🌸", "🌹", "🌷", "🌺", "💐", "🌸"],
  gifts: ["🎁", "🎉", "🎊", "📦", "🎈", "🎉"],
  cakes: ["🎂", "🍰", "🧁", "🍩", "🎂", "🎉"],
  mixed: ["🎈", "💖", "✨", "🎁", "🎂", "🌸", "⭐", "🎉"],
};

export default function FloatingElements({ type = "mixed" }) {
  const selectedIcons = ELEMENT_MAP[type] || ELEMENT_MAP.mixed;

  // Generate deterministic floating items across screen
  const floatingItems = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const icon = selectedIcons[i % selectedIcons.length];
      const leftPos = Math.random() * 92 + 4; // 4% to 96%
      const size = Math.random() * 1.5 + 1.2; // 1.2rem to 2.7rem
      const duration = Math.random() * 6 + 7; // 7s to 13s
      const delay = Math.random() * 5; // 0s to 5s delay
      const wobble = Math.random() * 40 - 20; // -20px to +20px wobble

      return { id: i, icon, leftPos, size, duration, delay, wobble };
    });
  }, [type, selectedIcons]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
      {floatingItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            y: "105vh",
            x: 0,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: "-15vh",
            x: [0, item.wobble, -item.wobble, 0],
            opacity: [0, 0.9, 0.9, 0],
            rotate: [0, 15, -15, 360],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${item.leftPos}%`,
            fontSize: `${item.size}rem`,
            filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
}
