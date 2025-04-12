// pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero } from './Hero';
import { Features } from './Features';
import { Statistics } from './Statistics';
import { Testimonials } from './Testimonials';
import { CallToAction } from './CallToAction';
import Navbar from '../components/Navbar';
import Footer from '../footer/footer';
import { AuroraText } from "@/components/magicui/aurora-text";
import Youtube from './Youtube';
import Shorts from './Shorts';
const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0 opacity-10"
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '50px 50px',
              y: backgroundY
            }}
          />
        </div>

        <Hero isHovered={isHovered} setIsHovered={setIsHovered} />
        
        {/* Aurora Text Section */}
        <div className="w-full h-auto px-4 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
              Build exceptional <AuroraText>communities.</AuroraText>
            </h1>
          </div>
        </div>

        <Features />
        <Statistics />
        <Testimonials />
        <CallToAction />
        <Youtube />
        <Shorts />

        {/* Mouse Trailer */}
        <motion.div
          className="fixed w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 mix-blend-screen pointer-events-none opacity-50 z-50"
          animate={{
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: isHovered ? 2 : 1
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;