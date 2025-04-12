import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { emojiPositions, features, statistics } from "./comps/landingPageData";
import { Testimonials } from "./Testimonials";
import ParticleEffect from "./comps/ParticleEffect";

const MagneticButton = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const xPct = (clientX - left - width / 2) * 0.4;
    const yPct = (clientY - top - height / 2) * 0.4;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all"
    >
      {children}
    </motion.button>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden">
      <ParticleEffect />

      {/* Floating Emojis Background */}
      <div className="fixed inset-0 pointer-events-none">
        {emojiPositions.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl"
            initial={{ x: item.x + "vw", y: item.y + "vh" }}
            animate={{
              y: [item.y + "vh", item.y - 10 + "vh", item.y + "vh"],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.2,
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-accent text-transparent bg-clip-text">
                Comedy Booking
                <br />
                Reimagined
              </h1>
            </motion.div>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with venues, comedians, and fans all in one place
            </p>
            <MagneticButton>Get Started</MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-card/30 to-card/10 backdrop-blur-xl border border-border/50 hover:shadow-xl hover:shadow-accent/10"
              >
                <div
                  className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl w-fit mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <motion.h3
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
};

export default LandingPage;
