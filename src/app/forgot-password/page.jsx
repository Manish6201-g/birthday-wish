"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  Cake,
  ArrowLeft,
  KeyRound,
  CheckCircle,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Send,
  AlertCircle,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("passcode"); // "passcode" or "email"
  const [email, setEmail] = useState("");
  const [securityKey, setSecurityKey] = useState("");

  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState(1); // 1: Verify, 2: New Password, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  // Password strength score (0 to 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(newPassword);

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, securityKey, method: activeTab }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setMessage(data.message);

      if (data.token) {
        setResetToken(data.token);
        setStep(2); // Move to set new password
      } else if (data.resetUrl) {
        setResetUrl(data.resetUrl);
        setStep(2);
      } else {
        // Email sent or pending
        setError("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please check and re-enter.");
      return;
    }

    setLoading(true);

    try {
      const payload = resetToken
        ? { token: resetToken, newPassword }
        : { email, securityKey, newPassword };

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setStep(3); // Success
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 blur-[150px] opacity-20 pointer-events-none bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full cinematic-glass-card p-6 sm:p-8 rounded-3xl relative z-10"
      >
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Cake className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-black cinematic-glow-text">
            Account Recovery
          </h1>
          <p className="text-purple-200/70 text-xs sm:text-sm mt-1">
            {step === 1
              ? "Select a recovery method to reset your password"
              : step === 2
              ? "Create a new strong password for your account"
              : "Password updated successfully!"}
          </p>
        </div>

        {/* Tab Selection (Step 1) */}
        {step === 1 && (
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("passcode");
                setError("");
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "passcode"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-purple-300/70 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Passcode Key</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("email");
                setError("");
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "email"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : "text-purple-300/70 hover:text-white"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Email Link</span>
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: VERIFICATION FORM */}
        {step === 1 && (
          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            <div>
              <label className="block text-purple-200 text-xs font-medium mb-2">
                Account Email Address *
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

            {activeTab === "passcode" && (
              <div>
                <label className="block text-purple-200 text-xs font-medium mb-2">
                  Security Passcode / Master Key *
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                  <input
                    type="password"
                    required
                    value={securityKey}
                    onChange={(e) => setSecurityKey(e.target.value)}
                    placeholder="Enter owner passcode"
                    className="w-full bg-white/5 border border-pink-500/30 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white py-3.5 px-6 rounded-2xl font-semibold shadow-lg border border-white/20 transition-all hover:scale-[101%] disabled:opacity-50 flex items-center justify-center gap-2 mt-4 text-sm"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>{activeTab === "passcode" ? "Verify & Set New Password" : "Send Reset Link"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-purple-300 hover:text-pink-400 text-xs font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: NEW PASSWORD CREATION */}
        {step === 2 && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-purple-200 text-xs font-medium mb-2">
                New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-11 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/50 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength <= 1
                          ? "w-1/4 bg-red-500"
                          : strength === 2
                          ? "w-2/4 bg-yellow-500"
                          : strength === 3
                          ? "w-3/4 bg-blue-500"
                          : "w-full bg-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="text-[11px] text-purple-300/70 text-right">
                    Strength:{" "}
                    <span className="font-semibold text-white">
                      {strength <= 1 ? "Weak" : strength === 2 ? "Medium" : strength === 3 ? "Good" : "Strong 🎉"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-purple-200 text-xs font-medium mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-11 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/50 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-white/10 hover:bg-white/20 text-purple-200 py-3 px-4 rounded-2xl font-medium text-xs transition-all border border-white/10"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg border border-white/20 transition-all hover:scale-[101%] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <span>Updating...</span>
                ) : (
                  <>
                    <span>Update Password</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <div className="space-y-6 text-center py-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm leading-relaxed flex flex-col items-center gap-3">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
              <span className="font-semibold text-base">Password Updated Successfully!</span>
              <span className="text-xs text-purple-200/80">Logging in and redirecting to Dashboard...</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
