import React, { useState } from 'react';
import { GeneratedIdea, MemeTemplate } from '../types';
import { Copy, Check, Video, Image, MessageSquare, Hash, PenTool, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface IdeaCardProps {
  idea: GeneratedIdea;
  index: number;
  onCreateMeme: (template: MemeTemplate) => Promise<void>;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index, onCreateMeme }) => {
  const [activeTab, setActiveTab] = useState<'meme' | 'reels' | 'captions'>('meme');
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateClick = async () => {
    setIsGeneratingImage(true);
    try {
      await onCreateMeme(idea.memeTemplate);
    } catch (error) {
      console.error("Error creating meme image", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const getCopyContent = () => {
    switch(activeTab) {
      case 'meme':
        return `Top: ${idea.memeTemplate.topText}\nBottom: ${idea.memeTemplate.bottomText}\n\n#${idea.memeTemplate.hashtags.join(' #')}`;
      case 'reels':
        return `Concept: ${idea.reelsScript.concept}\n\nScenes:\n${idea.reelsScript.scenes.map(s => `- ${s}`).join('\n')}\n\nDialogue:\n${idea.reelsScript.dialogue}`;
      case 'captions':
        return `Funny: ${idea.captions.funny}\n\nRelatable: ${idea.captions.relatable}\n\nDeep: ${idea.captions.deep}`;
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-lg line-clamp-1" title={idea.title}>
          #{index + 1} {idea.title}
        </h3>
        <button 
          onClick={() => handleCopy(getCopyContent())}
          className="text-gray-500 hover:text-[#DC143C] transition-colors p-2 rounded-full hover:bg-red-50"
          title="Copy current tab content"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('meme')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'meme' ? 'text-[#DC143C] border-b-2 border-[#DC143C] bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Image size={16} /> Meme
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'reels' ? 'text-[#DC143C] border-b-2 border-[#DC143C] bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Video size={16} /> Reels
        </button>
        <button
          onClick={() => setActiveTab('captions')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'captions' ? 'text-[#DC143C] border-b-2 border-[#DC143C] bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <MessageSquare size={16} /> Captions
        </button>
      </div>

      <div className="p-6 flex-grow overflow-y-auto max-h-[400px]">
        
        {activeTab === 'meme' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Template</span>
              <p className="font-semibold text-gray-800">{idea.memeTemplate.templateName}</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-[#DC143C]">
              <div className="mb-3">
                <span className="text-xs text-gray-500 block mb-1">Top Text</span>
                <p className="font-bold text-lg text-gray-900">{idea.memeTemplate.topText}</p>
              </div>
              <div className="border-t border-gray-300 my-2 pt-2">
                <span className="text-xs text-gray-500 block mb-1">Bottom Text</span>
                <p className="font-bold text-lg text-gray-900">{idea.memeTemplate.bottomText}</p>
              </div>
            </div>

            <Button 
              onClick={handleCreateClick}
              variant="secondary"
              className="w-full py-2 text-sm"
              disabled={isGeneratingImage}
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating Image...
                </>
              ) : (
                <>
                  <PenTool size={16} /> Create this Meme
                </>
              )}
            </Button>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visual Style</span>
              <p className="text-sm text-gray-600">{idea.memeTemplate.visualStyle}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {idea.memeTemplate.hashtags.map((tag, i) => (
                <span key={i} className="bg-blue-50 text-[#003893] text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Hash size={10} /> {tag.replace('#', '')}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Concept</span>
              <p className="font-medium text-gray-800">{idea.reelsScript.concept}</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-xs font-bold text-[#003893] uppercase tracking-wider block mb-2">Scene Breakdown</span>
              <ul className="space-y-2">
                {idea.reelsScript.scenes.map((scene, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold text-blue-400 min-w-[20px]">{i+1}.</span>
                    <span className="text-gray-700">{scene}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dialogue</span>
              <p className="italic text-gray-700 mt-1 bg-gray-50 p-3 rounded border border-gray-200">"{idea.reelsScript.dialogue}"</p>
            </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Audio</span>
                  <p className="text-gray-600">{idea.reelsScript.audioSuggestion}</p>
               </div>
               <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overlay Text</span>
                  <p className="text-gray-600">{idea.reelsScript.textOverlays}</p>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'captions' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1 block">Funny / Sarcastic</span>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{idea.captions.funny}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1 block">Relatable</span>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{idea.captions.relatable}</p>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1 block">Deep / Thought Provoking</span>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{idea.captions.deep}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};