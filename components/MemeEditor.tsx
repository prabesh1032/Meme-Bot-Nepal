import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Download, Upload, Image as ImageIcon, Trash2, Type, MoveVertical, Palette, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { generateMemeImage } from '../services/geminiService';

interface MemeEditorProps {
  initialTopText?: string;
  initialBottomText?: string;
  initialImage?: string | null;
}

// Pre-defined Nepali Templates with AI Prompts and Multiple Joke Variations
const NEPALI_TEMPLATES = [
  // --- POLITICAL ---
  {
    id: 'balen',
    label: 'Balen Dozer',
    icon: '🕶️',
    texts: [
      { top: 'MAP PASS CHAINA?', bottom: 'DOZER LYAU TA?' },
      { top: 'KATHMANDU MA', bottom: 'METRO CHALCHA' },
      { top: 'SABAI JANA', bottom: 'KAAM MA LAGNUS' },
      { top: 'TINKUNE KO', bottom: 'SAMASYA SAMADHAN' }
    ],
    prompt: 'Kathmandu Mayor Balen Shah caricature wearing black sunglasses, standing confidently with crossed arms, yellow bulldozer in background, digital art style',
  },
  {
    id: 'oli',
    label: 'Oli Ukhan',
    icon: '🎤',
    texts: [
      { top: 'TIMI TA HAINA', bottom: 'TIMRO BAJE LE SAKDAINA' },
      { top: 'GAS KO PIPE', bottom: 'GHAR GHAR MA PURYAUCHU' },
      { top: 'HAWA BATA BIJULI', bottom: 'NIKALCHU MA' },
      { top: 'AMBAK KHANUS', bottom: 'CORONA BHAGAUNUS' }
    ],
    prompt: 'KP Sharma Oli caricature wearing dhaka topi, pointing finger and laughing, funny expression, nepali political meme style',
  },
  {
    id: 'prachanda',
    label: 'Kursi Game',
    icon: '🪑',
    texts: [
      { top: 'PRADHANMANTRI KO PALO', bottom: 'FERI MERO AAYO' },
      { top: 'KURSI CHODNA', bottom: 'MANN LAGDAINA' },
      { top: 'JUNGLE BATA', bottom: 'MAHAL MA AAYE' }
    ],
    prompt: 'Pushpa Kamal Dahal Prachanda caricature, sitting on a large golden chair, looking cunning and happy, political cartoon style',
  },
  {
    id: 'rabi',
    label: 'Rabi Ghanti',
    icon: '🔔',
    texts: [
      { top: 'FILE KHULDAI CHA', bottom: 'READY BASNUS HAI' },
      { top: 'GHANTI BAJYO', bottom: 'BHRASTACHARI BHAGYO' },
      { top: 'MANTRI PAD', bottom: 'FERI CHAINCHA MALAI' }
    ],
    prompt: 'Rabi Lamichhane caricature looking intense and pointing finger, breaking news background with blue theme, digital art',
  },
  
  // --- DAILY LIFE & TRENDS ---
  {
    id: 'loadshedding',
    label: 'Loadshedding',
    icon: '🕯️',
    texts: [
        { top: 'BATTI GAYO', bottom: 'INVERTER CHAINCHA' },
        { top: 'ONLINE CLASS THIYO', bottom: 'BATTI GAYO SIR' },
        { top: 'KULMAN SIR', bottom: 'LIGHT BALIDINUS NA' },
        { top: 'MOBILE CHARGE', bottom: '2 PERCENT CHA' }
    ],
    prompt: 'A dark room with a single candle burning, a sad Nepali student looking at a laptop with no power, dramatic lighting, 4k realistic',
  },
  {
    id: 'bidesh',
    label: 'Bidesh Journey',
    icon: '✈️',
    texts: [
        { top: 'NEPAL MA FUTURE', bottom: 'DEKHINA MAILE' },
        { top: 'AIRPORT KO PHOTO', bottom: 'HALNA MANTHYO' },
        { top: 'DOLLAR KAMAUNE', bottom: 'SAPANA MATRA BHO' },
        { top: 'PLUS 2 SAKKYO', bottom: 'AUSTRALIA UDIYO' }
    ],
    prompt: 'A young Nepali person at Tribhuvan International Airport pushing a trolley with luggage, looking back emotionally, cinematic lighting',
  },
  {
    id: 'pathao',
    label: 'Pathao Rider',
    icon: '🛵',
    texts: [
        { top: 'LOCATION KAHA HO', bottom: 'DAI CANCEL GARDINU' },
        { top: 'DHULO KHADAI', bottom: 'BIKE MA YATRA' },
        { top: 'INDRIVER SASTO', bottom: 'PATHAO CHADNE HO' },
        { top: 'CHANGE CHAINA', bottom: 'ESEWA GARNUS' }
    ],
    prompt: 'A bike rider wearing a helmet and mask in dusty Kathmandu streets, looking confused at a phone map, funny meme style',
  },
  {
    id: 'bihe',
    label: 'Nepali Wedding',
    icon: '💍',
    texts: [
        { top: 'MERO BIHE', bottom: 'KAHILE HUNE HO' },
        { top: 'MASU BHAT KHANA', bottom: 'BIHE MA JANE' },
        { top: 'DULHA DULAHI', bottom: 'BHANDA MA HANDSOME' },
        { top: 'JANTI JANE HO', bottom: 'NAACHNA PAIYENA' }
    ],
    prompt: 'A traditional Nepali wedding groom and bride sitting, chaotic background with people eating buffet, funny illustration',
  },
  {
    id: 'cricket',
    label: 'Cricket Craze',
    icon: '🏏',
    texts: [
        { top: 'WORLD CUP', bottom: 'HAMRO NEPAL' },
        { top: 'PARAS DAI', bottom: 'FARKINU PARYO' },
        { top: 'CRICKET HERNA', bottom: 'OFFICE CHUTTI' },
        { top: 'TU GROUND MA', bottom: 'BARISH AAYO' }
    ],
    prompt: 'Nepali cricket fans cheering in a stadium with flags, painted faces, intense passion, realistic digital art',
  },
  
  // --- CLASSIC HITS ---
  {
    id: 'chiya',
    label: 'Chiya Guff',
    icon: '☕',
    texts: [
      { top: 'ARU KURA CHOD', bottom: 'CHIYA KHANA JAM' },
      { top: 'LOVE PARNE UMER MA', bottom: 'CHIYA CHISO BHAYO' },
      { top: 'PAISA CHAINA', bottom: 'SAATHI LAI CHIYA KHUWA' }
    ],
    prompt: 'Two Nepali friends sitting at a local tea shop holding tea glasses, laughing, bokeh background, realistic style',
  },
  {
    id: 'traffic',
    label: 'KTM Traffic',
    icon: '🚌',
    texts: [
      { top: 'OFFICE TIME MA', bottom: 'KOTESHWOR JAM' },
      { top: '5 MINUTE MA PUGCHU', bottom: '1 GHANTA LAGYO' },
      { top: 'BATO BANLA', bottom: 'KAHILE KAHILE' }
    ],
    prompt: 'Extremely chaotic traffic jam in Kathmandu, dust, buses, motorbikes, frustrated faces, hyper realistic',
  },
  {
    id: 'momo',
    label: 'Momo Love',
    icon: '🥟',
    texts: [
      { top: 'MOMO KHANA', bottom: 'JAHILE READY' },
      { top: 'VEG MOMO RE?', bottom: 'PAAP LAGCHA HAJUR' },
      { top: 'JHOL MOMO', bottom: 'IS AN EMOTION' }
    ],
    prompt: 'A plate of delicious steaming Nepali chicken momos with red chutney, close up food photography',
  },
  {
    id: 'bhat',
    label: 'Dal Bhat Power',
    icon: '🍚',
    texts: [
      { top: 'PIZZA BURGER HATAU', bottom: 'DAL BHAT LYAU' },
      { top: '24 HOUR POWER', bottom: 'DAL BHAT POWER' },
      { top: 'DIETING GARCHU', bottom: 'TARA BHAT THAPDEU' }
    ],
    prompt: 'A traditional Nepali brass plate (Thali) with rice, dal, curry, pickle, cinematic lighting',
  },
  {
    id: 'exam',
    label: 'Exam Tension',
    icon: '📚',
    texts: [
      { top: 'SYLLABUS HERDA', bottom: 'RINGATA LAGYO' },
      { top: 'PADHNA BASYO', bottom: 'NIDRA LAGYO' },
      { top: 'PASS MATRA HUNE', bottom: 'MERO LAKSHYA' },
      { top: 'QUESTION PAPER HERDA', bottom: 'SAB BIRSIYO' }
    ],
    prompt: 'A stressed Nepali student with pile of books, holding head in hands, looking confused, funny expression',
  },
  {
    id: 'salary',
    label: 'Salary Day',
    icon: '💸',
    texts: [
      { top: 'SALARY AAYO', bottom: 'SAKKYO' },
      { top: 'MONTH END MA', bottom: 'CHAU CHAU JINDAGANI' },
      { top: 'PAISA HAINA', bottom: 'KHUSHI KAMAUNU PARCHA' }
    ],
    prompt: 'A person looking at an empty wallet with a shocked and sad expression, digital art meme style',
  },
  {
    id: 'trek',
    label: 'Trekking Plan',
    icon: '🏔️',
    texts: [
      { top: 'PLAN BANAYO', bottom: 'CANCEL BHAYO' },
      { top: 'MUSTANG JANE', bottom: 'PAISA CHAINA' },
      { top: 'SAATHI HARU', bottom: 'DHOKA DIYO' }
    ],
    prompt: 'Group of friends with backpacks in the mountains, but looking disappointed or arguing, funny meme style',
  },
];

