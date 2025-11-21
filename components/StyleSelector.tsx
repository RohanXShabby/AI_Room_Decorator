import React from 'react';
import { RoomStyle } from '../types';
import { Check } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: RoomStyle;
  onSelect: (style: RoomStyle) => void;
  customPrompt: string;
  onCustomPromptChange: (text: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  selectedStyle, 
  onSelect, 
  customPrompt, 
  onCustomPromptChange 
}) => {
  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest mb-4 border-b border-black dark:border-white pb-2 text-black dark:text-white">
          Select Aesthetic
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.values(RoomStyle).map((style) => (
            <button
              key={style}
              onClick={() => onSelect(style)}
              className={`
                relative h-14 border px-2 flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-200 rounded-md
                ${selectedStyle === style 
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                  : 'border-gray-200 text-gray-500 hover:border-black hover:text-black dark:border-gray-800 dark:text-gray-400 dark:hover:border-white dark:hover:text-white'
                }
              `}
            >
              {style}
              {selectedStyle === style && (
                <div className="absolute top-1 right-1">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest mb-4 border-b border-black dark:border-white pb-2 text-black dark:text-white">
          Refine (Optional)
        </h2>
        <textarea
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          placeholder="e.g., Add a large plant in the corner, make the floor light wood..."
          className="w-full p-4 border border-black dark:border-white bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white min-h-[100px] resize-none placeholder-gray-400 dark:placeholder-gray-600 text-black dark:text-white rounded-md"
        />
      </div>
    </div>
  );
};

export default StyleSelector;