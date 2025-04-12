import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }) => {
  const location = useLocation();
  const isSignIn = location.pathname === "/signin";

  const pageVariants = {
    initial: {
      rotateY: isSignIn ? -180 : 180,
      opacity: 0,
      scale: 0.9,
      z: -100,
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      z: 0,
    },
    exit: {
      rotateY: isSignIn ? 180 : -180,
      opacity: 0,
      scale: 0.9,
      z: -100,
    },
  };

  return (
    <div className="perspective-1000 w-full h-full">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          opacity: { duration: 0.3 },
        }}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PageTransition;
