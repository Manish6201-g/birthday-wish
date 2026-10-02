"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cake,
  Plus,
  Eye,
  Edit,
  Trash2,
  Share2,
  Copy,
  Check,
  LogOut,
  Calendar,
  Sparkles,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Share modal state
  const [shareBirthday, setShareBirthday] = useState(null);
  const [copied, setCopied] = useState(false);

  // Delete modal state
  const [deleteBirthday, setDeleteBirthday] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();

      if (!authData.authenticated) {
        router.push("/login");
        return;
      }

      setUser(authData.user);

      const bRes = await fetch("/api/birthdays");
      if (bRes.ok) {
        const bData = await bRes.json();
        setBirthdays(bData.birthdays || []);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteBirthday) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/birthdays/${deleteBirthday._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBirthdays((prev) => prev.filter((b) => b._id !== deleteBirthday._id));
        setDeleteBirthday(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete birthday");
      }
    } catch (err) {
      alert("Error deleting birthday website");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = (b) => {
    const fullUrl = `${window.location.origin}/b/${b.slug}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Happy Birthday ${b.name}! 🎂`,
          text: `Check out this special birthday surprise created for ${b.name}!`,
          url: fullUrl,
        })
        .catch(() => {
          setShareBirthday({ ...b, fullUrl });
        });
    } else {
      setShareBirthday({ ...b, fullUrl });
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Cake className="w-12 h-12 text-pink-400 animate-bounce mb-4" />
          <p className="text-purple-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 text-white relative p-4 sm:p-8 overflow-x-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 z-0 blur-[150px] opacity-15 pointer-events-none bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-500" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Navbar */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Cake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300">
                Birthday Platform
              </h1>
              <p className="text-xs text-purple-300/70">
                Logged in as <span className="text-pink-300 font-semibold">{user?.name || user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-full font-medium shadow-lg transition-all hover:scale-[102%] text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Birthday</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-purple-200 border border-white/10 px-4 py-2.5 rounded-full font-medium transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        {/* Dashboard Title & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white">MY BIRTHDAY WEBSITES</h2>
            <p className="text-purple-300/80 text-sm mt-1">
              Manage, edit, and share all your custom birthday celebrations
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-sm text-purple-300">
            Total Websites: <span className="font-bold text-pink-400">{birthdays.length}</span>
          </div>
        </div>

        {/* Birthday Cards Grid */}
        {birthdays.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl"
          >
            <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Birthday Websites Yet</h3>
            <p className="text-purple-300/70 max-w-md mx-auto mb-6 text-sm">
              Create your very first personalized birthday surprise website in just a few clicks!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Birthday Website</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {birthdays.map((b) => {
              const bDate = b.birthdayDate ? new Date(b.birthdayDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "July 16";

              return (
                <motion.div
                  key={b._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 hover:bg-white/[0.08] border border-white/10 backdrop-blur-xl rounded-3xl p-6 transition-all flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-2xl flex items-center justify-center text-2xl">
                          🎂
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
                            {b.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-purple-300/70 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-pink-400" />
                            <span>{bDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-2xl p-3 mb-6 border border-white/5 font-mono text-xs text-purple-300 flex items-center justify-between">
                      <span className="truncate">/b/{b.slug}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-purple-400/60 shrink-0 ml-2" />
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/10">
                    <Link
                      href={`/b/${b.slug}`}
                      target="_blank"
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 text-purple-200 transition-all text-xs font-medium gap-1"
                      title="View Website"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Link>

                    <Link
                      href={`/dashboard/birthday/${b._id}/edit`}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 text-purple-200 transition-all text-xs font-medium gap-1"
                      title="Edit Birthday"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => handleShare(b)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-blue-500/20 hover:text-blue-300 text-purple-200 transition-all text-xs font-medium gap-1"
                      title="Share Link"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => setDeleteBirthday(b)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-purple-200 transition-all text-xs font-medium gap-1"
                      title="Delete Birthday"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {shareBirthday && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-950 border border-pink-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg">
                  🎉
                </div>
                <h3 className="text-2xl font-bold text-white">Your Birthday Website is Ready!</h3>
                <p className="text-purple-300/80 text-sm mt-1">
                  Share this link with {shareBirthday.name} or family members!
                </p>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-2 mb-6">
                <input
                  type="text"
                  readOnly
                  value={shareBirthday.fullUrl}
                  className="bg-transparent text-pink-300 text-xs font-mono w-full focus:outline-none truncate"
                />
                <button
                  onClick={() => copyToClipboard(shareBirthday.fullUrl)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(shareBirthday.fullUrl)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => setShareBirthday(null)}
                  className="bg-white/10 hover:bg-white/20 text-purple-200 px-5 py-3 rounded-2xl text-sm font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteBirthday && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-950 border border-red-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-center"
            >
              <div className="w-14 h-14 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Delete Birthday Website?</h3>
              <p className="text-purple-200/80 text-sm mb-6 leading-relaxed">
                Are you sure you want to delete <span className="text-pink-400 font-semibold">{deleteBirthday.name}'s</span> birthday website? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteBirthday(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-purple-200 py-3 rounded-2xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
