import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Flag,
  MessageSquare,
  Image,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";

const ReportCard = ({ report }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-500/10">
            <Flag className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{report.title}</h4>
                  <Badge
                    variant={
                      report.severity === "high"
                        ? "destructive"
                        : report.severity === "medium"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {report.severity}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Reported by {report.reportedBy}</span>
                  <Clock className="h-3 w-3 ml-2" />
                  <span>{report.time}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4"
                >
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm">{report.description}</p>
                  </div>
                  {report.evidence && (
                    <div className="grid grid-cols-2 gap-2">
                      {report.evidence.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-lg overflow-hidden bg-muted/50"
                        >
                          <img
                            src={item}
                            alt="Evidence"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex gap-2">
              <Button className="gap-2" onClick={() => {}}>
                <CheckCircle className="h-4 w-4" />
                Take Action
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => {}}>
                <XCircle className="h-4 w-4" />
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, title, value, change }) => (
  <Card className="p-6 bg-background/50 backdrop-blur-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="p-3 rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
    {change && (
      <p className="text-sm text-muted-foreground mt-2">
        {change > 0 ? "+" : ""}
        {change}% from last week
      </p>
    )}
  </Card>
);

const Moderation = () => {
  const reports = [
    {
      id: 1,
      title: "Inappropriate Content Report",
      description: "User reported inappropriate language in event description",
      time: "2 hours ago",
      type: "content",
      severity: "high",
      reportedBy: "John Doe",
      evidence: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
    // Add more mock data
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Content Moderation
          </h2>
          <p className="text-muted-foreground">
            Monitor and moderate platform content
          </p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Active Reports</AlertTitle>
          <AlertDescription>
            There are {reports.length} reports that require your attention.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </TabsContent>

          {/* Add other TabsContent components for different sections */}
        </Tabs>
      </div>
    </main>
  );
};

export default Moderation;
