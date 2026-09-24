"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Plus, Search, Cake, ArrowRight, ExternalLink, Heart, Gift } from "lucide-react";

export default function BirthdayHubSection({ currentBirthdaySlug = "", currentName = "" }) {
  const router = useRouter();
  const [searchSlug, setSearchSlug] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchSlug.trim()) return;
    const clean = searchSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    router.push(`/b/${clean}`);
  };

  const sampleSites = [
    { name: "Paaji's Birthday", slug: "paaji", emoji: "🎂", tag: "Live Demo" },
    { name: "Rahul's Celebration", slug: "rahul", emoji: "🎉", tag: "Sample" },
    { name: "Ankita's Special Day", slug: "ankita", emoji: "💖", tag: "Sample" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="cinematic-glass-card rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-pink-500/20"
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-500/20 via-pink-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-pink-300 mb-4 backdrop-blur-md">
            <Gift className="w-4 h-4 text-pink-400" />
            <span>Birthday Hub & Website Creator</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black cinematic-glow-text mb-3">
            Get Birthday Websites or Create a New One
          </h2>

          <p className="text-purple-200/80 text-sm leading-relaxed font-light">
            Want to see another celebration or create a personalized website for your loved one? Search existing birthday links or build your own in minutes!
          </p>
        </div>

        {/* Search / Get Birthday Website Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center bg-black/50 border border-white/15 focus-within:border-pink-500/60 rounded-2xl sm:rounded-full p-2 transition-all shadow-xl">
            <div className="flex items-center flex-1 px-4 py-2 w-full">
              <Search className="w-5 h-5 text-purple-300/60 shrink-0 mr-3" />
              <span className="text-xs text-purple-300/60 font-mono hidden sm:inline mr-1">/b/</span>
              <input
                type="text"
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
                placeholder="Enter name or slug (e.g. paaji, rahul)..."
                className="w-full bg-transparent text-white placeholder-purple-300/40 text-sm focus:outline-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white px-6 py-3 rounded-xl sm:rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10 shrink-0 mt-2 sm:mt-0"
            >
              <span>Get Website</span>
              <ArrowRight className="w-4 h-4 text-pink-400" />
            </button>
          </div>
        </form>

        {/* Quick Sample Birthday Links */}
        <div className="mb-8 relative z-10">
          <div className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-3 text-center sm:text-left">
            Popular Birthday Websites
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sampleSites.map((site) => (
              <Link
                key={site.slug}
                href={`/b/${site.slug}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-pink-500/15 border border-white/10 hover:border-pink-500/40 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">{site.emoji}</span>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors truncate">
                      {site.name}
                    </div>
                    <div className="text-[10px] text-purple-300/60 font-mono truncate">
                      /b/{site.slug}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-purple-400/60 group-hover:text-pink-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action: Create New Site */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-center sm:text-left">
          <div>
            <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Make Someone's Birthday Unforgettable</span>
            </h3>
            <p className="text-xs text-purple-300/70 mt-0.5">
              Build a custom birthday website with music, photo gallery, countdown, and love letter.
            </p>
          </div>

          <Link
            href="/create"
            className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-7 py-3.5 rounded-full font-extrabold text-sm shadow-xl transition-all hover:scale-105 border border-white/20 flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Birthday Website</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
