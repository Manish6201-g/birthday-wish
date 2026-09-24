"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cake,
  Upload,
  Trash2,
  Eye,
  ArrowLeft,
  Sparkles,
  Music,
  Palette,
  Camera,
  FileText,
  X,
  Save,
  Check,
} from "lucide-react";
import BirthdayView from "@/app/components/BirthdayView";

const THEME_PRESETS = [
  { name: "Pink & Purple", primary: "#ec4899", secondary: "#a855f7", bg: "#090514" },
  { name: "Blue & Purple", primary: "#3b82f6", secondary: "#8b5cf6", bg: "#030712" },
  { name: "Red & Gold", primary: "#ef4444", secondary: "#eab308", bg: "#0a0505" },
  { name: "Midnight", primary: "#6366f1", secondary: "#ec4899", bg: "#020617" },
  { name: "Sunset", primary: "#f97316", secondary: "#ec4899", bg: "#0f050d" },
];

export default function EditBirthdayPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [formData, setFormData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchBirthdayDetails();
  }, [id]);

  const fetchBirthdayDetails = async () => {
    try {
      const res = await fetch(`/api/birthdays/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load birthday details");
      }

      let bDateStr = "";
      if (data.birthday?.birthdayDate) {
        bDateStr = new Date(data.birthday.birthdayDate).toISOString().split("T")[0];
      }

      setFormData({
        ...data.birthday,
        birthdayDate: bDateStr,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedPhotos = [];

      for (const file of files) {
        const data = new FormData();
        data.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Upload failed");

        uploadedPhotos.push({
          url: result.url,
          caption: `Memory with ${formData.name || "you"}`,
          order: (formData.photos || []).length + uploadedPhotos.length,
        });
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...uploadedPhotos],
      }));
    } catch (err) {
      setError(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleMusicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingMusic(true);
    setError("");

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("type", "audio");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Music upload failed");

      setFormData((prev) => ({
        ...prev,
        music: { ...(prev.music || {}), url: result.url, enabled: true },
      }));
    } catch (err) {
      setError(err.message || "Failed to upload audio file");
    } finally {
      setUploadingMusic(false);
    }
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const updateCaption = (index, caption) => {
    setFormData((prev) => {
      const updated = [...prev.photos];
      updated[index].caption = caption;
      return { ...prev, photos: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.birthdayDate || !formData.slug) {
      setError("Please fill in Name, Birthday Date, and URL slug.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/birthdays/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update birthday website");
      }

      router.push(`/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Cake className="w-12 h-12 text-pink-400 animate-bounce mb-4" />
          <p className="text-purple-300 text-lg">Loading birthday details...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex flex-col items-center justify-center p-4">
        <p className="text-red-400 mb-4 font-semibold">{error || "Birthday not found"}</p>
        <Link href="/dashboard" className="text-pink-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 text-white relative p-4 sm:p-8 overflow-x-hidden">
      {/* Glow */}
      <div className="fixed inset-0 z-0 blur-[150px] opacity-15 pointer-events-none bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-500" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-purple-200 hover:text-pink-400 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-purple-200 border border-white/20 px-4 py-2.5 rounded-full font-medium transition-all text-sm hover:scale-105"
            >
              <Eye className="w-4 h-4 text-pink-400" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Cake className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black cinematic-glow-text">
            Edit Birthday Website
          </h1>
          <p className="text-purple-300/80 text-sm mt-1">
            Updating content for <span className="text-pink-300 font-semibold">{formData.name}</span> (/b/{formData.slug})
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="cinematic-glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>Basic Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Birthday Person's Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={formData.nickname || ""}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Custom URL Slug *
                </label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-pink-500/60">
                  <span className="bg-white/5 px-3 py-3 text-xs text-purple-300/60 border-r border-white/10 font-mono">
                    /b/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    className="w-full bg-transparent py-3 px-3 text-white focus:outline-none text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Birthday Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthdayDate}
                  onChange={(e) => setFormData({ ...formData, birthdayDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: WELCOME SECTION */}
          <div className="cinematic-glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
              <Cake className="w-5 h-5" />
              <span>Welcome & Celebration Screen</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Celebration Title
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Subtitle Message
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Welcome Banner Text
                </label>
                <input
                  type="text"
                  value={formData.welcomeMessage || ""}
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: MEMORIES & PHOTOS */}
          <div className="cinematic-glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <span>Memories & Photo Gallery</span>
            </h2>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">
                Upload New Memory Photos (Cloudinary)
              </label>

              <div className="border-2 border-dashed border-white/20 hover:border-pink-500/50 rounded-3xl p-6 text-center transition-all bg-white/[0.02]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                  id="edit-photo-upload-input"
                />
                <label
                  htmlFor="edit-photo-upload-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/30 rounded-2xl flex items-center justify-center text-pink-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-purple-200">
                    {uploading ? "Uploading..." : "Click to select new photos to add"}
                  </span>
                </label>
              </div>
            </div>

            {/* Photo List */}
            {formData.photos && formData.photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {formData.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="bg-black/30 border border-white/10 p-3 rounded-2xl flex items-center gap-4 relative group"
                  >
                    <img
                      src={photo.url}
                      alt="Memory"
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={photo.caption || ""}
                        onChange={(e) => updateCaption(idx, e.target.value)}
                        placeholder="Add caption..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-pink-500/60"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Remove photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: SPECIAL LETTER */}
          <div className="cinematic-glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Special Heartfelt Letter</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Greeting</label>
                <input
                  type="text"
                  value={formData.letter?.greeting || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      letter: { ...(formData.letter || {}), greeting: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Letter Body Message
                </label>
                <textarea
                  rows={5}
                  value={formData.letter?.content || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      letter: { ...(formData.letter || {}), content: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Closing</label>
                  <input
                    type="text"
                    value={formData.letter?.closing || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        letter: { ...(formData.letter || {}), closing: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Signature
                  </label>
                  <input
                    type="text"
                    value={formData.letter?.signature || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        letter: { ...(formData.letter || {}), signature: e.target.value },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-pink-500/60 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: MUSIC & THEME */}
          <div className="cinematic-glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              <span>Theme, Music & Effects</span>
            </h2>

            {/* Themes */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">Preset Themes</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {THEME_PRESETS.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        theme: {
                          themeName: t.name,
                          primaryColor: t.primary,
                          secondaryColor: t.secondary,
                          backgroundColor: t.bg,
                        },
                      })
                    }
                    className={`p-3 rounded-2xl border transition-all text-xs font-semibold text-center flex flex-col items-center gap-2 ${
                      formData.theme?.themeName === t.name
                        ? "border-pink-500 bg-pink-500/20 text-white shadow-lg"
                        : "border-white/10 bg-white/5 text-purple-300 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full shadow-inner"
                      style={{
                        background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                      }}
                    />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Music Options */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-pink-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Enable Background Music</div>
                    <div className="text-xs text-purple-300/60">Plays ambient audio track on user interaction</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.music?.enabled ?? true}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      music: { ...(formData.music || {}), enabled: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-pink-500 cursor-pointer"
                />
              </div>

              {(formData.music?.enabled ?? true) && (
                <div className="bg-black/30 border border-white/10 p-4 rounded-2xl space-y-4">
                  <div className="text-xs font-semibold text-purple-200">Audio Track Options</div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          music: { ...(formData.music || {}), url: "", enabled: true },
                        })
                      }
                      className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                        !formData.music?.url
                          ? "border-pink-500 bg-pink-500/20 text-white shadow-md"
                          : "border-white/10 bg-white/5 text-purple-300 hover:bg-white/10"
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${!formData.music?.url ? "opacity-100" : "opacity-0"}`} />
                      <span>Use Default Soothing Music</span>
                    </button>

                    <label className="flex-1 py-3 px-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-center cursor-pointer text-purple-200 transition-all flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-pink-400" />
                      <span>{uploadingMusic ? "Uploading Audio..." : "Upload Custom Audio (MP3/WAV)"}</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleMusicUpload}
                        disabled={uploadingMusic}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formData.music?.url && (
                    <div className="flex items-center gap-2 text-xs text-pink-300 font-mono bg-white/5 p-3 rounded-xl border border-white/10">
                      <span className="truncate flex-1">Custom Audio URL: {formData.music.url}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            music: { ...(formData.music || {}), url: "", enabled: true },
                          })
                        }
                        className="text-purple-300 hover:text-red-400 font-sans text-xs underline"
                      >
                        Reset to Default
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-purple-200 border border-white/20 px-8 py-4 rounded-2xl font-semibold transition-all text-sm"
            >
              <Eye className="w-5 h-5 text-pink-400" />
              <span>Preview</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl border border-white/20 transition-all hover:scale-[101%] disabled:opacity-50 text-sm"
            >
              {saving ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* LIVE PREVIEW MODAL WITH CONTROL BAR */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md">
            {/* Top Control Bar */}
            <div className="fixed top-4 inset-x-4 max-w-4xl mx-auto z-50 flex items-center justify-between gap-3 bg-black/80 border border-white/20 p-3 rounded-full shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 pl-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
                <span className="text-xs font-bold text-white tracking-wide">Live Preview Mode</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 text-purple-300" />
                  <span>Back to Editing</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    setShowPreview(false);
                    handleSubmit(e);
                  }}
                  disabled={saving}
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg border border-white/20 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Confirm & Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Floating Quick Bar */}
            <div className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-50 flex items-center justify-center gap-3 bg-black/85 border border-pink-500/30 p-2.5 rounded-full shadow-2xl backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="flex-1 text-center py-2 text-xs font-semibold text-purple-200 hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit More</span>
              </button>
              <div className="h-4 w-px bg-white/20" />
              <button
                type="button"
                onClick={(e) => {
                  setShowPreview(false);
                  handleSubmit(e);
                }}
                disabled={saving}
                className="flex-1 text-center py-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Save Changes</span>
              </button>
            </div>

            <BirthdayView birthday={formData} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
