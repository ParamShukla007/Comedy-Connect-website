// components/FloatingEmoji.jsx
import { motion } from "framer-motion";

const FloatingEmoji = ({ emoji, x, y, delay }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{
      y: [-20, 20],
      opacity: [0, 1, 0],
      rotate: [-10, 10],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute text-4xl"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    {emoji}
  </motion.div>
);

export default FloatingEmoji;
