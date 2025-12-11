import React from 'react';
import { Mountain } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Mountain className="w-6 h-6 text-[#DC143C]" />
          <span className="font-bold text-white">MemeBot Nepal</span>
        </div>
        <div className="text-sm text-center md:text-right">
          <p>Made with ❤️ for Nepali Creators.</p>
          <p className="text-xs text-gray-500 mt-1">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>
    </footer>
  );
};