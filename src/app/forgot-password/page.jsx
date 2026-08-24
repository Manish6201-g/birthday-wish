"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Cake, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setSuccess(true);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 blur-[140px] opacity-20 pointer-events-none bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Cake className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400">
            Forgot Password
          </h1>
          <p className="text-purple-200/70 text-sm mt-1">
            Enter your account email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm leading-relaxed">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm leading-relaxed flex flex-col items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <span>Password reset link generated successfully!</span>
            </div>

            {resetUrl && (
              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-3">
                <p className="text-xs text-purple-200/80">Click below to reset your password now:</p>
                <Link
                  href={resetUrl}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all w-full justify-center"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Reset Password Now</span>
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-purple-300 hover:text-pink-400 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manish001yadav0@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/60 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white py-3.5 px-6 rounded-2xl font-semibold shadow-lg border border-white/20 transition-all hover:scale-[101%] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Generating Link...</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-purple-300 hover:text-pink-400 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
