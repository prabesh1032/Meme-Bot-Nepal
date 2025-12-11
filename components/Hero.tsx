import React from 'react';
import { Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="nepali-gradient text-white py-12 md:py-20 relative overflow-hidden">
      {/* Decorative patterns mimicking Dhaka Topi patterns abstractly */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-20 translate-y-20"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in-down">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>AI-Powered Nepali Creativity</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          MemeBot <span className="text-yellow-400">Nepal</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
          Create viral memes, engaging Reels scripts, and babal captions in seconds. 
          Perfect for Mememandu, TikTok, and Instagram Creators.
        </p>
      </div>
    </div>
  );
};