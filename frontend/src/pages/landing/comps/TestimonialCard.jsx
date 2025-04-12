// components/TestimonialCard.jsx
import { motion } from "framer-motion";

const TestimonialCard = ({ name, role, content, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-card/50 backdrop-blur-xl p-6 rounded-lg border-border"
  >
    <p className="text-muted-foreground mb-4">"{content}"</p>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
        {name[0]}
      </div>
      <div className="ml-3">
        <h4 className="font-semibold text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </motion.div>
);

export default TestimonialCard;
