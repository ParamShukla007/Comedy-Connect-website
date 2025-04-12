// constants/landingPageData.js
import { Calendar, DollarSign, Users } from "lucide-react";

export const emojiPositions = [
  { emoji: "😂", x: 15, y: 20 },
  { emoji: "🎭", x: 75, y: 15 },
  { emoji: "🎪", x: 85, y: 60 },
  { emoji: "🎵", x: 25, y: 70 },
  { emoji: "🎨", x: 45, y: 40 },
  { emoji: "✨", x: 65, y: 80 },
  { emoji: "🎤", x: 35, y: 25 },
  { emoji: "🌟", x: 55, y: 65 },
];

export const getFeatureIcon = (type) => {
  switch (type) {
    case 'calendar':
      return Calendar;
    case 'dollar':
      return DollarSign;
    case 'users':
      return Users;
    default:
      return null;
  }
};

export const features = [
  {
    iconType: 'calendar',
    title: "Smart Scheduling",
    description:
      "AI-powered scheduling system that helps you find the perfect time slots for your shows",
    color: "from-yellow-400 to-orange-500",
  },
  {
    iconType: 'dollar',
    title: "Seamless Payments",
    description:
      "Secure payment processing with instant transfers and detailed financial reporting",
    color: "from-pink-400 to-purple-500",
  },
  {
    iconType: 'users',
    title: "Community Building",
    description:
      "Connect with other comedians, venues, and fans to grow your network",
    color: "from-blue-400 to-indigo-500",
  },
];

export const statistics = [
  { number: "10K+", label: "Shows Booked" },
  { number: "500+", label: "Partner Venues" },
  { number: "2M+", label: "Tickets Sold" },
  { number: "50K+", label: "Active Users" },
];

export const testimonials = [
  {
    name: "Priya Sharma",
    username: "@priyasharma",
    body: "This platform has transformed how I approach hackathons. The mentorship is incredible!",
    img: "https://avatar.vercel.sh/priyasharma",
  },
  {
    name: "Arjun Patel",
    username: "@arjunp",
    body: "Found an amazing team through this platform. We went on to win our first hackathon!",
    img: "https://avatar.vercel.sh/arjunp",
  },
  {
    name: "Riya Desai",
    username: "@riyad",
    body: "The community here is so supportive. It's the perfect place for tech enthusiasts.",
    img: "https://avatar.vercel.sh/riyad",
  },
  {
    name: "Aditya Kumar",
    username: "@adityak",
    body: "As a beginner, I found the perfect mentors who helped me grow in my tech journey.",
    img: "https://avatar.vercel.sh/adityak",
  },
  {
    name: "Neha Gupta",
    username: "@nehag",
    body: "The workshops and resources available here are top-notch. Highly recommended!",
    img: "https://avatar.vercel.sh/nehag",
  },
  {
    name: "Rahul Verma",
    username: "@rahulv",
    body: "From ideation to execution, this platform provides everything you need to succeed.",
    img: "https://avatar.vercel.sh/rahulv",
  },
];
