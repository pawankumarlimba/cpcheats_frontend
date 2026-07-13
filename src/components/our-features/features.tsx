import React from "react";
import {  MessageSquare, Bell, Code, Layers, Search, Users, Book, Cpu, TrendingUp } from "lucide-react";



const features = [
  {
    icon: <Search size={40} className="text-pink-600" />,
    title: "Interview Analyzer",
    description: "Analyze and explore interview questions by company, year, and topic.",
  },
  {
    icon: <Layers size={40} className="text-indigo-600" />,
    title: "Copy-Paste Functionality",
    description: "Copy & paste functions to save time during contests.",
  },
  {
    icon: <MessageSquare size={40} className="text-green-600" />,
    title: "Read & Write Interview Experiences",
    description: "Share your interview journey and learn from others' experiences.",
  },
  {
    icon: <Code size={40} className="text-purple-600" />,
    title: "Multi-Language Code Editor & Algorithm Visualization",
    description: "Write, run, and debug code in multiple programming languages with real-time algorithm visualization.",
  },
  {
    icon: <TrendingUp size={40} className="text-blue-600" />,
    title: "Progress Tracker & Friend Comparison",
    description: "Monitor your coding journey, track topic-wise progress, and compare achievements with friends.",
  },
  {
    icon: <Cpu size={40} className="text-orange-600" />,
    title: "AI & Friends Mock Interviews",
    description: "Practice coding interviews with AI or friends in real-time mock sessions.",
  },
  {
    icon: <Book size={40} className="text-cyan-600" />,
    title: "Coding Sheets & Algorithm Explanations",
    description: "Study curated coding sheets (Striver, Love Babbar, NeetCode 150) with detailed explanations and topic-wise problems.",
  },
  {
    icon: <Bell size={40} className="text-red-600" />,
    title: "Instant Notifications & Updates",
    description: "Receive alerts for new interview questions, problems, and feature updates.",
  },
  {
    icon: <Users size={40} className="text-teal-600" />,
    title: "Live & AI-Assisted Coding Challenges",
    description: "Compete in live coding challenges and solve AI-assisted problem sets for practice.",
  }
];


const FeaturesSection = () => {
  return (
    <section className="bg-gradient-to-b from-white via-blue-50 to-gray-50 py-8">
      <div className="container-fluid  ">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">🚀 Our Features</h2>
        <p className="text-gray-600 mb-10">
          Designed to optimize your coding and interview preparation experience.
        </p>

        <div className="container-fluid px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 bg-white shadow-xl  transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-3xl"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
