"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Home, Cake } from "lucide-react";

export default function NotFoundView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 blur-[150px] opacity-20 pointer-events-none bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full cinematic-glass-card p-8 rounded-3xl relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Cake className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-3xl font-black cinematic-glow-text mb-3">
          Birthday Page Not Found
        </h1>

        <p className="text-purple-200/80 text-sm mb-8 leading-relaxed">
          Oops! The birthday celebration link you're looking for doesn't exist or may have been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-md hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            href="/create"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-purple-200 border border-white/20 px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Create Birthday</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
