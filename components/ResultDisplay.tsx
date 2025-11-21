import React from 'react';
import { Download, RotateCcw } from 'lucide-react';
import CostEstimator from './CostEstimator';

interface ResultDisplayProps {
  resultImage: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultImage, onReset }) => {
  return (
    <div className="animate-fade-in w-full space-y-4">
       <div className="flex items-center justify-between border-b border-black dark:border-white pb-2 mb-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-black dark:text-white">
          Result
        </h2>
        <div className="flex gap-2">
          <a 
            href={resultImage} 
            download="monospace-room.jpg"
            className="flex items-center gap-1 text-xs uppercase font-bold hover:underline text-black dark:text-white"
          >
            <Download size={14} /> Save
          </a>
        </div>
      </div>

      <div className="w-full relative border border-black dark:border-white p-2 bg-white dark:bg-black transition-colors duration-300 rounded-md">
        <img 
          src={resultImage} 
          alt="Redesigned Room" 
          className="w-full h-auto object-cover rounded-md"
        />
        <div className="absolute bottom-4 right-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs uppercase font-mono tracking-wider rounded-md">
          AI Generated
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200 text-sm uppercase font-medium tracking-wide text-black dark:text-white rounded-md"
        >
          <RotateCcw size={16} />
          Design Another
        </button>
      </div>

      {/* Cost Estimator Section */}
      <CostEstimator resultImage={resultImage} />
    </div>
  );
};

export default ResultDisplay;