export const MemeEditor: React.FC<MemeEditorProps> = ({ 
  initialTopText = '', 
  initialBottomText = '',
  initialImage = null
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = useState(initialTopText);
  const [bottomText, setBottomText] = useState(initialBottomText);
  
  // Customization State
  const [topFontSize, setTopFontSize] = useState(10); 
  const [bottomFontSize, setBottomFontSize] = useState(10); 
  const [textColor, setTextColor] = useState<'white' | 'yellow' | 'black'>('white');
  const [topOffset, setTopOffset] = useState(5); 
  const [bottomOffset, setBottomOffset] = useState(5); 

  // Loading States
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when props change
  useEffect(() => {
    if (initialTopText) setTopText(initialTopText);
    if (initialBottomText) setBottomText(initialBottomText);
    if (initialImage) {
        loadImage(initialImage);
    }
  }, [initialTopText, initialBottomText, initialImage]);

  const loadImage = (src: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => setImage(img);
    img.src = src;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
            loadImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateClick = async (template: typeof NEPALI_TEMPLATES[0]) => {
    setLoadingTemplateId(template.id);
    setIsGenerating(true);
    
    // Pick a random joke from the available options
    const textOptions = template.texts;
    const randomText = textOptions[Math.floor(Math.random() * textOptions.length)];

    try {
        const generatedImageBase64 = await generateMemeImage(template.prompt);
        loadImage(generatedImageBase64);
        setTopText(randomText.top);
        setBottomText(randomText.bottom);
    } catch (error) {
        console.error("Failed to generate template", error);
        alert("Sorry, could not generate template image. Please try again.");
    } finally {
        setIsGenerating(false);
        setLoadingTemplateId(null);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Text Wrapping Logic
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const paragraphs = text.split('\n');
    let lines: string[] = [];

    paragraphs.forEach(paragraph => {
      if (!paragraph) {
        lines.push('');
        return;
      }
      const words = paragraph.split(' ');
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
    });

    return lines;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = image ? image.width : 800;
    const height = image ? image.height : 600;

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    if (image) {
      ctx.drawImage(image, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#1e293b'; 
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, height);
      ctx.moveTo(width, 0);
      ctx.lineTo(0, height);
      ctx.stroke();

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 30px "Poppins", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isGenerating ? 'Generating Template...' : 'Upload Image or Select Template', width / 2, height / 2);
    }

    // Common Text Settings
    const baseSize = Math.floor(width / 10);
    const maxWidth = width - (width * 0.1); // 5% padding each side
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.fillStyle = textColor === 'yellow' ? '#FFD700' : textColor === 'black' ? '#000000' : '#FFFFFF';
    ctx.strokeStyle = textColor === 'black' ? '#FFFFFF' : '#000000';

    // 2. Draw Top Text
    if (topText) {
      const topScale = topFontSize / 10;
      const topFinalSize = Math.floor(baseSize * topScale);
      const topLineHeight = topFinalSize * 1.2;

      ctx.font = `900 ${topFinalSize}px "Impact", "Arial Black", sans-serif`;
      ctx.lineWidth = topFinalSize / 8; // Thicker stroke for better readability
      ctx.textBaseline = 'top';
      
      const x = width / 2;
      const y = height * (topOffset / 100);
      
      const lines = wrapText(ctx, topText.toUpperCase(), maxWidth);
      lines.forEach((line, i) => {
        const lineY = y + (i * topLineHeight);
        ctx.strokeText(line, x, lineY);
        ctx.fillText(line, x, lineY);
      });
    }

    // 3. Draw Bottom Text
    if (bottomText) {
      const bottomScale = bottomFontSize / 10;
      const bottomFinalSize = Math.floor(baseSize * bottomScale);
      const bottomLineHeight = bottomFinalSize * 1.2;

      ctx.font = `900 ${bottomFinalSize}px "Impact", "Arial Black", sans-serif`;
      ctx.lineWidth = bottomFinalSize / 8; // Thicker stroke
      ctx.textBaseline = 'bottom';
      
      const x = width / 2;
      const y = height - (height * (bottomOffset / 100));
      
      const lines = wrapText(ctx, bottomText.toUpperCase(), maxWidth);
      
      lines.forEach((line, i) => {
        const lineY = y - ((lines.length - 1 - i) * bottomLineHeight);
        ctx.strokeText(line, x, lineY);
        ctx.fillText(line, x, lineY);
      });
    }

  }, [image, topText, bottomText, topFontSize, bottomFontSize, textColor, topOffset, bottomOffset, isGenerating]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `memebot-nepal-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border-t-4 border-[#003893]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Preview Area */}
        <div className="lg:col-span-7 bg-gray-900 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center relative min-h-[400px]">
           <canvas 
             ref={canvasRef} 
             className="max-w-full max-h-[600px] object-contain shadow-sm"
           />
           {isGenerating && (
             <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                <Loader2 className="w-10 h-10 animate-spin mb-2 text-[#DC143C]" />
                <p className="font-bold">Designing Template...</p>
             </div>
           )}
        </div>

        {/* Controls Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              🎨 Meme Studio
            </h2>
            <div className="flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                ref={fileInputRef}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="py-1 px-3 text-sm"
                disabled={isGenerating}
              >
                <Upload size={16} /> Upload
              </Button>
              {image && (
                <button 
                  onClick={clearImage}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* New Templates Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <Sparkles size={14} className="text-[#DC143C]"/> Quick Nepali Templates
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {NEPALI_TEMPLATES.map((tpl) => (
                    <button
                        key={tpl.id}
                        onClick={() => handleTemplateClick(tpl)}
                        disabled={isGenerating}
                        className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-lg border min-w-[100px] transition-all ${loadingTemplateId === tpl.id ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:border-[#DC143C] hover:bg-white hover:shadow-md'}`}
                    >
                        {loadingTemplateId === tpl.id ? (
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-1" />
                        ) : (
                            <span className="text-2xl mb-1">{tpl.icon}</span>
                        )}
                        <span className="text-xs font-semibold text-gray-700">{tpl.label}</span>
                    </button>
                ))}
            </div>
          </div>

          <div className="space-y-5">
            {/* Top Text Control */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Top Text</label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1" title="Position">
                    <MoveVertical size={14} className="text-gray-400"/>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={topOffset} 
                      onChange={(e) => setTopOffset(Number(e.target.value))}
                      className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-1" title="Size">
                    <Type size={14} className="text-gray-400"/>
                    <input 
                      type="range" 
                      min="5" 
                      max="20" 
                      value={topFontSize} 
                      onChange={(e) => setTopFontSize(Number(e.target.value))}
                      className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#DC143C]"
                    />
                  </div>
                </div>
              </div>
              <textarea
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="MA YESTO GARCHU..."
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#003893] focus:border-[#003893] outline-none uppercase font-bold text-gray-700 text-sm resize-none"
              />
            </div>

            {/* Bottom Text Control */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Bottom Text</label>
                 <div className="flex gap-4">
                  <div className="flex items-center gap-1" title="Position">
                    <MoveVertical size={14} className="text-gray-400"/>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={bottomOffset} 
                      onChange={(e) => setBottomOffset(Number(e.target.value))}
                      className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                   <div className="flex items-center gap-1" title="Size">
                    <Type size={14} className="text-gray-400"/>
                    <input 
                      type="range" 
                      min="5" 
                      max="20" 
                      value={bottomFontSize} 
                      onChange={(e) => setBottomFontSize(Number(e.target.value))}
                      className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#DC143C]"
                    />
                  </div>
                </div>
              </div>
              <textarea
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="TARA USELE YESTO GARYO..."
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#003893] focus:border-[#003893] outline-none uppercase font-bold text-gray-700 text-sm resize-none"
              />
            </div>

            {/* Formatting Controls */}
            <div className="grid grid-cols-1 gap-4">
               <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase mb-2">
                    <Palette size={14} /> Text Color
                  </label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setTextColor('white')}
                      className={`flex-1 h-9 rounded-md border shadow-sm font-medium text-xs flex items-center justify-center gap-2 ${textColor === 'white' ? 'ring-2 ring-[#003893] bg-gray-50 text-gray-900' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="w-4 h-4 rounded-full border border-gray-300 bg-white"></div> White
                    </button>
                    <button 
                      onClick={() => setTextColor('yellow')}
                      className={`flex-1 h-9 rounded-md border shadow-sm font-medium text-xs flex items-center justify-center gap-2 ${textColor === 'yellow' ? 'ring-2 ring-[#003893] bg-yellow-50 text-yellow-800' : 'bg-white text-gray-600 hover:bg-yellow-50'}`}
                    >
                      <div className="w-4 h-4 rounded-full border border-yellow-500 bg-[#FFD700]"></div> Yellow
                    </button>
                    <button 
                      onClick={() => setTextColor('black')}
                      className={`flex-1 h-9 rounded-md border shadow-sm font-medium text-xs flex items-center justify-center gap-2 ${textColor === 'black' ? 'ring-2 ring-[#003893] bg-gray-100 text-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="w-4 h-4 rounded-full border border-gray-600 bg-black"></div> Black
                    </button>
                  </div>
               </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={handleDownload} 
              className="w-full text-lg"
              disabled={!image}
            >
              <Download size={20} /> Download Meme
            </Button>
            {!image && (
               <p className="text-xs text-center text-red-500 mt-2">
                 Please upload an image or select a template above.
               </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};