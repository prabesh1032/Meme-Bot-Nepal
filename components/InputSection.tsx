import React from 'react';
import { FormData, Tone, Platform, Audience } from '../types';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';

interface InputSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ 
  formData, 
  setFormData, 
  onGenerate, 
  isLoading 
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border-t-4 border-[#DC143C]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Topic Input - Full Width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Trending Topic / Context
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="e.g., Balen's new rule, Momos price hike, Nepal Idol finale..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Tone</label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none bg-white text-gray-900"
          >
            {Object.values(Tone).map((t) => (
              <option key={t} value={t} className="text-gray-900">{t}</option>
            ))}
          </select>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Platform</label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none bg-white text-gray-900"
          >
            {Object.values(Platform).map((p) => (
              <option key={p} value={p} className="text-gray-900">{p}</option>
            ))}
          </select>
        </div>

        {/* Audience Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience</label>
          <select
            name="audience"
            value={formData.audience}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none bg-white text-gray-900"
          >
            {Object.values(Audience).map((a) => (
              <option key={a} value={a} className="text-gray-900">{a}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          onClick={onGenerate} 
          isLoading={isLoading} 
          disabled={!formData.topic.trim()}
          className="w-full md:w-auto text-lg"
        >
          {isLoading ? 'Cooking...' : 'Generate Content'} 
          {!isLoading && <Sparkles className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};