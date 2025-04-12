import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Laugh,
  Ticket,
  Music,
  Star,
  Sparkles,
  Heart,
  Mic2,
  PartyPopper,
  Crown,
  Popcorn,
  Smile,
  Zap,
} from "lucide-react";

const FloatingIcon = ({ Icon, x, y, delay, scale = 1, opacity = 0.2 }) => (
  <motion.div
    className="absolute text-primary/20 pointer-events-none"
    initial={{ x, y, opacity: 0, scale: 0 }}
    animate={{
      x: x + Math.random() * 40 - 20,
      y: y + Math.random() * 40 - 20,
      opacity: [opacity * 0.5, opacity, opacity * 0.5],
      scale: [scale * 0.8, scale, scale * 0.8],
      rotate: [0, 15, -15, 0],
    }}
    transition={{
      duration: 5 + Math.random() * 3,
      repeat: Infinity,
      repeatType: "reverse",
      delay: delay,
      ease: "easeInOut",
    }}
  >
    <Icon size={20 * scale} />
  </motion.div>
);

const Particle = ({ x, y, delay }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-primary/20 pointer-events-none"
    initial={{ x, y, opacity: 0, scale: 0 }}
    animate={{
      x: x + (Math.random() * 100 - 50),
      y: y - 100 - Math.random() * 50,
      opacity: [0, 0.5, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeOut",
    }}
  />
);

const BouncingParticle = ({ initialX, initialY, delay }) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight : 1000,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateRandomVelocity = () => ({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
  });

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary/20 pointer-events-none"
      initial={{ x: initialX, y: initialY, opacity: 0 }}
      animate={{
        x: [initialX, initialX + 100, initialX - 100, initialX],
        y: [initialY, initialY - 100, initialY + 100, initialY],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: 10 + Math.random() * 5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
        delay: delay,
      }}
      style={{
        width: Math.random() * 3 + 1 + "px",
        height: Math.random() * 3 + 1 + "px",
      }}
      drag
      dragConstraints={{
        left: 0,
        right: dimensions.width,
        top: 0,
        bottom: dimensions.height,
      }}
    />
  );
};

const AuthLayout = ({ children }) => {
  const getRandomPosition = () => ({
    x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
    y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 0,
  });

  // Create a ref to store particles and icons positions
  const [particles, setParticles] = useState(() => {
    // Generate once and store
    return Array.from({ length: 75 }, (_, i) => ({
      ...getRandomPosition(),
      delay: i * 0.1,
      size: Math.random(),
      id: `particle-${i}`, // Add unique ID
    }));
  });

  const [icons, setIcons] = useState(() => {
    // Generate icons once and store
    const large = [
      { Icon: Laugh, delay: 0, scale: 2 },
      { Icon: PartyPopper, delay: 1, scale: 2.2 },
      { Icon: Crown, delay: 1, scale: 1.8 },
      { Icon: Popcorn, delay: 0.5, scale: 2.5 },
      { Icon: Laugh, delay: 0, scale: 2 },
      { Icon: PartyPopper, delay: 1, scale: 2.2 },
      { Icon: Crown, delay: 1, scale: 1.8 },
      { Icon: Popcorn, delay: 0.5, scale: 2.5 },
      { Icon: PartyPopper, delay: 1, scale: 2.2 },
      { Icon: Crown, delay: 2, scale: 1.8 },
      { Icon: Popcorn, delay: 0.5, scale: 2.5 },
    ].map((icon, i) => ({
      ...icon,
      ...getRandomPosition(),
      opacity: 0.15,
      id: `large-${i}`, // Add unique ID
    }));

    const medium = [
      { Icon: Mic2, delay: 1 },
      { Icon: Star, delay: 1.5 },
      { Icon: Sparkles, delay: 2 },
      { Icon: Heart, delay: 2.5 },
      { Icon: Music, delay: 1 },
      { Icon: Smile, delay: 1.5 },
      { Icon: Zap, delay: 4 },
      { Icon: Ticket, delay: 1.5 },
      { Icon: Mic2, delay: 1 },
      { Icon: Star, delay: 1.5 },
      { Icon: Sparkles, delay: 2 },
      { Icon: Heart, delay: 2.5 },
      { Icon: Music, delay: 3 },
      { Icon: Smile, delay: 2.5 },
      { Icon: Zap, delay: 4 },
      { Icon: Ticket, delay: 2.5 },
      { Icon: Mic2, delay: 1 },
      { Icon: Star, delay: 1.5 },
      { Icon: Sparkles, delay: 2 },
      { Icon: Heart, delay: 2.5 },
      { Icon: Music, delay: 2 },
      { Icon: Smile, delay: 3.5 },
      { Icon: Zap, delay: 4 },
      { Icon: Ticket, delay: 4.5 },
      { Icon: Mic2, delay: 1 },
      { Icon: Star, delay: 1.5 },
      { Icon: Sparkles, delay: 2 },
      { Icon: Heart, delay: 2.5 },
      { Icon: Music, delay: 3 },
      { Icon: Smile, delay: 3.5 },
      { Icon: Zap, delay: 4 },
      { Icon: Ticket, delay: 4.5 }
    ].map((icon, i) => ({
      ...icon,
      ...getRandomPosition(),
      scale: 1.2,
      opacity: 0.3,
      id: `medium-${i}`, // Add unique ID
    }));

    return { large, medium };
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background particles layer - fixed position */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large floating icons in background */}
        <AnimatePresence mode="sync">
          {icons.large.map((icon) => (
            <FloatingIcon key={icon.id} {...icon} />
          ))}
        </AnimatePresence>

        {/* Medium floating icons in middle layer */}
        <AnimatePresence mode="sync">
          {icons.medium.map((icon) => (
            <FloatingIcon key={icon.id} {...icon} />
          ))}
        </AnimatePresence>

        {/* Bouncing particles */}
        <AnimatePresence mode="sync">
          {particles.map((particle) => (
            <BouncingParticle
              key={particle.id}
              initialX={particle.x}
              initialY={particle.y}
              delay={particle.delay}
            />
          ))}
        </AnimatePresence>

        {/* Spotlight effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[100px] animate-pulse" />
        </div>
      </div>

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthLayout;
