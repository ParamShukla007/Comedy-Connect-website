import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Shorts = () => {
  const shorts = [
    { id: "3vOq7nt62pA", title: "Short 1" },
    { id: "_kwGDmQ9HFc", title: "Short 2" },
    { id: "oDe8MDR9mrM", title: "Short 3" },
    { id: "3hVMBY7zgZQ", title: "Short 4" },
    { id: "iuihY7-qYNo", title: "Short 5" },
    { id: "ptkmS6F5wXM", title: "Short 6" },
    { id: "Saw1LvLT2Ew", title: "Short 7" },
    { id: "Y7Kn6Knnwm4", title: "Short 8" },
    { id: "X7ZIF6WqduQ", title: "Short 9" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3 >= shorts.length ? 0 : prev + 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 3 < 0 ? Math.floor(shorts.length / 3) * 3 : prev - 3
    );
  };

  return (
    <div className="w-full py-8">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Trending Shorts
        </h2>

        <div className="relative max-w-7xl mx-auto">
          {/* Update navigation buttons to match theme */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-16 bg-muted hover:bg-accent/20 p-3 rounded-full z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16 bg-muted hover:bg-accent/20 p-3 rounded-full z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Shorts Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              initial={false}
              animate={{ x: `-${currentIndex * 33.33}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {shorts.map((short, index) => (
                <motion.div
                  key={short.id}
                  className="min-w-[33.33%] relative group"
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="aspect-[9/16] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${short.id}${
                        hoveredIndex === index ? "?autoplay=1&mute=1" : ""
                      }`}
                      title={short.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                        hoveredIndex === index ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center justify-between">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium"
                          >
                            Watch Now
                          </motion.button>

                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
                            >
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Update pagination dots to match theme */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(shorts.length / 3) }).map(
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx * 3)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / 3) === idx
                      ? "bg-accent w-6"
                      : "bg-muted hover:bg-accent/50"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shorts;
