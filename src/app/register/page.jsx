"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Cake, Key, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, inviteCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 blur-[150px] opacity-25 pointer-events-none bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full cinematic-glass-card p-8 rounded-3xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Cake className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-black cinematic-glow-text">
            Creator Account
          </h1>
          <p className="text-purple-200/70 text-xs sm:text-sm mt-1">
            Restricted access for authorized birthday website creators
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ x: [-8, 8, -6, 6, 0] }}
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm leading-relaxed"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-200 text-xs font-semibold mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Manish"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-200 text-xs font-semibold mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manish001yadav0@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-200 text-xs font-semibold mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-11 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/50 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-purple-200 text-xs font-semibold mb-2 flex items-center justify-between">
              <span>Admin Passcode / Invite Code</span>
              <span className="text-[10px] text-pink-300/80 font-mono">(If required)</span>
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
              <input
                type="password"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter owner passcode"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white py-3.5 px-6 rounded-2xl font-bold shadow-lg border border-white/20 transition-all hover:scale-[101%] disabled:opacity-50 flex items-center justify-center gap-2 mt-6 text-sm"
          >
            {loading ? (
              <span>Verifying Access...</span>
            ) : (
              <>
                <span>Create Creator Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-purple-200/70">
          Already authorized?{" "}
          <Link
            href="/login"
            className="text-pink-400 hover:text-pink-300 font-bold hover:underline"
          >
            Log in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
