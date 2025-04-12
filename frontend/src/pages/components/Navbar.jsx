import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Link as Lk } from "react-router-dom";
import logo from '../../assets/logo.svg';
import logo2 from '../../assets/ettaralogo.jpg';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    console.log("Mode Changed");
  }, [darkMode]);

  return (
    <nav className="w-full border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="font-bold text-2xl flex flex-row items-center space-x-2">
          <img src={logo2} alt="Logo" className="h-24 w-auto" />
          <h1>X</h1>
          <img src={logo} alt="Logo" className="h-24 w-auto" /> 
          </div>

          {/* Navigation Links */}
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex space-x-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="hover:text-primary transition-colors text-xl text-bold"
                  href="/"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="hover:text-primary transition-colors text-xl text-bold"
                  href="/about"
                >
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="hover:text-primary transition-colors text-xl text-bold"
                  href="/contact"
                >
                  Contact Us
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle
              checked={darkMode}
              onClick={() => setDarkMode((prev) => !prev)}
            />
            <Lk to="/signup">
              <Button
                variant="outline"
                className="rounded min-w-24 transition-transform duration-300 hover:scale-105"
              >
                Sign Up
              </Button>
            </Lk>
            <Lk to="signin">
              <Button
                variant="default"
                className="rounded min-w-24 transition-transform duration-300 hover:scale-105"
              >
                Sign In
              </Button>
            </Lk>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
