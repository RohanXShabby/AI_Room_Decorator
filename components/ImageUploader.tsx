import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { fileToBase64 } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onImageSelect(base64);
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onImageSelect(base64);
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  if (selectedImage) {
    return (
      <div className="w-full relative border border-black dark:border-white p-2 bg-white dark:bg-black transition-colors duration-300 rounded-md">
        <img 
          src={selectedImage} 
          alt="Original Room" 
          className="w-full h-64 md:h-96 object-cover filter grayscale-[20%] rounded-md"
        />
        <button 
          onClick={onClear}
          className="absolute top-4 right-4 bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200 rounded-md"
          aria-label="Remove image"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
        <div className="absolute bottom-4 left-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs uppercase font-mono tracking-wider rounded-md">
          Original
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        w-full h-64 md:h-96 border border-black dark:border-white flex flex-col items-center justify-center cursor-pointer transition-all duration-300 rounded-md
        ${isDragging 
          ? 'bg-black text-white dark:bg-white dark:text-black' 
          : 'bg-white dark:bg-black text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={inputRef} 
        onChange={handleFileChange} 
      />
      <div className="flex flex-col items-center gap-4">
        {isDragging ? (
            <Upload size={48} strokeWidth={1} />
        ) : (
            <ImageIcon size={48} strokeWidth={1} className="opacity-50" />
        )}
        <div className="text-center">
          <p className="text-lg font-light tracking-wide uppercase">
            {isDragging ? "Drop to Upload" : "Upload Room Image"}
          </p>
          <p className={`text-xs mt-2 font-mono ${isDragging ? 'text-gray-300 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
            Click or drag and drop
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;