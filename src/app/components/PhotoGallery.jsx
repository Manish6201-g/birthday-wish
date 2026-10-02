"use client";

import { motion } from "motion/react";
import { Camera, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function PhotoGallery({ birthday, onNext }) {
  const primaryColor = birthday?.theme?.primaryColor || "#ec4899";
  const secondaryColor = birthday?.theme?.secondaryColor || "#a855f7";

  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
  };

  const name = birthday?.name || "the Birthday Star";

  const boyPhotos = [
    {
      id: "boy-1",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800",
      caption: `👑 The Main Character of the Day — Keep shining bright and chasing your biggest dreams, ${name}!`,
    },
    {
      id: "boy-2",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      caption: "🌟 A gentleman with a heart of gold, unstoppable ambition, and endless positivity.",
    },
    {
      id: "boy-3",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800",
      caption: "🎉 Here's to another extraordinary chapter of strength, success, and greatness!",
    },
    {
      id: "boy-4",
      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800",
      caption: "🎈 Spreading good vibes, genuine kindness, and laughter everywhere you go.",
    },
    {
      id: "boy-5",
      url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800",
      caption: `🎂 May your year ahead be filled with big wins, grand adventures, and pure happiness! ✨`,
    },
  ];

  const girlPhotos = [
    {
      id: "girl-1",
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800",
      caption: `👑 The Queen of the Celebration — Radiating beauty, elegance, and pure magic, ${name}!`,
    },
    {
      id: "girl-2",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800",
      caption: "✨ A golden soul with a contagious smile that lights up the whole world.",
    },
    {
      id: "girl-3",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
      caption: "💖 Celebrating a truly remarkable person who brings warmth and sunshine to everyone.",
    },
    {
      id: "girl-4",
      url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800",
      caption: "🌸 Creating timeless memories and inspiring everyone with your grace and sweetness.",
    },
    {
      id: "girl-5",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800",
      caption: "🎂 Wishing you a year ahead overflowing with love, laughter, and endless sparkles! 🌸",
    },
  ];

  const generalPhotos = [
    { id: 1, url: "/images/1.jpeg", caption: `✨ Celebrating the one-of-a-kind light and beauty you bring to this world, ${name}!` },
    { id: 2, url: "/images/2.jpeg", caption: "🌟 Capturing timeless joy, authentic moments, and a heart that inspires." },
    { id: 3, url: "/images/3.jpeg", caption: "🎉 Another year wiser, bolder, and more wonderful — cheers to your special day!" },
    { id: 4, url: "/images/4.jpeg", caption: "🎈 May your journey ahead be blessed with happiness, peace, and endless reasons to smile." },
    { id: 5, url: "/images/5.jpeg", caption: "🎂 Wishing you a birthday as magnificent and extraordinary as your spirit! 💕" },
  ];

  const selectedPreset =
    birthday?.gender === "boy"
      ? boyPhotos
      : birthday?.gender === "girl"
      ? girlPhotos
      : generalPhotos;

  const photosList =
    birthday?.photos && birthday.photos.length > 0
      ? birthday.photos
      : selectedPreset;

  const getOptimizedSrc = (photo) => {
    const rawSrc = typeof photo === "string" ? photo : (photo.url || photo.src || "/placeholder.svg");
    if (typeof rawSrc === "string" && rawSrc.includes("res.cloudinary.com") && !rawSrc.includes("f_auto")) {
      return rawSrc.replace("/upload/", "/upload/f_auto,q_auto,w_1000/");
    }
    return rawSrc;
  };

  const isTogetherMode = birthday?.galleryType === "together";
  const personName = birthday?.name || "the Birthday Star";

  const defaultTitle = isTogetherMode
    ? `Moments with ${personName}`
    : `Shining Moments of ${personName}`;

  const defaultSubtitle = isTogetherMode
    ? `Beautiful memories shared together with ${personName} 💕`
    : `Capturing timeless joy, grace & bright smiles ✨`;

  const galleryHeading = birthday?.galleryTitle || defaultTitle;
  const gallerySubheading = birthday?.gallerySubtitle || defaultSubtitle;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center mb-6 sm:mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="mb-4 sm:mb-6"
          animate={{
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" style={{ color: primaryColor }} />
        </motion.div>

        <h1
          className="text-3xl sm:text-5xl md:text-6xl py-1 font-bold text-transparent bg-clip-text mb-2 sm:mb-4"
          style={{
            ...gradientStyle,
            filter: `drop-shadow(0 0 25px ${primaryColor}66)`,
          }}
        >
          {galleryHeading}
        </h1>
        <p className="text-purple-200 text-sm sm:text-lg">
          {gallerySubheading}
        </p>
      </motion.div>

      {/* 3D Coverflow Photo Slider with Auto Format Adjustment */}
      <div className="w-full max-w-3xl mx-auto relative px-2 sm:px-10">
        <Swiper
          key={`swiper-gallery-${photosList.length}`}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={photosList.length > 1}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="mySwiper h-[400px] sm:h-[480px] rounded-2xl py-4"
        >
          {photosList.map((photo, index) => {
            const imgSrc = getOptimizedSrc(photo);
            const defaultCaption = selectedPreset[index % selectedPreset.length]?.caption || "";
            const rawCaption = typeof photo === "string" ? "" : (photo.caption || "");
            const hasCustomCaption = rawCaption.trim() !== "";
            const isSoloMode = (birthday?.galleryType || "solo") === "solo";
            const isGenericMemoryWith = isSoloMode && /^memor(y|ies)\s+with/i.test(rawCaption.trim());
            const displayCaption = (hasCustomCaption && !isGenericMemoryWith) ? rawCaption : defaultCaption;

            return (
              <SwiperSlide
                key={photo._id || photo.id || index}
                className="w-[280px] sm:w-[380px] h-[360px] sm:h-[430px] relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black/60"
              >
                {/* Ambient Blurred Background Layer (Auto-fills background aspect ratio) */}
                <img
                  src={imgSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                />

                {/* Main Auto-Adjusted Foreground Image (Preserves full portrait/landscape aspect ratio without cropping) */}
                <div className="relative w-full h-full flex items-center justify-center p-3 z-10">
                  <img
                    src={imgSrc}
                    alt={displayCaption || `Memory ${index + 1}`}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>

                {displayCaption && (
                  <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 text-center text-white text-xs sm:text-sm font-medium">
                    {displayCaption}
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Arrows */}
        {photosList.length > 1 && (
          <>
            <button
              className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6 text-pink-400" />
            </button>
            <button
              className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6 text-pink-400" />
            </button>
          </>
        )}
      </div>

      <motion.div
        className="mt-8 sm:mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={onNext}
          style={gradientStyle}
          className="text-white text-base sm:text-lg px-8 py-3.5 sm:py-4 rounded-full shadow-xl border-2 border-white/70 transition-all duration-300 hover:scale-[103%]"
        >
          <motion.div className="flex items-center space-x-2" whileHover={{ x: 5 }}>
            <span>One Last Thing</span>
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
}
