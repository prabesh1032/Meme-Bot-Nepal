import React, { useState, useRef } from 'react';
import { generateMemeIdeas, generateMemeImage } from './services/geminiService';
import { FormData, MemeResponse, Tone, Platform, Audience, MemeTemplate } from './types';
import { InputSection } from './components/InputSection';
import { IdeaCard } from './components/IdeaCard';
import { MemeEditor } from './components/MemeEditor';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { Info, AlertCircle, PenTool, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'editor'>('generator');
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    tone: Tone.Relatable,
    platform: Platform.Instagram,
    audience: Audience.Youth,
  });

  const [response, setResponse] = useState<MemeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State to pass data to editor
  const [editorState, setEditorState] = useState<{
    topText: string;
    bottomText: string;
    image: string | null;
  }>({ topText: '', bottomText: '', image: null });
  
  const editorRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!formData.topic.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await generateMemeIdeas(formData);
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Maybe load-shedding? Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeme = async (template: MemeTemplate) => {
    try {
      // 1. Generate Image based on template
      const imagePrompt = `${template.templateName} - ${template.visualStyle}`;
      const base64Image = await generateMemeImage(imagePrompt);

      // 2. Set Editor State
      setEditorState({ 
        topText: template.topText, 
        bottomText: template.bottomText,
        image: base64Image
      });

      // 3. Switch Tabs and Scroll
      setActiveTab('editor');
      setTimeout(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (error) {
      console.error("Failed to generate image automatically", error);
      alert("Could not generate image automatically. Please upload one or try again.");
      
      // Still open editor with text
      setEditorState({ 
        topText: template.topText, 
        bottomText: template.bottomText,
        image: null
      });
      setActiveTab('editor');
      setTimeout(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Hero />
      
      <main className="container mx-auto px-4 -mt-10 relative z-20 flex-grow">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-md inline-flex">
              <button 
                onClick={() => setActiveTab('generator')}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  activeTab === 'generator' 
                    ? 'bg-[#DC143C] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Sparkles size={18} /> AI Idea Generator
              </button>
              <button 
                onClick={() => setActiveTab('editor')}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  activeTab === 'editor' 
                    ? 'bg-[#003893] text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <PenTool size={18} /> Meme Studio
              </button>
            </div>
          </div>

          {activeTab === 'generator' ? (
            <div className="animate-fade-in">
              <InputSection 
                formData={formData} 
                setFormData={setFormData} 
                onGenerate={handleGenerate} 
                isLoading={loading}
              />
              
              {error && (
                <div className="mt-8 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {loading && (
                <div className="mt-12 text-center text-gray-500 py-12">
                   <div className="animate-bounce mb-4 text-4xl">🥟</div>
                   <p className="text-lg font-medium">Cooking up fresh content...</p>
                   <p className="text-sm">Chia khadai garnus (Grab some tea)</p>
                </div>
              )}

              {!loading && !response && !error && (
                <div className="mt-12 text-center text-gray-400 py-12 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Info className="w-8 h-8 text-gray-300" />
                  </div>
                  <p>Enter a topic above to generate viral Nepali content ideas.</p>
                </div>
              )}

              {response && (
                <div className="mt-12 space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Generated Ideas 🚀</h2>
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                      {formData.topic} • {formData.tone}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {response.ideas.map((idea, index) => (
                      <IdeaCard 
                        key={index} 
                        idea={idea} 
                        index={index} 
                        onCreateMeme={handleCreateMeme}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in" ref={editorRef}>
               <MemeEditor 
                 initialTopText={editorState.topText} 
                 initialBottomText={editorState.bottomText} 
                 initialImage={editorState.image}
               />
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;