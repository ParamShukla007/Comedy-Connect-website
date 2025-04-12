// components/sections/Hero.jsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import FloatingEmoji from './comps/FloatingEmoji';
import { emojiPositions } from './comps/landingPageData';

export const Hero = ({ isHovered, setIsHovered }) => (
  <div className="relative min-h-screen">
    {emojiPositions.map((item, index) => (
      <FloatingEmoji 
        key={index}
        emoji={item.emoji}
        x={item.x}
        y={item.y}
        delay={index * 0.5}
      />
    ))}

    <div className="relative container mx-auto px-4 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [-2, 2],
            y: [-5, 5]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-block"
        >
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
            Laugh. Connect. Create.
          </h1>
        </motion.div>
        
        <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Where comedy dreams come true. Connect with venues, discover talent,
          and be part of the next big laugh.
        </p>

        <div className="flex gap-4 justify-center">
          <motion.div 
            className="relative inline-block group"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-pink-500 text-black hover:from-yellow-500 hover:to-pink-600 px-8 py-6 text-xl">
              Start Your Comedy Journey
              <motion.span
                animate={{ x: isHovered ? 10 : 0 }}
                className="ml-2"
              >
                →
              </motion.span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-xl">
              Browse Shows
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </div>
);

// Additional section components (Features.jsx, Statistics.jsx, Testimonials.jsx, CallToAction.jsx) would follow the same pattern