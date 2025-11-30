import React, { useEffect, useState } from 'react';
import { Home, Sparkles, BrainCircuit, PaintBucket, Layers } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message }) => {
  const [activeText, setActiveText] = useState(0);
  const loadingTexts = [
    "Analyzing room geometry...",
    "Detecting furniture and lighting...",
    "Applying interior design principles...",
    "Rendering photorealistic textures...",
    "Finalizing your dream space..."
  ];

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveText((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/90 dark:bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-wait transition-all duration-300">
      <div className="relative">
        {/* Central Icon Stack */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-8">
          <div className="absolute inset-0 border-4 border-black/10 dark:border-white/10 rounded-xl"></div>
          <div className="absolute inset-0 border-4 border-black dark:border-white rounded-xl animate-pulse-slow"></div>
          
          {/* Scanning Line */}
          <div className="absolute left-[-10%] right-[-10%] h-1 bg-gradient-to-r from-transparent via-black dark:via-white to-transparent opacity-80 animate-scan z-10 blur-[1px]"></div>
          
          <Home size={40} className="text-black dark:text-white relative z-0" strokeWidth={1.5} />
          
          <div className="absolute -top-6 -right-6 animate-bounce delay-100">
            <Sparkles size={24} className="text-black dark:text-white" fill="currentColor" fillOpacity={0.2} />
          </div>
          <div className="absolute -bottom-4 -left-6 animate-bounce delay-700">
            <BrainCircuit size={20} className="text-black dark:text-white opacity-60" />
          </div>
        </div>
      </div>

      {/* Text Animation */}
      <div className="h-8 flex items-center justify-center">
        <p className="text-sm md:text-base font-sans uppercase tracking-widest text-black dark:text-white animate-fade-in text-center font-bold">
            {message || loadingTexts[activeText]}
        </p>
      </div>
      
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
            <div 
                key={i} 
                className="w-2 h-2 rounded-full bg-black dark:bg-white animate-bounce" 
                style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingOverlay;