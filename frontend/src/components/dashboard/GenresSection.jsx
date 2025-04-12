import React from "react";
import { Smile } from "lucide-react";

const genreGradients = {
  "Observational Comedy": "from-purple-500 to-indigo-600",
  Satire: "from-blue-500 to-cyan-600",
  Improvisational: "from-green-500 to-emerald-600",
  "Sketch Comedy": "from-yellow-500 to-orange-600",
  "Dark Comedy": "from-gray-700 to-slate-900",
  "Musical Comedy": "from-pink-500 to-rose-600",
  "Roast Battles": "from-red-500 to-rose-600",
  "Character Comedy": "from-teal-500 to-cyan-600",
};

const GenresSection = ({ genres }) => {
  return (
    <div className="bg-gradient-to-b from-background/50 to-background py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-3 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Discover Comedy Genres
        </h2>
        <p className="text-lg text-muted-foreground mb-10">
          Explore different styles of comedy and find your perfect laugh
        </p>

        <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide">
          {genres.map((genre, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-56 rounded-xl p-6 
                   hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1
                   transition-all duration-300 ease-out cursor-pointer
                   border border-border/50 backdrop-blur-sm
                   bg-gradient-to-br ${genreGradients[genre]}`}
            >
              <div className="bg-white/10 p-3 rounded-lg w-fit mb-4">
                <Smile className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{genre}</h3>
              <p className="text-sm text-white/80 font-medium">
                100+ Events Available
              </p>
              <div className="mt-4 flex items-center text-white/70 text-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-white/70 mr-2"></span>
                Trending Now
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenresSection;
