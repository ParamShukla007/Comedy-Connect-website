import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Mail, Facebook, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t">
      <div className="container px-4 py-8 mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">ComedyConnect</h2>
            <p className="text-muted-foreground">
              Connecting Comedians, Venues, and Comedy Lovers
            </p>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Support
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col md:flex-row gap-4 md:gap-6">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="hover:text-primary transition-colors"
                    href="/for-comedians"
                  >
                    For Comedians
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="hover:text-primary transition-colors"
                    href="/for-venues"
                  >
                    For Venues
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="hover:text-primary transition-colors"
                    href="/help"
                  >
                    Help Center
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="hover:text-primary transition-colors"
                    href="/terms"
                  >
                    Terms
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="hover:text-primary transition-colors"
                    href="/privacy"
                  >
                    Privacy
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ComedyConnect. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Github className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
