import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchArtist from "../components/SearchArtist";
import FollowArtist from "../components/FollowArtist";

const Following = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h2 className="text-3xl font-bold">Artists & Following</h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="w-full sm:w-[400px] mb-6">
            <TabsTrigger value="discover" className="flex-1">
              Discover Artists
            </TabsTrigger>
            <TabsTrigger value="following" className="flex-1">
              Following Feed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <SearchArtist />
          </TabsContent>

          <TabsContent value="following">
            <FollowArtist />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Following;
