import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Edit } from "lucide-react";

const ManagerHeader = ({ managerData, onEditClick }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={managerData.profile_image} />
              <AvatarFallback>{managerData.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{managerData.fullName}</h2>
              <p className="text-muted-foreground">{managerData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">Rs.{managerData.monthlyRevenue?.toLocaleString() || 100000}</p>
            </div>
            <Button onClick={onEditClick}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerHeader;
