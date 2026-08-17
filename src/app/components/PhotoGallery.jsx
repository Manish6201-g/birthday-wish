"use client";

import { motion } from "motion/react";
import { Camera, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";

export default function PhotoGallery({ birthday, onNext }) {
  const defaultPhotos = [
    { id: 1, url: "/images/1.jpeg", caption: `Beautiful moments with ${birthday?.name || "you"}` },
    { id: 2, url: "/images/2.jpeg", caption: "Cherished memories" },
    { id: 3, url: "/images/3.jpeg", caption: "Unforgettable times" },
    { id: 4, url: "/images/4.jpeg", caption: "Smiles and joy" },
    { id: 5, url: "/images/5.jpeg", caption: "Special moments together" },
  ];

  const photosList =
    birthday?.photos && birthday.photos.length > 0
      ? birthday.photos
      : defaultPhotos;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="mb-8"
          animate={{
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <Camera className="w-16 h-16 text-pink-400 mx-auto" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl py-1 md:py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4">
          Moments with You
        </h1>
        <p className="text-purple-300 text-lg">
          Beautiful memories with {birthday?.name || "you"} 📸
        </p>
      </motion.div>

      {/* Cube Gallery */}
      <div className="w-full max-w-2xl mx-auto">
        <Swiper
          effect={"cube"}
          grabCursor={true}
          cubeEffect={{
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          }}
          pagination={true}
          modules={[EffectCube, Pagination]}
          className="mySwiper h-[400px] md:h-[500px]"
        >
          {photosList.map((photo, index) => (
            <SwiperSlide key={photo._id || photo.id || index} className="relative rounded-xl overflow-hidden">
              <img
                src={photo.url || photo.src || "/placeholder.svg"}
                alt={photo.caption || `Memory ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-center text-white/90 text-sm font-medium">
                  {photo.caption}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white text-lg px-8 py-4 rounded-full shadow-xl border-2 border-white/70 transition-all duration-300 hover:scale-[103%]"
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
