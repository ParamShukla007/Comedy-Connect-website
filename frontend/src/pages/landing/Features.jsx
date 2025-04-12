// components/sections/Features.jsx
import { motion } from 'framer-motion';
import FeatureCard from './comps/FeatureCard';
import { features, getFeatureIcon } from './comps/landingPageData';

export const Features = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text"
      >
        Everything You Need to Succeed
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const IconComponent = getFeatureIcon(feature.iconType);
          return (
            <FeatureCard
              key={index}
              icon={<IconComponent className="w-8 h-8" />}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          );
        })}
      </div>
    </div>
  </section>
);
