// components/FeatureCard.jsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const FeatureCard = ({ icon, title, description, color }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="relative"
  >
    <Card className="p-6 bg-card/50 backdrop-blur-xl border-border overflow-hidden">
      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  </motion.div>
);

export default FeatureCard;