import { motion } from 'framer-motion';
import { statistics } from './comps/landingPageData';

export const Statistics = () => (
  <section className="py-24 bg-gradient-to-r from-yellow-400/10 to-pink-500/10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {statistics.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-yellow-400 mb-2">{stat.number}</div>
            <div className="text-gray-300">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);