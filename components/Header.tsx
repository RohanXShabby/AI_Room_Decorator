import React from 'react';
import { LayoutTemplate, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="w-full py-6 border-b border-black dark:border-white bg-white dark:bg-black sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutTemplate size={24} strokeWidth={1.5} className="text-black dark:text-white" />
          <h1 className="text-xl font-medium tracking-tight text-black dark:text-white">MONOSPACE</h1>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-colors text-black dark:text-white"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;