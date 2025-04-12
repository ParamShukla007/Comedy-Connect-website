import React from "react";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Users,
  Mic2,
  Star,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, change }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="p-6 space-y-4 bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg hover:border-primary/40 transition-all">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {value}
          </h3>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="text-sm text-green-500 flex items-center gap-1 font-medium">
        <TrendingUp className="h-4 w-4" />
        {change}% this month
      </div>
    </Card>
  </motion.div>
);

const ArtistDashboard = () => {
  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-background to-background/50">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Artist Dashboard
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Welcome back, Artist Name
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Upcoming Shows"
            value="12"
            icon={Calendar}
            change="8"
          />
          <StatCard
            title="Total Followers"
            value="2.5K"
            icon={Users}
            change="12"
          />
          <StatCard
            title="Shows Performed"
            value="45"
            icon={Mic2}
            change="15"
          />
          <StatCard title="Average Rating" value="4.8" icon={Star} change="5" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Upcoming Shows</h3>
                <button className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm">
                  View all <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((show) => (
                  <motion.div
                    key={show}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Comedy Night Special</h4>
                      <p className="text-sm text-muted-foreground">
                        Venue Name • 7:00 PM
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <button className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm">
                  View all <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((activity) => (
                  <div key={activity} className="flex items-start gap-4 group">
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        New booking request from Venue XYZ
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ArtistDashboard;
