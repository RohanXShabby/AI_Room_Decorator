import React, { useState } from 'react';
import { RoomStyle } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import InstallPrompt from './components/InstallPrompt';
import { generateRoomRedesign } from './services/geminiService';
import { Loader2, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<RoomStyle>(RoomStyle.MINIMALIST);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Handlers
  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateRoomRedesign(selectedImage, selectedStyle, customPrompt);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setCustomPrompt("");
    setError(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black pb-20 transition-colors duration-300">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <main className="max-w-5xl mx-auto px-4 mt-6 md:mt-12 space-y-8 md:space-y-12">
          {/* Intro */}
          {!selectedImage && !generatedImage && (
            <div className="text-center space-y-4 py-6 md:py-10 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight">
                Reimagine your space.
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-light text-sm md:text-base">
                Upload a photo of your room and let our AI transform it into a masterpiece of minimalist design.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="w-full border border-red-500 bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-400 text-sm font-mono flex justify-between items-center rounded-md">
              <span>ERROR: {error}</span>
              <button onClick={() => setError(null)} className="underline">Dismiss</button>
            </div>
          )}

          {/* Application Flow */}
          <div className="grid grid-cols-1 gap-8 md:gap-12">
            
            {/* Step 1: Upload & Preview */}
            <section className={`transition-all duration-500 ${generatedImage ? 'hidden' : 'block'}`}>
              <ImageUploader 
                selectedImage={selectedImage}
                onImageSelect={(img) => {
                  setSelectedImage(img);
                  setError(null);
                }}
                onClear={() => {
                  setSelectedImage(null);
                  setError(null);
                }}
              />
            </section>

            {/* Step 2: Controls (Visible only if image is selected and not generated yet) */}
            {selectedImage && !generatedImage && (
              <section className="animate-fade-in space-y-8">
                <StyleSelector 
                  selectedStyle={selectedStyle}
                  onSelect={setSelectedStyle}
                  customPrompt={customPrompt}
                  onCustomPromptChange={setCustomPrompt}
                />
                
                <div className="flex justify-end pt-4 border-t border-black dark:border-white">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="
                      group relative bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-sm uppercase font-bold tracking-widest 
                      hover:bg-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full md:w-auto rounded-md
                    "
                  >
                    <span className="flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Processing...
                        </>
                      ) : (
                        <>
                          Generate Transformation
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </section>
            )}

            {/* Step 3: Result View */}
            {generatedImage && (
              <section className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase text-gray-400 dark:text-gray-500">Original</h3>
                  <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                    <img src={selectedImage!} alt="Original" className="w-full opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <div className="space-y-2">
                   <h3 className="text-xs font-mono uppercase text-black dark:text-white font-bold">Transformed ({selectedStyle})</h3>
                   <ResultDisplay resultImage={generatedImage} onReset={handleReset} />
                </div>
              </section>
            )}

          </div>
        </main>
        
        {/* PWA Install Prompt */}
        <InstallPrompt />
      </div>
    </div>
  );
};

export default App;