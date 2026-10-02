"use client";

import { useState, useEffect } from "react";
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

const generatePresetContent = (gender = "boy", galleryType = "solo", name = "") => {
  const pName = name.trim() || (gender === "boy" ? "Champ" : gender === "girl" ? "Queen" : "Friend");

  let title = "Time to Celebrate!";
  let subtitle = "The countdown is over... Let's celebrate! 🎉";
  let welcomeMessage = "🎉 It's your special day! 🎉";

  if (gender === "boy") {
    title = `Happy Birthday ${pName}! 👦⚡`;
    subtitle = `The countdown is over... Celebrating the King of the Day! 🎂✨`;
    welcomeMessage = `🎉 It's ${pName}'s Special Day! 🎉`;
  } else if (gender === "girl") {
    title = `Happy Birthday ${pName}! 👧👑`;
    subtitle = `The countdown is over... Celebrating the Queen of the Day! 🌸✨`;
    welcomeMessage = `🎉 It's ${pName}'s Special Day! 🎉`;
  } else {
    title = `Happy Birthday ${pName}! 🎉✨`;
    subtitle = `The countdown is over... Let's celebrate this wonderful day! 🎂✨`;
    welcomeMessage = `🎉 It's your special day! 🎉`;
  }

  let galleryTitle = "";
  let gallerySubtitle = "";

  if (galleryType === "together") {
    galleryTitle = `Moments with ${pName}`;
    gallerySubtitle = `Beautiful memories shared together with ${pName} 💕`;
  } else {
    if (gender === "boy") {
      galleryTitle = `Shining Moments of ${pName} 👦`;
      gallerySubtitle = `Capturing strength, ambition & unstoppable vibes ✨`;
    } else if (gender === "girl") {
      galleryTitle = `Shining Moments of ${pName} 👧`;
      gallerySubtitle = `Capturing elegance, beauty & pure magic ✨`;
    } else {
      galleryTitle = `Shining Moments of ${pName} 📸`;
      gallerySubtitle = `Capturing timeless joy, grace & bright smiles ✨`;
    }
  }

  let letter = {
    greeting: "",
    content: "",
    closing: "",
    signature: "",
  };

  if (gender === "boy") {
    letter = {
      greeting: `Dearest ${pName},`,
      content: `On this very special day, I want you to know how incredibly proud and grateful I am to have you in my life. You bring so much strength, positive energy, and laughter wherever you go.\n\nMay this brand new year open doors to unstoppable success, grand adventures, and lifelong happiness. Keep dreaming big, chasing your goals, and shining bright like the legend you are!\n\nHappy Birthday, King! 🎂✨`,
      closing: "With heartfelt wishes,",
      signature: "Your Best Buddy 💕",
    };
  } else if (gender === "girl") {
    letter = {
      greeting: `Dearest ${pName},`,
      content: `On your special day, I want to celebrate the remarkable, graceful, and beautiful soul that you are. Your smile brightens up even the darkest days, and your warmth touches everyone around you.\n\nMay your birthday and the year ahead be filled with endless magic, laughter, sweet surprises, and all the happiness your heart can hold.\n\nHappy Birthday, Queen! 🎂✨`,
      closing: "With all my love,",
      signature: "Your Dearest Friend 💕",
    };
  } else {
    letter = {
      greeting: `Dearest ${pName},`,
      content: `On this very special day, I want you to know how incredibly grateful I am to have you in my life. Your birthday isn't just a celebration of another year - it's a celebration of all the joy, laughter, and beautiful memories you bring to this world.\n\nYou have this amazing ability to light up any room you enter, to make people smile, and to spread kindness wherever you go.\n\nHappy Birthday, beautiful soul! 🎂✨`,
      closing: "Warmest birthday wishes,",
      signature: "Your Friend 💕",
    };
  }

  return {
    title,
    subtitle,
    welcomeMessage,
    galleryTitle,
    gallerySubtitle,
    letter,
  };
};

