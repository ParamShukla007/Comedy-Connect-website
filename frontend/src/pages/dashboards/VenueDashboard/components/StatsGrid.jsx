import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Users, DollarSign } from "lucide-react";

const StatsGrid = () => {
  const stats = [
    { title: 'Total Venues', count: 5, icon: <MapPin />, trend: '+2 this month' },
    { title: 'Total Revenue', count: '$12.5K', icon: <DollarSign />, trend: '+15% vs last month' },
    { title: 'Pending Proposals', count: 12, icon: <Calendar />, trend: '4 new today' },
    { title: 'Monthly Visitors', count: '2.3K', icon: <Users />, trend: '+8% vs last month' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </div>
              {stat.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
