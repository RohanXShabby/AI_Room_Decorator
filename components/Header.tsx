import React from 'react';
import { LayoutTemplate, Moon, Sun, User } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

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
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-colors text-black dark:text-white"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
          </button>
          
          {/* Clerk Authentication Buttons */}
          <div className="flex items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 text-xs md:text-sm font-sans uppercase font-bold tracking-wider px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity rounded-sm border border-transparent shadow-sm">
                  <User size={16} />
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border border-black dark:border-white"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;