export default function CreateBirthdayPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState(() => {
    const initialGen = generatePresetContent("boy", "solo", "");
    return {
      name: "",
      nickname: "",
      gender: "boy",
      slug: "",
      birthdayDate: new Date().toISOString().split("T")[0],
      age: 24,
      celebrationMessage: "Click to start the magic! ✨",
      galleryType: "solo",
      floatingElementType: "mixed",
      photos: [],
      music: {
        enabled: true,
        url: "",
      },
      theme: {
        themeName: "Pink & Purple",
        primaryColor: "#ec4899",
        secondaryColor: "#a855f7",
        backgroundColor: "#090514",
      },
      effects: {
        confetti: true,
        hearts: true,
        fireworks: true,
        particles: true,
      },
      ...initialGen,
    };
  });

  useEffect(() => {
    fetch("/api/auth/me", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push("/login?redirect=/create");
        }
      })
      .catch(() => router.push("/login?redirect=/create"))
      .finally(() => setCheckingAuth(false));
  }, []);

  const [uploading, setUploading] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleGenderSelect = (newGender) => {
    const generated = generatePresetContent(newGender, formData.galleryType, formData.name);
    setFormData((prev) => ({
      ...prev,
      gender: newGender,
      ...generated,
    }));
  };

  const handleGalleryTypeSelect = (newGalleryType) => {
    const generated = generatePresetContent(formData.gender, newGalleryType, formData.name);
    setFormData((prev) => ({
      ...prev,
      galleryType: newGalleryType,
      galleryTitle: generated.galleryTitle,
      gallerySubtitle: generated.gallerySubtitle,
    }));
  };

  const handleAutoGenerate = () => {
    const generated = generatePresetContent(formData.gender, formData.galleryType, formData.name);
    setFormData((prev) => ({
      ...prev,
      ...generated,
    }));
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().trim().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const generated = generatePresetContent(formData.gender, formData.galleryType, val);
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === "" || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]/g, "-") ? generatedSlug : prev.slug,
      ...generated,
    }));
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
          caption: formData.galleryType === "together" ? `Memory with ${formData.name || "you"}` : "",
          order: formData.photos.length + uploadedPhotos.length,
        });
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedPhotos],
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
        music: { ...prev.music, url: result.url, enabled: true },
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

    setLoading(true);

    try {
      const res = await fetch("/api/birthdays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create birthday website");
      }

      router.push(`/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex items-center justify-center">
        <Cake className="w-12 h-12 text-pink-400 animate-bounce" />
      </div>
    );
  }

  const PRIMARY_ADMIN_EMAIL = "manish001yadav0@gmail.com";
  const isAuthorized = user && (user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL || user.canCreate === true || user.role === "admin");

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-950 flex flex-col items-center justify-center p-4 text-center text-white">
        <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
          <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <X className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 mb-2">
            Access Restricted
          </h2>
          <p className="text-purple-200/80 text-sm mb-6 leading-relaxed">
            Creation access is restricted. Only the site administrator (<span className="text-pink-300 font-semibold">{PRIMARY_ADMIN_EMAIL}</span>) or authorized users can build new birthday websites.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold px-6 py-3 rounded-2xl text-sm shadow-lg hover:scale-[102%] transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
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
              <span>Preview Experience</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Cake className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400">
            Create Birthday Website
          </h1>
          <p className="text-purple-300/80 text-sm mt-1">
            Build a unique personalized celebration link for your loved one
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Basic Information</span>
              </h2>

              <button
                type="button"
                onClick={handleAutoGenerate}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Auto-Generate Quotes & Letter 🪄</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Birthday Person's Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Rahul / Ankita"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="Paaji / Champ"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
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
                    placeholder="rahul"
                    className="w-full bg-transparent py-3 px-3 text-white placeholder-purple-300/30 focus:outline-none text-sm font-mono"
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
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Celebration Type / Avatar Preset *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "boy", label: "Birthday Boy 👦", desc: "King of the Day quotes & preset photos" },
                    { id: "girl", label: "Birthday Girl 👧", desc: "Queen of the Day quotes & preset photos" },
                    { id: "general", label: "General 🎉", desc: "Classic celebration quotes & preset photos" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGenderSelect(g.id)}
                      className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                        formData.gender === g.id
                          ? "bg-pink-500/20 border-pink-500 text-white shadow-lg"
                          : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-bold">{g.label}</span>
                      <span className="text-[10px] text-purple-300/60 text-center font-normal">{g.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: WELCOME SECTION */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl space-y-6">
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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Time to Celebrate!"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Subtitle Message
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="The countdown is over... Let's celebrate! 🎉"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Welcome Banner Text
                </label>
                <input
                  type="text"
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  placeholder="🎉 It's your special day! 🎉"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: MEMORIES & PHOTOS */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <span>Memories & Photo Gallery</span>
            </h2>

            {/* Gallery Type Mode Selection (Solo vs Together) */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Photo Gallery Type / Mode *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleGalleryTypeSelect("solo")}
                  className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-3 transition-all ${
                    (formData.galleryType || "solo") === "solo"
                      ? "bg-pink-500/20 border-pink-500 text-white shadow-lg"
                      : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xl">👤</span>
                  <div className="text-left">
                    <div className="font-bold text-sm text-white">Solo Person Photos (Single)</div>
                    <div className="text-[10px] text-purple-300/70">Removes "with you" text — shows solo quotes & photos</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGalleryTypeSelect("together")}
                  className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-3 transition-all ${
                    formData.galleryType === "together"
                      ? "bg-pink-500/20 border-pink-500 text-white shadow-lg"
                      : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xl">👥</span>
                  <div className="text-left">
                    <div className="font-bold text-sm text-white">Shared Moments Together</div>
                    <div className="text-[10px] text-purple-300/70">Shows "Moments with {formData.name || "You"}" and joint memories</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Gallery Heading Title
                </label>
                <input
                  type="text"
                  value={formData.galleryTitle}
                  onChange={(e) => setFormData({ ...formData, galleryTitle: e.target.value })}
                  placeholder="Shining Moments of Rahul"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Gallery Subtitle / Message
                </label>
                <input
                  type="text"
                  value={formData.gallerySubtitle}
                  onChange={(e) => setFormData({ ...formData, gallerySubtitle: e.target.value })}
                  placeholder="Capturing timeless joy, grace & bright smiles ✨"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
              </div>
            </div>

            <div className="bg-pink-500/10 border border-pink-500/30 rounded-2xl p-4 text-xs text-purple-200 leading-relaxed flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-pink-300">Don't have personal photos right now?</span> No problem! If you don't upload photos, the website will automatically showcase curated <span className="text-white font-semibold">Birthday Boy 👦</span> or <span className="text-white font-semibold">Birthday Girl 👧</span> photos and inspirational birthday lines!
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">
                Upload Memory Photos (Cloudinary)
              </label>

              <div className="border-2 border-dashed border-white/20 hover:border-pink-500/50 rounded-3xl p-6 text-center transition-all bg-white/[0.02]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                  id="photo-upload-input"
                />
                <label
                  htmlFor="photo-upload-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/30 rounded-2xl flex items-center justify-center text-pink-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-purple-200">
                    {uploading ? "Uploading to Cloudinary..." : "Click to select or drop photos here"}
                  </span>
                  <span className="text-xs text-purple-300/50">Supports JPG, PNG, WebP up to 10MB</span>
                </label>
              </div>
            </div>

            {/* Photo List */}
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {formData.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="bg-black/30 border border-white/10 p-3 rounded-2xl flex items-center gap-4 relative group"
                  >
                    <img
                      src={photo.url}
                      alt="Upload preview"
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => updateCaption(idx, e.target.value)}
                        placeholder="Add caption..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 text-xs text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60"
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
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Special Heartfelt Letter</span>
              </h2>

              <button
                type="button"
                onClick={handleAutoGenerate}
                className="flex items-center justify-center gap-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Auto-Generate Letter 🪄</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Greeting</label>
                <input
                  type="text"
                  value={formData.letter.greeting}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      letter: { ...formData.letter, greeting: e.target.value },
                    })
                  }
                  placeholder="My Dearest Friend,"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Letter Body Message
                </label>
                <textarea
                  rows={5}
                  value={formData.letter.content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      letter: { ...formData.letter, content: e.target.value },
                    })
                  }
                  placeholder="Write your emotional message..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Closing</label>
                  <input
                    type="text"
                    value={formData.letter.closing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        letter: { ...formData.letter, closing: e.target.value },
                      })
                    }
                    placeholder="With all my love,"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Signature
                  </label>
                  <input
                    type="text"
                    value={formData.letter.signature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        letter: { ...formData.letter, signature: e.target.value },
                      })
                    }
                    placeholder="Your Friend 💕"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-purple-300/30 focus:outline-none focus:border-pink-500/60 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: MUSIC & THEME & EFFECTS */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl space-y-6">
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
                      formData.theme.themeName === t.name
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
                  checked={formData.music.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      music: { ...formData.music, enabled: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-pink-500 cursor-pointer"
                />
              </div>

              {formData.music.enabled && (
                <div className="bg-black/30 border border-white/10 p-4 rounded-2xl space-y-4">
                  <div className="text-xs font-semibold text-purple-200">Audio Track Options</div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, music: { ...formData.music, url: "" } })}
                      className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                        !formData.music.url
                          ? "border-pink-500 bg-pink-500/20 text-white shadow-md"
                          : "border-white/10 bg-white/5 text-purple-300 hover:bg-white/10"
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${!formData.music.url ? "opacity-100" : "opacity-0"}`} />
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

                  {formData.music.url && (
                    <div className="flex items-center gap-2 text-xs text-pink-300 font-mono bg-white/5 p-3 rounded-xl border border-white/10">
                      <span className="truncate flex-1">Custom Audio URL: {formData.music.url}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, music: { ...formData.music, url: "" } })}
                        className="text-purple-300 hover:text-red-400 font-sans text-xs underline"
                      >
                        Reset to Default
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Effects Checkboxes */}
            <div className="pt-4 border-t border-white/10">
              <label className="block text-sm font-medium text-purple-200 mb-3">
                Interactive Special Effects
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { key: "confetti", label: "Confetti Burst" },
                  { key: "hearts", label: "Floating Hearts" },
                  { key: "fireworks", label: "Fireworks" },
                  { key: "particles", label: "Glow Particles" },
                ].map((eff) => (
                  <label
                    key={eff.key}
                    className="flex items-center gap-2 text-xs font-medium text-purple-200 cursor-pointer bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.effects[eff.key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          effects: {
                            ...formData.effects,
                            [eff.key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-pink-500"
                    />
                    <span>{eff.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Floating Element Options Selector */}
            <div className="pt-4 border-t border-white/10">
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Floating Elements Options (Float all over website after celebration) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "balloons", label: "Floating Balloons", icon: "🎈" },
                  { id: "hearts", label: "Glowing Hearts", icon: "💖" },
                  { id: "stars", label: "Magic Stars", icon: "✨" },
                  { id: "flowers", label: "Rose Petals", icon: "🌸" },
                  { id: "gifts", label: "Presents & Gifts", icon: "🎁" },
                  { id: "cakes", label: "Cakes & Sweets", icon: "🎂" },
                  { id: "mixed", label: "Mixed Celebration", icon: "🌟" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, floatingElementType: item.id })}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      (formData.floatingElementType || "mixed") === item.id
                        ? "bg-pink-500/20 border-pink-500 text-white shadow-lg"
                        : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-purple-200 border border-white/20 px-8 py-4 rounded-2xl font-semibold transition-all text-sm hover:scale-[101%]"
            >
              <Eye className="w-5 h-5 text-pink-400" />
              <span>Preview</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl border border-white/20 transition-all hover:scale-[101%] disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span>Creating Birthday Website...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Create Birthday Website</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* LIVE PREVIEW MODAL WITH INTERACTIVE CONTROL BAR */}
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
                  disabled={loading}
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg border border-white/20 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Creating...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Confirm & Create Website</span>
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
                disabled={loading}
                className="flex-1 text-center py-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Confirm & Publish</span>
              </button>
            </div>

            <BirthdayView birthday={formData} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
