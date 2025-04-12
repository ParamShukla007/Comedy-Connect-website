import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HyperText } from "@/components/magicui/hyper-text";

export const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-gradient-to-r from-yellow-400/20 to-pink-500/20">
      <div className="container mx-auto px-4 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6">
            <HyperText>Ready to Join the Comedy Revolution?</HyperText>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your journey today and be part of the fastest-growing comedy
            community.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-pink-500 text-black hover:from-yellow-500 hover:to-pink-600 px-8 py-6 text-xl"
              onClick={() => navigate("/staffsignin")}
            >
              Sign In as Staff
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-xl"
            >
              Schedule a Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
