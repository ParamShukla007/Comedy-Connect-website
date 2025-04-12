import React from "react";
import { Search, Filter } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="p-4 bg-card/30 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search events, artists, or venues..."
            className="w-full pl-10 p-3 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select className="p-3 rounded-lg bg-background/50 border border-border text-foreground">
            <option>All Types</option>
            <option>standup</option>
            <option>music</option>
            <option>theatre</option>
          </select>
          <button className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="hidden md:inline">Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
