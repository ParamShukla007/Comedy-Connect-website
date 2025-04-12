import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
  Ticket,
  AlertCircle,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import {
  BookingTrendsChart,
  UserDemographicsChart,
  PeakHoursHeatMap,
  RevenueChart,
} from "@/components/charts/AnalyticsCharts";

const MetricCard = ({ title, value, change, icon: Icon, subText }) => (
  <Card className="p-6 bg-gradient-to-br from-background to-primary/5 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {value}
        </h3>
        {subText && (
          <p className="text-xs text-muted-foreground mt-1">{subText}</p>
        )}
      </div>
      <div className="p-3 rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
    {change && (
      <div
        className={`text-sm flex items-center gap-1 ${
          change >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        <TrendingUp className="h-4 w-4" />
        {change}% from last month
      </div>
    )}
  </Card>
);

const TopPerformerCard = ({ title, data }) => (
  <Card className="p-6 bg-gradient-to-br from-background to-primary/5">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-3 rounded-lg bg-background/50 hover:bg-primary/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-bold text-primary">#{index + 1}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-muted-foreground">{item.stats}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.change}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("month");

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">Platform Analytics</h2>
            <p className="text-muted-foreground">
              Comprehensive overview of platform performance
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past Quarter</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value="15,234"
            change={12.5}
            icon={Users}
            subText="1,234 new this month"
          />
          <MetricCard
            title="Tickets Sold"
            value="45,678"
            change={8.3}
            icon={Ticket}
            subText="₹2.3M revenue"
          />
          <MetricCard
            title="Active Events"
            value="234"
            change={-2.1}
            icon={Calendar}
            subText="45 pending approval"
          />
          <MetricCard
            title="Cancellation Rate"
            value="2.4%"
            change={-0.8}
            icon={AlertCircle}
            subText="12 this month"
          />
        </div>

        {/* Tabs for Different Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
                <BookingTrendsChart />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  User Demographics
                </h3>
                <UserDemographicsChart />
              </Card>
            </div>

            {/* Top Performers Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              <TopPerformerCard
                title="Top Artists"
                data={[
                  {
                    name: "John Doe",
                    stats: "45 shows • 4.9 rating",
                    value: "₹123,456",
                    change: "+12% this month",
                  },
                  // Add more items...
                ]}
              />

              <TopPerformerCard
                title="Top Venues"
                data={[
                  {
                    name: "Comedy Club NYC",
                    stats: "89 events • 4.8 rating",
                    value: "₹234,567",
                    change: "+15% this month",
                  },
                  // Add more items...
                ]}
              />
            </div>

            {/* Peak Hours Analysis */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Peak Booking Hours</h3>
              <PeakHoursHeatMap />
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Analysis</h3>
              <RevenueChart />
            </Card>
          </TabsContent>

          {/* Add other TabsContent sections */}
        </Tabs>
      </div>
    </main>
  );
};

export default Analytics;
