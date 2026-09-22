"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cake, Sparkles, Plus, Eye, ShieldCheck, Heart, Zap, Image as ImageIcon } from "lucide-react";
import { CinematicFooter } from "@/components/ui/motion-footer";

export default function LandingPage() {
  return (
    <div className="relative w-full bg-gradient-to-br from-purple-950 via-black to-purple-950 text-white selection:bg-pink-500/30 overflow-x-hidden">
      {/* Background radial glow */}
      <div
        className="fixed inset-0 z-0 blur-[140px] opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 25%, rgba(255, 99, 165, 0.6), transparent 40%)",
        }}
      />
      <div
        className="fixed inset-0 z-0 blur-[140px] opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.6), transparent 40%)",
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full min-h-[110vh] max-w-6xl mx-auto px-4 sm:px-8 py-6 pb-20 border-b border-white/10 shadow-2xl">
        {/* Navbar */}
        <nav className="flex items-center justify-between py-4 border-b border-white/10 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Cake className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300">
              Birthday Platform
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-purple-200 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/create"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Create Birthday</span>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-pink-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-pink-300 mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Reusable Personalized Birthday Website Builder</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 mb-6 drop-shadow-lg">
              Create Magical Birthday Surprises for Anyone
            </h1>

            <p className="text-purple-200/80 text-base sm:text-lg mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              Transform your heartfelt wishes into an emotional, interactive birthday website. Add countdowns, memory photo galleries, typewriter letters, background music, and instant sharing links.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-base shadow-2xl transition-all hover:scale-105 border border-white/20"
              >
                <Plus className="w-5 h-5" />
                <span>Create a Birthday Website</span>
              </Link>

              <Link
                href="/b/paaji"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-purple-200 border border-white/15 px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105 backdrop-blur-md"
              >
                <Eye className="w-5 h-5 text-pink-400" />
                <span>View Live Demo (/b/paaji)</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl"
          >
            <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/30 rounded-2xl flex items-center justify-center text-pink-400 mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dynamic Custom URLs</h3>
            <p className="text-purple-300/70 text-sm leading-relaxed">
              Generate unique shareable links like <span className="text-pink-300 font-mono">/b/rahul</span> or <span className="text-pink-300 font-mono">/b/riya</span> powered by database storage.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl"
          >
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 mb-5">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cloudinary Memory Gallery</h3>
            <p className="text-purple-300/70 text-sm leading-relaxed">
              Upload multiple photo memories with custom captions displayed in an interactive 3D Coverflow Swiper slider.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl"
          >
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mb-5">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Emotional Letter & Music</h3>
            <p className="text-purple-300/70 text-sm leading-relaxed">
              Write a personalized typewriter letter with ambient background music, balloons, floating hearts, and confetti.
            </p>
          </motion.div>
        </div>

        <div className="text-center text-xs text-purple-300/60 uppercase tracking-widest pt-8">
          Scroll Down to Reveal Cinematic Footer
        </div>
      </main>

      {/* Cinematic Motion Footer with GSAP Curtain Reveal */}
      <CinematicFooter />
    </div>
  );
}
