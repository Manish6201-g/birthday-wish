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
          Moments with You
        </h1>
        <p className="text-purple-200 text-sm sm:text-lg">
          Beautiful memories with {birthday?.name || "you"} 📸
        </p>
      </motion.div>

      {/* 3D Coverflow Photo Slider */}
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
          className="mySwiper h-[380px] sm:h-[450px] rounded-2xl py-4"
        >
          {photosList.map((photo, index) => (
            <SwiperSlide
              key={photo._id || photo.id || index}
              className="w-[280px] sm:w-[360px] h-[340px] sm:h-[400px] relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20"
            >
              <img
                src={typeof photo === "string" ? photo : (photo.url || photo.src || "/placeholder.svg")}
                alt={photo.caption || `Memory ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl"
              />
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-center text-white text-xs sm:text-sm font-medium">
                  {photo.caption}
                </div>
              )}
            </SwiperSlide>
          ))}
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
