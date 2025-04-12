import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Users,
  Star,
  Ticket,
  Calendar,
  Download,
} from "lucide-react";

const PerformanceCard = ({ title, value, change, icon: Icon }) => (
  <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
    <div
      className={`text-sm mt-2 flex items-center gap-1 ${
        change >= 0 ? "text-green-500" : "text-red-500"
      }`}
    >
      <TrendingUp className="h-4 w-4" />
      <span>{change}% from last month</span>
    </div>
  </Card>
);

const Stats = () => {
  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Performance Stats</h2>
            <p className="text-muted-foreground">
              Track your performance metrics
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PerformanceCard
                title="Total Shows"
                value="45"
                change={8.2}
                icon={Calendar}
              />
              <PerformanceCard
                title="Tickets Sold"
                value="1,234"
                change={12.5}
                icon={Ticket}
              />
              <PerformanceCard
                title="Average Rating"
                value="4.8"
                change={2.1}
                icon={Star}
              />
              <PerformanceCard
                title="Total Followers"
                value="2.5K"
                change={15.3}
                icon={Users}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <h3 className="text-lg font-semibold mb-4">
                  Performance Trend
                </h3>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Chart Coming Soon
                </div>
              </Card>
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <h3 className="text-lg font-semibold mb-4">
                  Audience Demographics
                </h3>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Chart Coming Soon
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Stats;
