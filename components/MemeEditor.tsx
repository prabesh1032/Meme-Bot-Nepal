import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Download, Upload, Image as ImageIcon, Trash2, Type, MoveVertical, Palette } from 'lucide-react';

interface MemeEditorProps {
  initialTopText?: string;
  initialBottomText?: string;
  initialImage?: string | null;
}

export const MemeEditor: React.FC<MemeEditorProps> = ({ 
  initialTopText = '', 
  initialBottomText = '',
  initialImage = null
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = useState(initialTopText);
  const [bottomText, setBottomText] = useState(initialBottomText);
  
  // Customization State
  const [topFontSize, setTopFontSize] = useState(10); // Scale factor (1-20)
  const [bottomFontSize, setBottomFontSize] = useState(10); // Scale factor (1-20)
  const [textColor, setTextColor] = useState<'white' | 'yellow' | 'black'>('white');
  const [topOffset, setTopOffset] = useState(5); // % from top
  const [bottomOffset, setBottomOffset] = useState(5); // % from bottom

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when props change
  useEffect(() => {
    if (initialTopText) setTopText(initialTopText);
    if (initialBottomText) setBottomText(initialBottomText);
    if (initialImage) {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = initialImage;
    }
  }, [initialTopText, initialBottomText, initialImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Text Wrapping Logic
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    // 1. Split by newlines first to respect user manual breaks
    const paragraphs = text.split('\n');
    let lines: string[] = [];

    paragraphs.forEach(paragraph => {
      // Handle empty lines (user double enter)
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
      // Dark background for better contrast with default white text
      ctx.fillStyle = '#1e293b'; // Slate 800
      ctx.fillRect(0, 0, width, height);
      
      // Placeholder pattern (X mark)
      ctx.strokeStyle = '#334155'; // Slate 700
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, height);
      ctx.moveTo(width, 0);
      ctx.lineTo(0, height);
      ctx.stroke();

      // Placeholder Text
      ctx.fillStyle = '#f1f5f9'; // Slate 100 - High Contrast
      ctx.font = 'bold 30px "Poppins", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Upload an Image to Start', width / 2, height / 2);
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
      // Configure specific font size for top
      const topScale = topFontSize / 10;
      const topFinalSize = Math.floor(baseSize * topScale);
      const topLineHeight = topFinalSize * 1.2;

      ctx.font = `900 ${topFinalSize}px "Impact", "Arial Black", sans-serif`;
      ctx.lineWidth = topFinalSize / 15;
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
      // Configure specific font size for bottom
      const bottomScale = bottomFontSize / 10;
      const bottomFinalSize = Math.floor(baseSize * bottomScale);
      const bottomLineHeight = bottomFinalSize * 1.2;

      ctx.font = `900 ${bottomFinalSize}px "Impact", "Arial Black", sans-serif`;
      ctx.lineWidth = bottomFinalSize / 15;
      ctx.textBaseline = 'bottom';
      
      const x = width / 2;
      const y = height - (height * (bottomOffset / 100));
      
      const lines = wrapText(ctx, bottomText.toUpperCase(), maxWidth);
      
      lines.forEach((line, i) => {
        // Draw from bottom upwards so the last line ends at the offset
        const lineY = y - ((lines.length - 1 - i) * bottomLineHeight);
        
        ctx.strokeText(line, x, lineY);
        ctx.fillText(line, x, lineY);
      });
    }

  }, [image, topText, bottomText, topFontSize, bottomFontSize, textColor, topOffset, bottomOffset]);

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
           {!image && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
               {/* Hidden icon since canvas draws the placeholder */}
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
                 Please upload an image first to download.
               </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};