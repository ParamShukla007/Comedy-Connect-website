import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Music2,
  Map,
  TicketIcon,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  BookingTrendsChart,
  RevenueChart,
  UserDemographicsChart,
  PeakHoursChart,
} from "@/components/charts/AnalyticsCharts";

const StatCard = ({ title, value, subtitle, icon: Icon, change, variant }) => (
  <Card className="p-6 space-y-4 bg-background/50 backdrop-blur-sm border-primary/20">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-${variant || 'primary'}/10`}>
        <Icon className={`h-5 w-5 text-${variant || 'primary'}`} />
      </div>
    </div>
    {change && (
      <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
        {Math.abs(change)}% from last month
      </div>
    )}
  </Card>
);

const TopPerformerCard = ({ title, items }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">#{index + 1}</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">{item.name}</p>
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

const AdminDashboard = () => {
  const userStats = {
    total: "15,234",
    customers: "12,456",
    artists: "2,345",
    venues: "433",
    activeNow: "1,234",
  };

  const eventStats = {
    total: "456",
    active: "234",
    pending: "45",
    completed: "177",
  };

  const topArtists = [
    { name: "John Doe", stats: "45 shows • 4.9★", value: "₹123,456", change: "+12%" },
    { name: "Jane Smith", stats: "38 shows • 4.8★", value: "₹98,765", change: "+8%" },
    { name: "Mike Johnson", stats: "32 shows • 4.7★", value: "₹87,654", change: "+15%" },
  ];

  const topVenues = [
    { name: "Grand Arena", stats: "89 events • 4.8★", value: "₹234,567", change: "+15%" },
    { name: "City Theater", stats: "76 events • 4.7★", value: "₹198,432", change: "+10%" },
    { name: "Music Hall", stats: "65 events • 4.6★", value: "₹167,890", change: "+7%" },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-muted-foreground">Real-time platform statistics and analytics</p>
        </div>

        {/* User Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={userStats.total}
            subtitle={`${userStats.activeNow} currently active`}
            icon={Users}
            change={12}
          />
          <StatCard
            title="Total Artists"
            value={userStats.artists}
            subtitle="Professional performers"
            icon={Music2}
            change={8}
            variant="blue"
          />
          <StatCard
            title="Venue Partners"
            value={userStats.venues}
            subtitle="Registered locations"
            icon={Map}
            change={15}
            variant="green"
          />
          <StatCard
            title="Tickets Sold"
            value="45,678"
            subtitle="This month"
            icon={TicketIcon}
            change={23}
            variant="yellow"
          />
        </div>

        {/* Event Statistics */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
            <RevenueChart />
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Analytics</h3>
            <BookingTrendsChart />
          </Card>
        </div>

        {/* Demographics and Peak Hours */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Demographics</h3>
            <UserDemographicsChart />
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Peak Booking Hours</h3>
            <PeakHoursChart />
          </Card>
        </div>

        {/* Top Performers */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TopPerformerCard title="Top Artists" items={topArtists} />
          <TopPerformerCard title="Top Venues" items={topVenues} />
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
