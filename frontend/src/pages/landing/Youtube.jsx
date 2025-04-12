import React, { useState } from "react";

const Youtube = () => {
  const videos = [
    {
      id: "xpV6d-HwBW0",
      title: "Video 1",
    },
    {
      id: "ePydtgnnqZc",
      title: "Video 2",
    },
    {
      id: "FtDv-L1stdo",
      title: "Video 3",
    },
    {
      id: "dytUxaBbrRA",
      title: "Video 4",
    },
    {
      id: "IEfBBYmxtIo",
      title: "Video 5",
    },
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-white">
          Featured Videos
        </h2>

        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${
                videos[currentVideoIndex].id
              }${isHovered ? "?autoplay=1&mute=1" : ""}`}
              title="YouTube video player"
              className="w-full h-[400px] rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Navigation */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={prevVideo}
              className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
              onClick={nextVideo}
              className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
          </div>
        </div>

        {/* Video Progress */}
        <div className="flex justify-center mt-6 gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentVideoIndex
                  ? "bg-accent w-6"
                  : "bg-muted hover:bg-accent/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Youtube;
