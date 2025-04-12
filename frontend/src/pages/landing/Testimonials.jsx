import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { testimonials } from "./comps/landingPageData.js";
import { motion } from "framer-motion";

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
        "border-gray-950/[.1] bg-card/50 backdrop-blur-xl hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
          {name[0]}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-foreground">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-muted-foreground">{body}</blockquote>
    </figure>
  );
};

export const Testimonials = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-primary via-purple-500 to-accent text-transparent bg-clip-text"
      >
        What Our Community Says
      </motion.h2>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  </section>
);
